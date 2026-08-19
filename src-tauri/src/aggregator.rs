use crate::parsers::Session;
use chrono::{DateTime, Datelike, Duration, Local, NaiveDate, Timelike, Utc};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TimeSeriesPoint {
    pub label: String,
    pub timestamp: String,
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub cache_read_tokens: i64,
    pub cache_write_tokens: i64,
    pub total_tokens: i64,
    pub cost: f64,
    pub session_count: i64,
    pub in_window: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AggregatedData {
    pub period: String, // "5h-rolling", "7d", "1mo"
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub total_cost: f64,
    pub total_tokens: i64,
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub cache_read_tokens: i64,
    pub cache_write_tokens: i64,
    pub session_count: i64,
    pub cost_by_model: HashMap<String, f64>,
    pub cost_by_provider: HashMap<String, f64>,
    /// Which provider each model belongs to, so the UI can show provider
    /// details inline next to a model's cost instead of requiring a
    /// separate lookup against `cost_by_provider`.
    pub model_providers: HashMap<String, String>,
    pub model_tools: HashMap<String, Vec<String>>,
    pub input_tokens_by_model: HashMap<String, i64>,
    pub output_tokens_by_model: HashMap<String, i64>,
    pub time_series: Vec<TimeSeriesPoint>,
    pub sessions: Vec<Session>,
}

pub struct Aggregator;

impl Aggregator {
    /// Aggregate sessions for the last 5 rolling hours
    pub fn aggregate_daily(sessions: &[Session]) -> AggregatedData {
        let now = Utc::now();
        let five_hours_ago = now - Duration::hours(5);

        Self::aggregate_by_timerange(sessions, five_hours_ago, now, "5h-rolling")
    }

    /// Aggregate sessions for the last 7 rolling days
    pub fn aggregate_weekly(sessions: &[Session]) -> AggregatedData {
        let now = Utc::now();
        let seven_days_ago = now - Duration::days(7);

        Self::aggregate_by_timerange(sessions, seven_days_ago, now, "7d")
    }

    /// Aggregate sessions for the current calendar month
    pub fn aggregate_monthly(sessions: &[Session]) -> AggregatedData {
        let now = Local::now();
        let month_start = Local::now()
            .with_day(1)
            .unwrap()
            .with_hour(0)
            .unwrap()
            .with_minute(0)
            .unwrap()
            .with_second(0)
            .unwrap();

        let start_time = month_start.to_utc();
        let end_time = now.to_utc();

        Self::aggregate_by_timerange(sessions, start_time, end_time, "1mo")
    }

    fn aggregate_by_timerange(
        sessions: &[Session],
        start: DateTime<Utc>,
        end: DateTime<Utc>,
        period: &str,
    ) -> AggregatedData {
        let mut filtered_sessions = Vec::new();
        let mut cost_by_model = HashMap::new();
        let mut cost_by_provider = HashMap::new();
        let mut model_providers = HashMap::new();
        let mut model_tools_map: HashMap<String, HashSet<String>> = HashMap::new();
        let mut input_tokens_by_model = HashMap::new();
        let mut output_tokens_by_model = HashMap::new();
        let mut total_cost = 0.0;
        let mut total_tokens: i64 = 0;
        let mut input_tokens: i64 = 0;
        let mut output_tokens: i64 = 0;
        let mut cache_read_tokens: i64 = 0;
        let mut cache_write_tokens: i64 = 0;

        for session in sessions {
            if session.timestamp >= start && session.timestamp <= end {
                filtered_sessions.push(session.clone());

                // Accumulate costs by model
                *cost_by_model.entry(session.model.clone()).or_insert(0.0) += session.cost;

                // Accumulate costs by provider
                *cost_by_provider.entry(session.provider.clone()).or_insert(0.0) += session.cost;

                // Record which provider this model belongs to (a model id
                // maps to exactly one provider in practice).
                model_providers
                    .entry(session.model.clone())
                    .or_insert_with(|| session.provider.clone());

                // Record which tools/sources consumed this model
                model_tools_map
                    .entry(session.model.clone())
                    .or_default()
                    .insert(session.source.clone());

                // Accumulate input/output tokens per model
                *input_tokens_by_model.entry(session.model.clone()).or_insert(0) +=
                    session.input_tokens;
                *output_tokens_by_model.entry(session.model.clone()).or_insert(0) +=
                    session.output_tokens;

                total_cost += session.cost;
                total_tokens += session.input_tokens
                    + session.output_tokens
                    + session.cache_read_tokens
                    + session.cache_write_tokens;
                input_tokens += session.input_tokens;
                output_tokens += session.output_tokens;
                cache_read_tokens += session.cache_read_tokens;
                cache_write_tokens += session.cache_write_tokens;
            }
        }

        // Count DISTINCT session ids, not the number of message rows (a
        // single conversation session can span many UnifiedMessage rows).
        let session_count = filtered_sessions
            .iter()
            .map(|s| s.session_id.as_str())
            .collect::<HashSet<&str>>()
            .len() as i64;

        // Build time series buckets according to period
        let mut time_buckets: Vec<(DateTime<Utc>, DateTime<Utc>, String, bool)> = Vec::new();
        if period == "5h-rolling" {
            let local_now = Local::now();
            let current_hour_start = local_now
                .with_minute(0)
                .unwrap()
                .with_second(0)
                .unwrap();

            // 12 1-hour buckets covering the last 12 hours up to current hour
            let start_12h = current_hour_start - Duration::hours(11);
            let hour_step = Duration::hours(1);

            for i in 0..12 {
                let b_start = (start_12h + Duration::hours(i)).to_utc();
                let b_end = b_start + hour_step;
                let label = b_start.with_timezone(&Local).format("%H:00").to_string();
                let in_window = b_end > start && b_start < end;
                time_buckets.push((b_start, b_end, label, in_window));
            }
        } else if period == "7d" {
            let day_step = Duration::days(1);
            let mut b_start = start;
            for _ in 0..7 {
                let b_end = (b_start + day_step).min(end);
                let label = b_start.with_timezone(&Local).format("%a %b %d").to_string();
                time_buckets.push((b_start, b_end, label, true));
                b_start = b_start + day_step;
                if b_start >= end {
                    break;
                }
            }
        } else {
            // "1mo" or default
            let day_step = Duration::days(1);
            let mut b_start = start;
            while b_start < end {
                let b_end = (b_start + day_step).min(end);
                let label = b_start.with_timezone(&Local).format("%b %d").to_string();
                time_buckets.push((b_start, b_end, label, true));
                b_start = b_start + day_step;
            }
        }

        let mut time_series = Vec::new();
        for (b_start, b_end, label, in_window) in time_buckets {
            let mut b_input = 0;
            let mut b_output = 0;
            let mut b_cache_read = 0;
            let mut b_cache_write = 0;
            let mut b_cost = 0.0;
            let mut b_sessions = HashSet::new();

            for session in sessions {
                if session.timestamp >= b_start && session.timestamp < b_end {
                    b_input += session.input_tokens;
                    b_output += session.output_tokens;
                    b_cache_read += session.cache_read_tokens;
                    b_cache_write += session.cache_write_tokens;
                    b_cost += session.cost;
                    b_sessions.insert(session.session_id.as_str());
                }
            }

            let b_total = b_input + b_output + b_cache_read + b_cache_write;
            time_series.push(TimeSeriesPoint {
                label,
                timestamp: b_start.to_rfc3339(),
                input_tokens: b_input,
                output_tokens: b_output,
                cache_read_tokens: b_cache_read,
                cache_write_tokens: b_cache_write,
                total_tokens: b_total,
                cost: b_cost,
                session_count: b_sessions.len() as i64,
                in_window,
            });
        }

        let model_tools: HashMap<String, Vec<String>> = model_tools_map
            .into_iter()
            .map(|(m, tools)| {
                let mut list: Vec<String> = tools.into_iter().collect();
                list.sort();
                (m, list)
            })
            .collect();

        AggregatedData {
            period: period.to_string(),
            start_time: start,
            end_time: end,
            total_cost,
            total_tokens,
            input_tokens,
            output_tokens,
            cache_read_tokens,
            cache_write_tokens,
            session_count,
            cost_by_model,
            cost_by_provider,
            model_providers,
            model_tools,
            input_tokens_by_model,
            output_tokens_by_model,
            time_series,
            sessions: filtered_sessions,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::Utc;

    fn create_test_session(session_id: &str, hours_ago: i64, cost: f64) -> Session {
        let timestamp = Utc::now() - Duration::hours(hours_ago);
        Session {
            session_id: session_id.to_string(),
            timestamp,
            source: "claude-code".to_string(),
            model: "claude-opus".to_string(),
            provider: "anthropic".to_string(),
            input_tokens: 1000,
            output_tokens: 500,
            cache_read_tokens: 0,
            cache_write_tokens: 0,
            cost,
        }
    }

    #[test]
    fn test_aggregate_daily_filters_correctly() {
        let sessions = vec![
            create_test_session("session-1", 2, 5.0),  // Within 5 hours
            create_test_session("session-2", 6, 3.0),  // Outside 5 hours
        ];

        let agg = Aggregator::aggregate_daily(&sessions);
        assert_eq!(agg.session_count, 1);
        assert_eq!(agg.total_cost, 5.0);
    }

    #[test]
    fn test_aggregate_accumulates_costs_by_model() {
        let mut s1 = create_test_session("session-1", 2, 5.0);
        s1.model = "claude-opus".to_string();

        let mut s2 = create_test_session("session-2", 1, 3.0);
        s2.model = "claude-opus".to_string();

        let agg = Aggregator::aggregate_daily(&[s1, s2]);
        assert_eq!(agg.cost_by_model.get("claude-opus"), Some(&8.0));
    }

    #[test]
    fn test_aggregate_accumulates_tokens() {
        let sessions = vec![
            create_test_session("session-1", 2, 5.0),
            create_test_session("session-2", 1, 3.0),
        ];

        let agg = Aggregator::aggregate_daily(&sessions);
        assert_eq!(agg.total_tokens, 2 * (1000 + 500));
        assert_eq!(agg.input_tokens, 2 * 1000);
        assert_eq!(agg.output_tokens, 2 * 500);
    }

    #[test]
    fn test_aggregate_includes_cache_tokens_in_total() {
        let mut s1 = create_test_session("session-1", 2, 5.0);
        s1.cache_read_tokens = 4000;
        s1.cache_write_tokens = 100;

        let agg = Aggregator::aggregate_daily(&[s1]);
        assert_eq!(agg.cache_read_tokens, 4000);
        assert_eq!(agg.cache_write_tokens, 100);
        // total_tokens must reflect everything cost was computed from:
        // input + output + cache_read + cache_write.
        assert_eq!(agg.total_tokens, 1000 + 500 + 4000 + 100);
    }

    #[test]
    fn test_session_count_counts_distinct_sessions_not_messages() {
        // Two messages belonging to the SAME conversation session should
        // count as ONE session, not two.
        let sessions = vec![
            create_test_session("session-1", 2, 5.0),
            create_test_session("session-1", 1, 3.0),
            create_test_session("session-2", 1, 2.0),
        ];

        let agg = Aggregator::aggregate_daily(&sessions);
        assert_eq!(agg.session_count, 2);
        assert_eq!(agg.total_cost, 10.0);
    }

    #[test]
    fn test_aggregate_tracks_model_providers() {
        let mut s1 = create_test_session("session-1", 2, 5.0);
        s1.model = "claude-opus".to_string();
        s1.provider = "anthropic".to_string();

        let mut s2 = create_test_session("session-2", 1, 3.0);
        s2.model = "gpt-4o".to_string();
        s2.provider = "openai".to_string();

        let agg = Aggregator::aggregate_daily(&[s1, s2]);
        assert_eq!(agg.model_providers.get("claude-opus"), Some(&"anthropic".to_string()));
        assert_eq!(agg.model_providers.get("gpt-4o"), Some(&"openai".to_string()));
    }

    #[test]
    fn test_aggregate_tracks_tokens_by_model() {
        let mut s1 = create_test_session("session-1", 2, 5.0);
        s1.model = "claude-opus".to_string();
        s1.input_tokens = 1000;
        s1.output_tokens = 500;

        let mut s2 = create_test_session("session-2", 1, 3.0);
        s2.model = "claude-opus".to_string();
        s2.input_tokens = 200;
        s2.output_tokens = 100;

        let mut s3 = create_test_session("session-3", 1, 2.0);
        s3.model = "gpt-4o".to_string();
        s3.input_tokens = 50;
        s3.output_tokens = 25;

        let agg = Aggregator::aggregate_daily(&[s1, s2, s3]);
        assert_eq!(agg.input_tokens_by_model.get("claude-opus"), Some(&1200));
        assert_eq!(agg.output_tokens_by_model.get("claude-opus"), Some(&600));
        assert_eq!(agg.input_tokens_by_model.get("gpt-4o"), Some(&50));
        assert_eq!(agg.output_tokens_by_model.get("gpt-4o"), Some(&25));
    }
}
