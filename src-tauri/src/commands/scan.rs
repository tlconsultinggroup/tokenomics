use crate::error::Result;
use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanResult {
    pub files_scanned: usize,
    pub sessions_found: usize,
}

#[tauri::command]
pub async fn trigger_scan() -> Result<ScanResult> {
    // This is a placeholder; in a real implementation, this would:
    // 1. Scan all configured paths
    // 2. Parse files using tokenomics-core
    // 3. Return summary stats

    Ok(ScanResult {
        files_scanned: 0,
        sessions_found: 0,
    })
}
