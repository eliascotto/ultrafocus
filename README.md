# [Ultrafocus](https://community.obsidian.md/plugins/ultrafocus)

> Hide Everything Everywhere All at Once

A plugin to turn Obsidian into the ultimate platform for focused writing. [Obsidian store page](https://community.obsidian.md/plugins/ultrafocus).

**What it does**: hides all elements like tabs, status, ribbon, sidebars, etc. All with a single toggle command, no buttons.

![demo.gif](demo.gif)

## Install

Install it directly from the store. Check your plugin browsers.

### Locally

To install it locally in your Obsidian vault, clone this repo, install the deps then build it. 

```bash
cd YourVault/.obsidian/plugins/
git clone git@github.com:eliascotto/ultrafocus.git
cd ultrafocus
npm i
npm run build
```

This will give us a `main.js` file. Then from Obsidian:

1. `cmd+p` -> Open Settings...
2. Go to "Community Plugins"
3. Installed Plugins, press the reload button
4. Find _Ultrafocus_ and enable it

## Settings

Choose what elements you'd like to keep visible. By default, everything will be hidden.

The **Hide tab title bar** setting hides the note title and actions bar below the
tabs on both desktop and mobile. It is enabled by default, independently of the
tab bar setting, and leaves titles inside your notes visible.

On mobile, two additional settings hide the bottom navigation bar and the editing
toolbar above the keyboard. The existing workspace pull-down Quick Action is
unchanged. Configure Quick Action to **Ultrafocus: Toggle On/Off** in
Obsidian's Interface settings (Mobile or Toolbar on older versions). Ultrafocus
does not change that assignment or add buttons. Tablet tabs and ribbons use the
same settings as desktop. Settings changes apply immediately while focused.

## Test on iPad through iCloud

From this plugin folder on your Mac, run:

```bash
npm run ipad:deploy
```

The script builds the plugin and creates or updates this dedicated test vault:

```text
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Ultrafocus iPad test
```

It copies only `main.js`, `manifest.json`, and `styles.css` into the vault's
`.obsidian/plugins/ultrafocus/` folder, plus a test note on the first run. Existing
notes, plugin settings, and enabled-plugin lists are preserved. It does not copy
your writing vault or development dependencies.

Wait for iCloud to finish syncing, open **Ultrafocus iPad test** from the iPad
Obsidian vault switcher, then enable community plugins and Ultrafocus under
Settings → Community plugins. Follow the checklist in the test note. On later
deployments, wait for syncing, then turn Ultrafocus **off and on** under Community
plugins to reload both JavaScript and CSS. Do this on desktop after rebuilding too.
Reopening the iPad app from the Home Screen can resume the previous build.
Confirm **Hide tab title bar** appears in the plugin settings before testing.

To deploy into a different test vault (using its default `.obsidian` config folder):

```bash
npm run ipad:deploy -- "/absolute/path/to/test vault"
```

Run `npm test` for the build and automated settings/sidebar lifecycle checks.
Actual iPad layout, keyboard behavior, and native Quick Action still require the
device checks in the test note.

## Alternatives

- [**Hider**](https://github.com/kepano/obsidian-hider/tree/master): Chose what to hide one by one.
- [**Focus Mode**](https://github.com/ryanpcmcquen/obsidian-focus-mode): Toggle focus with a sidebar button but doesn't hide elements.
