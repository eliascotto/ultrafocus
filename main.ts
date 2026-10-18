import { App, Platform, Plugin, PluginSettingTab, Setting, WorkspaceMobileDrawer, WorkspaceSidedock } from 'obsidian';

interface UltrafocusSettings {
	hideRibbon: boolean;
	hideStatus: boolean;
	hideTabs: boolean;
	hideTitleBar: boolean;
	hideSidebarLeft: boolean;
	hideSidebarRight: boolean;
	hideMobileNavigation: boolean;
	hideMobileToolbar: boolean;
}

const DEFAULT_SETTINGS: UltrafocusSettings = {
	hideRibbon: true,
	hideStatus: true,
	hideTabs: true,
	hideTitleBar: true,
	hideSidebarLeft: true,
	hideSidebarRight: true,
	hideMobileNavigation: true,
	hideMobileToolbar: true,
}

export default class Ultrafocus extends Plugin {
	settings: UltrafocusSettings;

	active = false;
	private sidebarStates = new Map<WorkspaceSidedock | WorkspaceMobileDrawer, boolean>();
	private styledBodies = new Set<HTMLElement>();

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
		this.active = false;
		this.updateStyle();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.updateStyle();
		await this.saveData(this.settings);
	}

	updateStyle() {
		// Remember every document touched, including desktop pop-out windows.
		this.styledBodies.add(activeDocument.body);
		for (const body of this.styledBodies) {
			body.classList.toggle('ultrafocus-ribbon', this.active && this.settings.hideRibbon);
			body.classList.toggle('ultrafocus-status', this.active && this.settings.hideStatus);
			body.classList.toggle('ultrafocus-tabs', this.active && this.settings.hideTabs);
			body.classList.toggle('ultrafocus-title-bar', this.active && this.settings.hideTitleBar);
			body.classList.toggle('ultrafocus-mobile-navigation', this.active && this.settings.hideMobileNavigation);
			body.classList.toggle('ultrafocus-mobile-toolbar', this.active && this.settings.hideMobileToolbar);
		}

		if (!this.active) {
			this.styledBodies.clear();
		}

		const sidebars: [WorkspaceSidedock | WorkspaceMobileDrawer, boolean][] = [
			[this.app.workspace.leftSplit, this.settings.hideSidebarLeft],
			[this.app.workspace.rightSplit, this.settings.hideSidebarRight],
		];
		for (const [sidebar, hide] of sidebars) {
			if (this.active && hide) {
				// Settings changes must not overwrite the original sidebar state.
				if (!this.sidebarStates.has(sidebar)) {
					this.sidebarStates.set(sidebar, sidebar.collapsed);
				}
				sidebar.collapse();
			} else if (this.sidebarStates.has(sidebar)) {
				if (this.sidebarStates.get(sidebar)) {
					sidebar.collapse();
				} else {
					sidebar.expand();
				}
				this.sidebarStates.delete(sidebar);
			}
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
			.setDesc('Hides the app ribbon. Use the command palette to open Settings while focused.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideRibbon)
				.onChange(async (value) => {
					this.plugin.settings.hideRibbon = value;
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
			.setName('Hide tab title bar')
			.setDesc('Hides the note title and actions bar below the tabs on desktop and mobile.')
			.addToggle(toggle => toggle.setValue(this.plugin.settings.hideTitleBar)
				.onChange(async (value) => {
					this.plugin.settings.hideTitleBar = value;
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

		if (Platform.isMobile) {
			new Setting(containerEl)
				.setName('Hide mobile navigation bar')
				.setDesc('Hides the bottom navigation bar while focused. Use your pull-down Quick Action to toggle focus off.')
				.addToggle(toggle => toggle.setValue(this.plugin.settings.hideMobileNavigation)
					.onChange(async (value) => {
						this.plugin.settings.hideMobileNavigation = value;
						await this.plugin.saveSettings();
					})
				);

			new Setting(containerEl)
				.setName('Hide mobile editing toolbar')
				.setDesc('Hides the editing toolbar above the keyboard while focused.')
				.addToggle(toggle => toggle.setValue(this.plugin.settings.hideMobileToolbar)
					.onChange(async (value) => {
						this.plugin.settings.hideMobileToolbar = value;
						await this.plugin.saveSettings();
					})
				);
		}
	}
}
