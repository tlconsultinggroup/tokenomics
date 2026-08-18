mod error;
mod config;
mod db;
mod parsers;
mod aggregator;
mod pricing;
mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::data::get_daily_data,
            commands::data::get_weekly_data,
            commands::data::get_monthly_data,
            commands::settings::get_settings,
            commands::settings::update_settings,
            commands::scan::trigger_scan,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
