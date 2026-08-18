use crate::error::{AppError, Result};
use chrono::{DateTime, TimeZone, Utc};
use serde::{Deserialize, Serialize};
use tokscale_core::sessions::UnifiedMessage;
use tokscale_core::{parse_local_unified_messages, scanner::ScannerSettings, LocalParseOptions};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub session_id: String,
    pub timestamp: DateTime<Utc>,
    pub source: String, // "claude", "opencode", "cursor", etc. (tokscale ClientId)
    pub model: String,
    pub provider: String, // "anthropic", "openai", "google", etc.
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub cache_read_tokens: i64,
    pub cache_write_tokens: i64,
    pub cost: f64,
}

impl From<&UnifiedMessage> for Session {
    fn from(msg: &UnifiedMessage) -> Self {
        Self {
            session_id: msg.session_id.clone(),
            // tokscale-core's UnifiedMessage.timestamp is always milliseconds.
            timestamp: Utc
                .timestamp_millis_opt(msg.timestamp)
                .single()
                .unwrap_or_else(Utc::now),
            source: msg.client.clone(),
            model: msg.model_id.clone(),
            provider: msg.provider_id.clone(),
            input_tokens: msg.tokens.input,
            output_tokens: msg.tokens.output,
            cache_read_tokens: msg.tokens.cache_read,
            cache_write_tokens: msg.tokens.cache_write,
            cost: msg.cost,
        }
    }
}

pub struct SessionScanner;

impl SessionScanner {
    /// `client_ids` are tokscale `ClientId::as_str()` values (e.g. "claude",
    /// "opencode", "cursor", "copilot"). `extra_dirs` are (client_id, path)
    /// pairs the user configured as custom scan locations.
    pub async fn scan(client_ids: &[String], extra_dirs: &[(String, String)]) -> Result<Vec<Session>> {
        let home_dir = dirs::home_dir()
            .map(|p| p.to_string_lossy().to_string())
            .ok_or_else(|| AppError::Custom("Could not resolve home directory".to_string()))?;

        let mut scanner_settings = ScannerSettings::default();
        for (client_id, path) in extra_dirs {
            scanner_settings
                .extra_scan_paths
                .entry(client_id.clone())
                .or_default()
                .push(std::path::PathBuf::from(path));
        }

        let options = LocalParseOptions {
            home_dir: Some(home_dir),
            use_env_roots: true,
            clients: Some(client_ids.to_vec()),
            since: None,
            until: None,
            year: None,
            scanner_settings,
        };

        let messages = parse_local_unified_messages(options)
            .await
            .map_err(AppError::Custom)?;

        Ok(messages.iter().map(Session::from).collect())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_session_from_unified_message() {
        let msg = UnifiedMessage::new(
            "claude".to_string(),
            "claude-opus".to_string(),
            "anthropic".to_string(),
            "session-1".to_string(),
            1_700_000_000,
            tokscale_core::TokenBreakdown {
                input: 1000,
                output: 500,
                cache_read: 0,
                cache_write: 0,
                reasoning: 0,
            },
            5.0,
        );

        let session = Session::from(&msg);
        assert_eq!(session.session_id, "session-1");
        assert_eq!(session.source, "claude");
        assert_eq!(session.model, "claude-opus");
        assert_eq!(session.input_tokens, 1000);
        assert_eq!(session.output_tokens, 500);
        assert_eq!(session.cache_read_tokens, 0);
        assert_eq!(session.cache_write_tokens, 0);
        assert_eq!(session.cost, 5.0);
    }

    #[test]
    fn test_session_from_unified_message_captures_cache_tokens() {
        let msg = UnifiedMessage::new(
            "claude".to_string(),
            "claude-opus".to_string(),
            "anthropic".to_string(),
            "session-2".to_string(),
            1_700_000_000,
            tokscale_core::TokenBreakdown {
                input: 1000,
                output: 500,
                cache_read: 200,
                cache_write: 50,
                reasoning: 0,
            },
            5.0,
        );

        let session = Session::from(&msg);
        assert_eq!(session.cache_read_tokens, 200);
        assert_eq!(session.cache_write_tokens, 50);
    }
}
