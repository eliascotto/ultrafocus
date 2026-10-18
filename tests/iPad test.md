# Ultrafocus iPad test

This vault is for testing Ultrafocus independently of your writing vault.

## Setup

1. Wait for iCloud to download the plugin files, then open this vault in Obsidian.
2. In Settings → Community plugins, turn on community plugins if prompted and enable Ultrafocus.
3. In Settings → Interface (Mobile or Toolbar on older versions), configure mobile Quick Action to **Ultrafocus: Toggle On/Off**. Quick Action is a per-vault preference; the plugin does not change it.
4. Pull down from the top of the note to enter focus mode. Pull down again to exit.

After copying an updated build, wait for iCloud to sync and turn Ultrafocus off
and on in Settings → Community plugins. Reopening the app from the Home Screen
can resume the previous build. Confirm **Hide tab title bar** appears in the
plugin settings before testing.

## Checks

- [ ] Focus hides the iPad tab bar, ribbon, and open sidebars according to the plugin settings.
- [ ] The bottom navigation bar disappears wherever Obsidian shows it (for example, in a narrow layout).
- [ ] Tap into this note: the editing toolbar hides while the keyboard remains usable.
- [ ] The note title/actions bar below the tabs hides, while titles inside the note remain visible.
- [ ] The pull-down Quick Action turns focus off with the title bar hidden and the keyboard both open and closed.
- [ ] Change “Hide tab title bar” while focused: the title bar returns immediately and the tab bar setting stays unchanged.
- [ ] Repeat in portrait, landscape, and iPad Split View, with the onscreen keyboard and a hardware keyboard if available.
- [ ] Toggle focus on and off several times. Sidebars return to their state before focus was enabled.
- [ ] Start with one sidebar closed and one open. Only the previously open sidebar reopens on exit.
- [ ] Change “Hide app ribbon” without changing “Hide tab bar”; they work independently.
- [ ] While focused, swipe open the left sidebar and open Settings. Change each hiding option: the interface updates immediately. With a hardware keyboard, you can also use the command palette to open Settings.
- [ ] While focused, disable Ultrafocus in Settings → Community plugins. The interface and managed sidebars return immediately.
- [ ] Enable Ultrafocus again: it starts with focus off.
- [ ] Restart Obsidian: the plugin loads successfully and focus starts off.

## Writing sample

Tap here and write a few lines. Check that the final line and caret remain visible above the keyboard while the editing toolbar is hidden.

If a check fails, record your Obsidian version, iPadOS version, theme, orientation, and whether the keyboard was open.
