use crate::error::{AppError, Result};
use chrono::NaiveDate;
use rusqlite::{Connection, params};
use serde_json::json;
use std::path::PathBuf;

pub struct Database {
    conn: Connection,
}

#[derive(Debug, Clone)]
pub struct DailySnapshot {
    pub date: NaiveDate,
    pub total_cost: f64,
    pub total_tokens: i64,
    pub input_tokens: i64,
    pub output_tokens: i64,
    pub session_count: i64,
    pub cost_by_model: std::collections::HashMap<String, f64>,
    pub cost_by_provider: std::collections::HashMap<String, f64>,
}

impl Database {
    pub fn new(path: &PathBuf) -> Result<Self> {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let conn = Connection::open(path)?;
        Ok(Self { conn })
    }

    pub fn init(&self) -> Result<()> {
        self.conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS daily_snapshots (
                id INTEGER PRIMARY KEY,
                date DATE UNIQUE NOT NULL,
                total_cost REAL NOT NULL,
                total_tokens INTEGER NOT NULL,
                input_tokens INTEGER NOT NULL,
                output_tokens INTEGER NOT NULL,
                session_count INTEGER NOT NULL,
                cost_by_model TEXT NOT NULL,
                cost_by_provider TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS model_costs (
                id INTEGER PRIMARY KEY,
                date DATE NOT NULL,
                model_name TEXT NOT NULL,
                cost REAL NOT NULL,
                tokens INTEGER NOT NULL,
                session_count INTEGER NOT NULL,
                UNIQUE(date, model_name)
            );

            CREATE TABLE IF NOT EXISTS provider_costs (
                id INTEGER PRIMARY KEY,
                date DATE NOT NULL,
                provider TEXT NOT NULL,
                cost REAL NOT NULL,
                tokens INTEGER NOT NULL,
                UNIQUE(date, provider)
            );

            CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_snapshots(date);
            CREATE INDEX IF NOT EXISTS idx_model_costs_date ON model_costs(date);
            CREATE INDEX IF NOT EXISTS idx_provider_costs_date ON provider_costs(date);
            "#
        )?;
        Ok(())
    }

    pub fn save_daily_snapshot(&self, snapshot: &DailySnapshot) -> Result<()> {
        let cost_by_model_json = serde_json::to_string(&snapshot.cost_by_model)?;
        let cost_by_provider_json = serde_json::to_string(&snapshot.cost_by_provider)?;

        self.conn.execute(
            "INSERT OR REPLACE INTO daily_snapshots
             (date, total_cost, total_tokens, input_tokens, output_tokens, session_count, cost_by_model, cost_by_provider)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![
                snapshot.date,
                snapshot.total_cost,
                snapshot.total_tokens,
                snapshot.input_tokens,
                snapshot.output_tokens,
                snapshot.session_count,
                cost_by_model_json,
                cost_by_provider_json,
            ],
        )?;

        // Save model and provider breakdowns
        for (model, cost) in &snapshot.cost_by_model {
            self.conn.execute(
                "INSERT OR REPLACE INTO model_costs (date, model_name, cost, tokens, session_count)
                 VALUES (?1, ?2, ?3, 0, 0)",
                params![snapshot.date, model, cost],
            )?;
        }

        for (provider, cost) in &snapshot.cost_by_provider {
            self.conn.execute(
                "INSERT OR REPLACE INTO provider_costs (date, provider, cost, tokens)
                 VALUES (?1, ?2, ?3, 0)",
                params![snapshot.date, provider, cost],
            )?;
        }

        Ok(())
    }

    pub fn get_daily_snapshot(&self, date: NaiveDate) -> Result<Option<DailySnapshot>> {
        let mut stmt = self.conn.prepare(
            "SELECT date, total_cost, total_tokens, input_tokens, output_tokens, session_count, cost_by_model, cost_by_provider
             FROM daily_snapshots WHERE date = ?1"
        )?;

        let result = stmt.query_row(params![date], |row| {
            let cost_by_model_json: String = row.get(6)?;
            let cost_by_provider_json: String = row.get(7)?;

            Ok(DailySnapshot {
                date: row.get(0)?,
                total_cost: row.get(1)?,
                total_tokens: row.get(2)?,
                input_tokens: row.get(3)?,
                output_tokens: row.get(4)?,
                session_count: row.get(5)?,
                cost_by_model: serde_json::from_str(&cost_by_model_json).unwrap_or_default(),
                cost_by_provider: serde_json::from_str(&cost_by_provider_json).unwrap_or_default(),
            })
        });

        match result {
            Ok(snapshot) => Ok(Some(snapshot)),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
            Err(e) => Err(AppError::DbError(e)),
        }
    }

    pub fn get_historical_range(&self, start: NaiveDate, end: NaiveDate) -> Result<Vec<DailySnapshot>> {
        let mut stmt = self.conn.prepare(
            "SELECT date, total_cost, total_tokens, input_tokens, output_tokens, session_count, cost_by_model, cost_by_provider
             FROM daily_snapshots WHERE date BETWEEN ?1 AND ?2 ORDER BY date"
        )?;

        let snapshots = stmt.query_map(params![start, end], |row| {
            let cost_by_model_json: String = row.get(6)?;
            let cost_by_provider_json: String = row.get(7)?;

            Ok(DailySnapshot {
                date: row.get(0)?,
                total_cost: row.get(1)?,
                total_tokens: row.get(2)?,
                input_tokens: row.get(3)?,
                output_tokens: row.get(4)?,
                session_count: row.get(5)?,
                cost_by_model: serde_json::from_str(&cost_by_model_json).unwrap_or_default(),
                cost_by_provider: serde_json::from_str(&cost_by_provider_json).unwrap_or_default(),
            })
        })?.collect::<std::result::Result<Vec<_>, _>>()?;

        Ok(snapshots)
    }

    pub fn clear_old_snapshots(&self, days_to_keep: i64) -> Result<()> {
        let cutoff_date = chrono::Local::now().naive_local().date()
            - chrono::Duration::days(days_to_keep);

        self.conn.execute(
            "DELETE FROM daily_snapshots WHERE date < ?1",
            params![cutoff_date],
        )?;

        Ok(())
    }

    pub fn vacuum(&self) -> Result<()> {
        self.conn.execute("VACUUM", [])?;
        Ok(())
    }
}
