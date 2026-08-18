use crate::config::AppSettings;
use crate::error::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
pub struct SettingsResponse {
    pub refresh_interval_secs: u64,
    pub currency: String,
    pub pricing_overrides: HashMap<String, f64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PathsResponse {
    pub enabled_clients: Vec<String>,
    pub extra_dirs: Vec<(String, String)>,
}

#[tauri::command]
pub async fn get_settings() -> Result<SettingsResponse> {
    let settings = AppSettings::load()?;
    Ok(SettingsResponse {
        refresh_interval_secs: settings.refresh_interval_secs,
        currency: settings.currency,
        pricing_overrides: settings.pricing_overrides,
    })
}

#[tauri::command]
pub async fn update_settings(
    refresh_interval_secs: u64,
    currency: String,
    pricing_overrides: HashMap<String, f64>,
) -> Result<()> {
    let mut settings = AppSettings::load()?;
    settings.refresh_interval_secs = refresh_interval_secs;
    settings.currency = currency;
    settings.pricing_overrides = pricing_overrides;
    settings.save()?;
    Ok(())
}

#[tauri::command]
pub async fn get_paths() -> Result<PathsResponse> {
    let settings = AppSettings::load()?;
    Ok(PathsResponse {
        enabled_clients: settings.data_paths.enabled_clients,
        extra_dirs: settings.data_paths.extra_dirs,
    })
}

#[tauri::command]
pub async fn add_custom_path(client_id: String, path: String) -> Result<()> {
    let mut settings = AppSettings::load()?;
    let pair = (client_id, path);
    if !settings.data_paths.extra_dirs.contains(&pair) {
        settings.data_paths.extra_dirs.push(pair);
        settings.save()?;
    }
    Ok(())
}

#[tauri::command]
pub async fn remove_custom_path(client_id: String, path: String) -> Result<()> {
    let mut settings = AppSettings::load()?;
    settings.data_paths.extra_dirs.retain(|(c, p)| !(c == &client_id && p == &path));
    settings.save()?;
    Ok(())
}
