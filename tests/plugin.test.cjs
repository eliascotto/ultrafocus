const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

const bundle = readFileSync(require.resolve('../main.js'), 'utf8');

function createBody() {
	const classes = new Set();
	return {
		classes,
		classList: { toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); } },
	};
}

function createSidebar(collapsed) {
	return {
		collapsed,
		collapse() { this.collapsed = true; },
		expand() { this.collapsed = false; },
	};
}

async function loadPlugin(settings = {}, mobile = false) {
	const rows = [];
	class Plugin {
		async loadData() { return settings; }
		async saveData(data) { this.saved = data; }
		addSettingTab(tab) { this.tab = tab; }
		addCommand(command) { this.command = command; }
	}
	class PluginSettingTab {
		constructor(app) { this.app = app; this.containerEl = { empty() { rows.length = 0; } }; }
	}
	class Setting {
		constructor() { rows.push(this); }
		setName(name) { this.name = name; return this; }
		setDesc() { return this; }
		addToggle(callback) {
			const row = this;
			callback({
				setValue(value) { row.value = value; return this; },
				onChange(handler) { row.change = handler; return this; },
			});
			return this;
		}
	}
	const body = createBody();
	const context = {
		module: { exports: {} },
		require(name) {
			assert.equal(name, 'obsidian', 'The mobile runtime must not import Node or Electron');
			return { Plugin, PluginSettingTab, Setting, Platform: { isMobile: mobile } };
		},
		activeDocument: { body },
	};
	vm.runInNewContext(bundle, context);
	const plugin = new context.module.exports.default();
	plugin.app = { workspace: { leftSplit: createSidebar(false), rightSplit: createSidebar(true) } };
	await plugin.onload();
	return { plugin, body, context, rows, toggle: () => plugin.command.callback() };
}

test('existing settings gain mobile defaults and the existing toggle command stays available', async () => {
	const { plugin, body, toggle } = await loadPlugin({ hideTabs: false }, true);
	assert.equal(plugin.command.id, 'toggle');
	toggle();
	assert.equal(body.classes.has('ultrafocus-tabs'), false);
	assert.equal(body.classes.has('ultrafocus-mobile-navigation'), true);
	assert.equal(body.classes.has('ultrafocus-mobile-toolbar'), true);
	toggle();
	assert.equal(body.classes.size, 0);
});

test('ribbon setting changes ribbon independently of tabs', async () => {
	const { plugin, rows, body, toggle } = await loadPlugin({ hideRibbon: false, hideTabs: true });
	plugin.tab.display();
	const ribbon = rows.find(row => row.name === 'Hide app ribbon');
	assert.equal(ribbon.value, false);
	toggle();
	await ribbon.change(true);
	assert.equal(plugin.settings.hideRibbon, true);
	assert.equal(plugin.settings.hideTabs, true);
	assert.equal(body.classes.has('ultrafocus-ribbon'), true);
	await ribbon.change(false);
	assert.equal(body.classes.has('ultrafocus-ribbon'), false);
	assert.equal(body.classes.has('ultrafocus-tabs'), true);
});

test('title bar can be hidden independently of tabs on desktop and mobile', async () => {
	for (const mobile of [false, true]) {
		const { plugin, body, rows, toggle } = await loadPlugin({ hideTabs: false }, mobile);
		plugin.tab.display();
		const titleBar = rows.find(row => row.name === 'Hide tab title bar');
		assert.equal(titleBar.value, true, 'Existing settings gain the enabled default');
		toggle();
		assert.equal(body.classes.has('ultrafocus-title-bar'), true);
		assert.equal(body.classes.has('ultrafocus-tabs'), false);
		await titleBar.change(false);
		assert.equal(body.classes.has('ultrafocus-title-bar'), false);
		assert.equal(plugin.settings.hideTabs, false);
		await titleBar.change(true);
		assert.equal(body.classes.has('ultrafocus-title-bar'), true);
		plugin.onunload();
		assert.equal(body.classes.has('ultrafocus-title-bar'), false);
	}
});

test('unload restores open and closed sidebars and clears every touched document', async () => {
	const { plugin, body, context, toggle } = await loadPlugin();
	const secondBody = createBody();
	toggle();
	assert.equal(plugin.app.workspace.leftSplit.collapsed, true);
	context.activeDocument = { body: secondBody };
	plugin.updateStyle();
	plugin.onunload();
	assert.equal(body.classes.size, 0);
	assert.equal(secondBody.classes.size, 0);
	assert.equal(plugin.app.workspace.leftSplit.collapsed, false);
	assert.equal(plugin.app.workspace.rightSplit.collapsed, true);
});

test('repeated toggles and settings changes preserve sidebar snapshots', async () => {
	const { plugin, toggle } = await loadPlugin({ hideSidebarRight: false });
	for (let i = 0; i < 3; i++) {
		toggle();
		plugin.app.workspace.rightSplit.expand();
		plugin.settings.hideStatus = false;
		await plugin.saveSettings();
		toggle();
		assert.equal(plugin.app.workspace.leftSplit.collapsed, false);
		assert.equal(plugin.app.workspace.rightSplit.collapsed, false, 'Unmanaged sidebars stay untouched');
	}
	toggle();
	plugin.settings.hideSidebarLeft = false;
	await plugin.saveSettings();
	assert.equal(plugin.app.workspace.leftSplit.collapsed, false);
	plugin.onunload();
	assert.equal(plugin.app.workspace.leftSplit.collapsed, false);
});

test('unloading without entering focus does not touch the sidebars', async () => {
	const { plugin } = await loadPlugin();
	plugin.app.workspace.leftSplit.collapse = () => assert.fail('Unexpected collapse');
	plugin.app.workspace.leftSplit.expand = () => assert.fail('Unexpected expand');
	plugin.onunload();
});

test('mobile controls update immediately and are only shown in mobile UI', async () => {
	const { plugin, rows, body, toggle } = await loadPlugin({}, true);
	plugin.tab.display();
	toggle();
	await rows.find(row => row.name === 'Hide mobile navigation bar').change(false);
	await rows.find(row => row.name === 'Hide mobile editing toolbar').change(false);
	assert.equal(body.classes.has('ultrafocus-mobile-navigation'), false);
	assert.equal(body.classes.has('ultrafocus-mobile-toolbar'), false);
	const desktop = await loadPlugin();
	desktop.plugin.tab.display();
	assert.equal(desktop.rows.some(row => row.name.startsWith('Hide mobile')), false);
});
