use crate::aggregator::{Aggregator, TimeSeriesPoint};
use crate::error::Result;
use crate::parsers::SessionScanner;
use crate::config::AppSettings;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DataResponse {
    pub period: String,
    pub total_cost: f64,
    pub total_tokens: i64,
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub cache_read_tokens: i64,
    pub cache_write_tokens: i64,
    pub session_count: i64,
    pub avg_cost_per_session: f64,
    pub cost_by_model: HashMap<String, f64>,
    pub cost_by_provider: HashMap<String, f64>,
    pub model_providers: HashMap<String, String>,
    pub model_tools: HashMap<String, Vec<String>>,
    pub input_tokens_by_model: HashMap<String, i64>,
    pub output_tokens_by_model: HashMap<String, i64>,
    pub time_series: Vec<TimeSeriesPoint>,
}

#[tauri::command]
pub async fn get_daily_data() -> Result<DataResponse> {
    let settings = AppSettings::load()?;

    let sessions = SessionScanner::scan(
        &settings.data_paths.enabled_clients,
        &settings.data_paths.extra_dirs,
    )
    .await?;

    // Aggregate for 5-hour rolling window
    let agg = Aggregator::aggregate_daily(&sessions);

    let avg_cost_per_session = if agg.session_count > 0 {
        agg.total_cost / agg.session_count as f64
    } else {
        0.0
    };

    Ok(DataResponse {
        period: agg.period,
        total_cost: agg.total_cost,
        total_tokens: agg.total_tokens,
        input_tokens: agg.input_tokens,
        output_tokens: agg.output_tokens,
        cache_read_tokens: agg.cache_read_tokens,
        cache_write_tokens: agg.cache_write_tokens,
        session_count: agg.session_count,
        avg_cost_per_session,
        cost_by_model: agg.cost_by_model,
        cost_by_provider: agg.cost_by_provider,
        model_providers: agg.model_providers,
        model_tools: agg.model_tools,
        input_tokens_by_model: agg.input_tokens_by_model,
        output_tokens_by_model: agg.output_tokens_by_model,
        time_series: agg.time_series,
    })
}

#[tauri::command]
pub async fn get_weekly_data() -> Result<DataResponse> {
    let settings = AppSettings::load()?;

    let sessions = SessionScanner::scan(
        &settings.data_paths.enabled_clients,
        &settings.data_paths.extra_dirs,
    )
    .await?;
    let agg = Aggregator::aggregate_weekly(&sessions);

    let avg_cost_per_session = if agg.session_count > 0 {
        agg.total_cost / agg.session_count as f64
    } else {
        0.0
    };

    Ok(DataResponse {
        period: agg.period,
        total_cost: agg.total_cost,
        total_tokens: agg.total_tokens,
        input_tokens: agg.input_tokens,
        output_tokens: agg.output_tokens,
        cache_read_tokens: agg.cache_read_tokens,
        cache_write_tokens: agg.cache_write_tokens,
        session_count: agg.session_count,
        avg_cost_per_session,
        cost_by_model: agg.cost_by_model,
        cost_by_provider: agg.cost_by_provider,
        model_providers: agg.model_providers,
        model_tools: agg.model_tools,
        input_tokens_by_model: agg.input_tokens_by_model,
        output_tokens_by_model: agg.output_tokens_by_model,
        time_series: agg.time_series,
    })
}

#[tauri::command]
pub async fn get_monthly_data() -> Result<DataResponse> {
    let settings = AppSettings::load()?;

    let sessions = SessionScanner::scan(
        &settings.data_paths.enabled_clients,
        &settings.data_paths.extra_dirs,
    )
    .await?;
    let agg = Aggregator::aggregate_monthly(&sessions);

    let avg_cost_per_session = if agg.session_count > 0 {
        agg.total_cost / agg.session_count as f64
    } else {
        0.0
    };

    Ok(DataResponse {
        period: agg.period,
        total_cost: agg.total_cost,
        total_tokens: agg.total_tokens,
        input_tokens: agg.input_tokens,
        output_tokens: agg.output_tokens,
        cache_read_tokens: agg.cache_read_tokens,
        cache_write_tokens: agg.cache_write_tokens,
        session_count: agg.session_count,
        avg_cost_per_session,
        cost_by_model: agg.cost_by_model,
        cost_by_provider: agg.cost_by_provider,
        model_providers: agg.model_providers,
        model_tools: agg.model_tools,
        input_tokens_by_model: agg.input_tokens_by_model,
        output_tokens_by_model: agg.output_tokens_by_model,
        time_series: agg.time_series,
    })
}
