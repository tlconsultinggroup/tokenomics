#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tokenomics_tauri::*;

use tauri::Manager;

fn main() {
    run();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            commands::data::get_daily_data,
            commands::data::get_weekly_data,
            commands::data::get_monthly_data,
            commands::settings::get_settings,
            commands::settings::get_system_user,
            commands::settings::update_settings,
            commands::settings::get_paths,
            commands::settings::add_custom_path,
            commands::settings::remove_custom_path,
            commands::scan::trigger_scan,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
