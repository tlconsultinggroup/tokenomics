use crate::error::Result;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub data_paths: DataPaths,
    pub refresh_interval_secs: u64,
    pub currency: String,
    pub pricing_overrides: std::collections::HashMap<String, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DataPaths {
    /// tokscale ClientId strings the user wants scanned, e.g. "claude", "opencode", "cursor", "copilot".
    pub enabled_clients: Vec<String>,
    /// (client_id, extra_directory) pairs for custom scan locations beyond tokscale's defaults.
    pub extra_dirs: Vec<(String, String)>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            data_paths: DataPaths::default_clients(),
            refresh_interval_secs: 300, // 5 minutes
            currency: "USD".to_string(),
            pricing_overrides: std::collections::HashMap::new(),
        }
    }
}

impl DataPaths {
    /// Default to the most common clients; tokscale-core auto-locates their
    /// directories under the user's home directory, so no path detection is
    /// needed here.
    pub fn default_clients() -> Self {
        Self {
            enabled_clients: vec![
                "claude".to_string(),
                "opencode".to_string(),
                "cursor".to_string(),
                "copilot".to_string(),
            ],
            extra_dirs: Vec::new(),
        }
    }
}

impl AppSettings {
    pub fn config_path() -> PathBuf {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."));
        config_dir.join("tokenomics/settings.json")
    }

    pub fn load() -> Result<Self> {
        let path = Self::config_path();
        if path.exists() {
            let content = std::fs::read_to_string(&path)?;
            Ok(serde_json::from_str(&content)?)
        } else {
            Ok(Self::default())
        }
    }

    pub fn save(&self) -> Result<()> {
        let path = Self::config_path();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let content = serde_json::to_string_pretty(&self)?;
        std::fs::write(path, content)?;
        Ok(())
    }
}
