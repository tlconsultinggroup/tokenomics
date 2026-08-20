/// Sets the taskbar button icon on Windows.
///
/// `tauri::Window::set_icon` (exposed to the frontend as
/// `getCurrentWindow().setIcon()`) only ever sends `WM_SETICON` with
/// `ICON_SMALL` on Windows - it never touches `ICON_BIG`, which is what the
/// taskbar button itself reads. That leaves the title-bar/Alt+Tab icon
/// updating correctly while the taskbar icon stays stuck on whatever was set
/// at window creation. This command sends `WM_SETICON` for both icon slots
/// directly so the taskbar reflects the current usage level.
#[tauri::command]
pub fn set_taskbar_icon(window: tauri::Window, icon_bytes: Vec<u8>) -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Win32::Foundation::{LPARAM, LRESULT, WPARAM};
        use windows::Win32::UI::WindowsAndMessaging::{
            CreateIconFromResourceEx, DestroyIcon, SendMessageW, HICON, ICON_BIG, ICON_SMALL,
            LR_DEFAULTCOLOR, WM_SETICON,
        };

        let hwnd = window.hwnd().map_err(|e| e.to_string())?;
        unsafe {
            let hicon = CreateIconFromResourceEx(&icon_bytes, true, 0x00030000, 0, 0, LR_DEFAULTCOLOR)
                .map_err(|e| e.to_string())?;

            let destroy_previous = |result: LRESULT| {
                let previous = HICON(result.0 as *mut core::ffi::c_void);
                if !previous.is_invalid() {
                    let _ = DestroyIcon(previous);
                }
            };

            destroy_previous(SendMessageW(
                hwnd,
                WM_SETICON,
                Some(WPARAM(ICON_BIG as usize)),
                Some(LPARAM(hicon.0 as isize)),
            ));
            destroy_previous(SendMessageW(
                hwnd,
                WM_SETICON,
                Some(WPARAM(ICON_SMALL as usize)),
                Some(LPARAM(hicon.0 as isize)),
            ));
        }
    }

    #[cfg(not(windows))]
    {
        let _ = (window, icon_bytes);
    }

    Ok(())
}
