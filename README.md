# Ultrafocus

> Hide Everything Everywhere All at Once

A plugin to turn Obsidian into the ultimate platform for focused writing.

**What it does**: hides all elements like tabs, status, ribbon, sidebars, etc. All with a single toggle command, no buttons.

![demo.gif](demo.gif)

## Install

Getting this plugin approved in Obsidian Community repo was a bit of a pain. But you can install it manually very easy.

In your Obsidian vault, we clone this repo, install the deps and build it. 

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

## Alternatives

- [**Hider**](https://github.com/kepano/obsidian-hider/tree/master): Chose what to hide one by one.
- [**Focus Mode**](https://github.com/ryanpcmcquen/obsidian-focus-mode): Toggle focus with a sidebar button but doesn't hide elements.
