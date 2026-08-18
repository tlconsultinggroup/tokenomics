#[cfg(test)]
mod tests {
    use chrono::NaiveDate;
    use std::collections::HashMap;
    use std::path::PathBuf;
    use tempfile::TempDir;
    use tokenomics_tauri::db::{Database, DailySnapshot};

    #[test]
    fn test_db_create_and_init() {
        let temp_dir = TempDir::new().unwrap();
        let db_path = temp_dir.path().join("test.db");

        let db = Database::new(&db_path).unwrap();
        db.init().unwrap();

        assert!(db_path.exists());
    }

    #[test]
    fn test_save_and_retrieve_snapshot() {
        let temp_dir = TempDir::new().unwrap();
        let db_path = temp_dir.path().join("test.db");
        let db = Database::new(&db_path).unwrap();
        db.init().unwrap();

        let mut cost_by_model = HashMap::new();
        cost_by_model.insert("claude-opus".to_string(), 10.5);

        let mut cost_by_provider = HashMap::new();
        cost_by_provider.insert("anthropic".to_string(), 10.5);

        let snapshot = DailySnapshot {
            date: NaiveDate::from_ymd_opt(2026, 8, 18).unwrap(),
            total_cost: 10.5,
            total_tokens: 5000,
            input_tokens: 3000,
            output_tokens: 2000,
            session_count: 5,
            cost_by_model,
            cost_by_provider,
        };

        db.save_daily_snapshot(&snapshot).unwrap();
        let retrieved = db.get_daily_snapshot(snapshot.date).unwrap();

        assert!(retrieved.is_some());
        let retrieved = retrieved.unwrap();
        assert_eq!(retrieved.total_cost, 10.5);
        assert_eq!(retrieved.session_count, 5);
    }
}
