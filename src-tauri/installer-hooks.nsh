!macro NSIS_HOOK_POSTINSTALL
  ; Windows caches taskbar/shortcut icons per file path, so a fresh install
  ; over an older version often keeps showing the previous icon until
  ; Explorer is told to refresh. SHChangeNotify(SHCNE_ASSOCCHANGED,
  ; SHCNF_IDLIST) nudges Explorer to redraw icons without needing a full
  ; explorer.exe restart or a manual cache-clear from the user.
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0x0000, i 0, i 0)'
!macroend
