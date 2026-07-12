import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
interface UltrafocusSettings {
	hideRibbon: boolean;
	hideStatus: boolean;
	hideTabs: boolean;
	hideSidebarLeft: boolean;
	hideSidebarRight: boolean;
}

const DEFAULT_SETTINGS: UltrafocusSettings = {
	hideRibbon: true,
	hideStatus: true,
	hideTabs: true,
	hideSidebarLeft: true,
	hideSidebarRight: true,
}

export default class Ultrafocus extends Plugin {
	settings: UltrafocusSettings;

	active = false;
	leftSidebarCollapsed: boolean;
	rightSidebarCollapsed: boolean;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new UltrafocusSettingsTab(this.app, this));

		this.addCommand({
			id: 'toggle',
			name: 'Toggle On/Off',
			callback: () => {
				this.active = !this.active;
				this.updateStyle();
			},
		});
	}

	onunload() {
		console.log('Unloading Ultrafocus plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	storeSidebarState() {
		this.leftSidebarCollapsed = this.app.workspace.leftSplit.collapsed;
		this.rightSidebarCollapsed = this.app.workspace.rightSplit.collapsed;
	}

	collapseSidebar() {
		if (this.settings.hideSidebarLeft) {
			this.app.workspace.leftSplit.collapse();
		}

		if (this.settings.hideSidebarRight) {
			this.app.workspace.rightSplit.collapse();
		}
	}

	restoreSidebar() {
		if (!this.leftSidebarCollapsed) {
			this.app.workspace.leftSplit.expand();
		}

		if (!this.rightSidebarCollapsed) {
			this.app.workspace.rightSplit.expand();
		}
	}

	updateStyle() {
		if (this.settings.hideRibbon) {
			activeDocument.body.classList.toggle('ultrafocus-ribbon', this.active);
		}

		if (this.settings.hideStatus) {
			activeDocument.body.classList.toggle('ultrafocus-status', this.active);
		}

		if (this.settings.hideTabs) {
			activeDocument.body.classList.toggle('ultrafocus-tabs', this.active);
		}

		if (this.active) {
			this.storeSidebarState();
			this.collapseSidebar();
		} else {
			this.restoreSidebar();
			}
		}
	}

class UltrafocusSettingsTab extends PluginSettingTab {
	plugin: Ultrafocus;
	constructor(app: App, plugin: Ultrafocus) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Hide app ribbon')
			.setDesc('Hides the Obsidian menu. Warning: to open Settings you will need use the hotkey (default is CMD + ,)')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideTabs)
				.onChange(async (value) => {
					this.plugin.settings.hideTabs = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Hide tab bar')
			.setDesc('Hides the tab container at the top of the window.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideTabs)
				.onChange(async (value) => {
					this.plugin.settings.hideTabs = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Hide status bar')
			.setDesc('Hides word count, character count and backlink count.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideStatus)
				.onChange(async (value) => {
					this.plugin.settings.hideStatus = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Hide left sidebar')
			.setDesc('Collapse left sidebar when active.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideSidebarLeft)
				.onChange(async (value) => {
					this.plugin.settings.hideSidebarLeft = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Hide right sidebar')
			.setDesc('Collapse right sidebar when active.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideSidebarRight)
				.onChange(async (value) => {
					this.plugin.settings.hideSidebarRight = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
