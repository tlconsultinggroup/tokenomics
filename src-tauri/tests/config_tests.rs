#[cfg(test)]
mod tests {
    use tokenomics_tauri::config::{AppSettings, DataPaths};

    #[test]
    fn test_default_clients_nonempty() {
        let paths = DataPaths::default_clients();
        assert!(paths.enabled_clients.contains(&"claude".to_string()));
        assert!(paths.enabled_clients.contains(&"opencode".to_string()));
    }

    #[test]
    fn test_default_settings() {
        let settings = AppSettings::default();
        assert_eq!(settings.currency, "USD");
        assert_eq!(settings.refresh_interval_secs, 300);
    }

    #[test]
    fn test_extra_dirs_roundtrip_via_json() {
        let mut settings = AppSettings::default();
        settings.data_paths.extra_dirs.push(("claude".to_string(), "/custom/path".to_string()));
        let json = serde_json::to_string(&settings).unwrap();
        let restored: AppSettings = serde_json::from_str(&json).unwrap();
        assert_eq!(restored.data_paths.extra_dirs, settings.data_paths.extra_dirs);
    }
}
