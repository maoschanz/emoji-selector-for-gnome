//this file is part of https://github.com/maoschanz/emoji-selector-for-gnome

const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;

//cause it is needed to grab the damn focus
const Mainloop = imports.mainloop;

//for the keybinding ?
const Meta = imports.gi.Meta;
const Gio = imports.gi.Gio;

/* Import PanelMenu and PopupMenu */
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

/* Stuffs for settings, translations etc. */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const SkinTonesBar = Me.imports.emojiOptionsBar.SkinTonesBar;
const EmojiCategory = Me.imports.emojiCategory.EmojiCategory;
const EmojiButton = Me.imports.emojiButton;

//----------------------------------------------

var SETTINGS;
let SIGNAUX = [];

/* Global variable : GLOBAL_BUTTON to click in the topbar */
var GLOBAL_BUTTON;

/* this array will store some St.Button(s) */
var recents = [];

/* These global variables are used to store some static settings */
var NB_COLS;
let POSITION;

//-----------------------------------------------

function updateStyle() {
	recents.forEach(function(b){
		b.style = b.getStyle();
	});
	GLOBAL_BUTTON.emojiCategories.forEach(function(c){
		c.emojiButtons.forEach(function(b){
			b.style = b.getStyle();
		});
	});
}

function saveRecents() { //XXX not oop
	let backUp = [];
	for(let i=0; i<NB_COLS; i++){
		backUp.push(recents[i].super_btn.label);
	}
	Convenience.getSettings().set_strv('recently-used', backUp);
}

function buildRecents() { //XXX not oop
	let temp = Convenience.getSettings().get_strv('recently-used')
	for(let i=0; i<NB_COLS; i++){
		if (i < temp.length) {
			recents[i].super_btn.label = temp[i];
		} else {
			//If the extension was previously set with less "recently used emojis",
			//we still need to load something in the labels.
			//It will be a penguin for obvious reasons.
			recents[i].super_btn.label = '🐧';
		}
	}
}

//----------------------------------------------

//class EmojiSearchItem
//methods :
//	_init()					create and connect a search entry, added to a menu item
//	_onSearchTextChanged()	change the "recently used" array content in reaction to a new search
class EmojiSearchItem {
	constructor() {
		this.super_item = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false
		});

		this.searchEntry = new St.Entry({
			name: 'searchEntry',
			style_class: 'search-entry',
			can_focus: true,
			hint_text: _('Type here to search…'),
			track_hover: true
		});

		this.searchEntry.get_clutter_text().connect(
			'text-changed',
			this._onSearchTextChanged.bind(this)
		);

		this.searchEntry.clutter_text.connect('key-press-event', (o, e) => {
			recents[0].onKeyPress(o, e);
		});

		this.super_item.actor.add(this.searchEntry, { expand: true });
	}

	_onSearchTextChanged() {
		let searchedText = this.searchEntry.get_text();
		if (searchedText === '') {
			buildRecents();
			return;
		} // else { ...
		searchedText = searchedText.toLowerCase();

		for (let j = 0; j < NB_COLS; j++) {
			recents[j].super_btn.label = '';
		}

		let minCat = 0;
		let maxCat = GLOBAL_BUTTON.emojiCategories.length;
		if (GLOBAL_BUTTON._activeCat != -1) {
			minCat = GLOBAL_BUTTON._activeCat;
			maxCat = GLOBAL_BUTTON._activeCat+1;
		}

		let results = [];
		for (let cat = minCat; cat < maxCat; cat++) {
			let availableSlots = recents.length - results.length;
			if (availableSlots > 0) {
				GLOBAL_BUTTON.emojiCategories[cat].load();
				let catResults = GLOBAL_BUTTON.emojiCategories[cat].searchEmoji(searchedText, availableSlots);
				results = results.concat(catResults);
			}
		}

		let firstEmptyIndex = 0;
		for (let i=0; i<results.length; i++) {
			if (i < NB_COLS) {
				recents[firstEmptyIndex].super_btn.label = results[i];
				firstEmptyIndex++;
			}
		}
	}
}

//class EmojiCategory TODO update that huge obsolete comment
//This is the main class of this extension, corresponding to the menu in the top panel
//methods :
//	_init()						initialize the menu (buttons, search entry, recently used)
//	toggle()					open/close the menu (not useful wrapper)
//	_createAllCategories()		create all categories (buttons & submenu menuitems), empty
//	_addAllCategories()			add all invisible submenu menuitems to the extension interface
//	_renderPanelMenuHeaderBox()	add "back" button & categories' buttons to the extension interface
//	clearCategories()			clean the interface & close an eventual opened category
//	_onSearchTextChanged		wrapper calling EmojiSearchItem's _onSearchTextChanged
//	_recentlyUsedInit()			initialize the array of recently used emojis
//	_bindShortcut()				bind the keyboard shortcut
//	destroy()					destroy the button and its menu
class EmojisMenu {
	constructor() {
		this._init();
	}
	
	_init() {
		this.super_btn = new PanelMenu.Button(0.0, _("Emoji Selector"), false);
		let box = new St.BoxLayout();
		let icon = new St.Icon({
			icon_name: 'face-cool-symbolic',
			style_class: 'system-status-icon emotes-icon'
		});

		box.add(icon);
		box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
		this.super_btn.actor.add_child(box);
		this._permanentItems = 0;
		this._activeCat = -1;
		this.super_btn.actor.visible = SETTINGS.get_boolean('always-show');

		//initializing categories
		this._createAllCategories();

		//initializing this._buttonMenuItem
		this._renderPanelMenuHeaderBox();

		//creating the search entry
		this.searchItem = new EmojiSearchItem();
		
		//initializing the "recently used" buttons
		let recentlyUsed = this._recentlyUsedInit();

		if (POSITION === 'top') {
			this.super_btn.menu.addMenuItem(this._buttonMenuItem);
			this._permanentItems++;
			this.super_btn.menu.addMenuItem(this.searchItem.super_item);
			this._permanentItems++;
			this.super_btn.menu.addMenuItem(recentlyUsed);
			this._permanentItems++;
		}
		//-----------------------------------------------
		this._addAllCategories();
		//-----------------------------------------------
		if (POSITION === 'bottom') {
			this.super_btn.menu.addMenuItem(recentlyUsed);
			this._permanentItems++;
			this.super_btn.menu.addMenuItem(this.searchItem.super_item);
			this._permanentItems++;
			this.super_btn.menu.addMenuItem(this._buttonMenuItem);
			this._permanentItems++;
		}

		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
		this.super_btn.menu.connect('open-state-changed', this.onOpenStateChanged.bind(this));

		if (SETTINGS.get_boolean('use-keybinding')) {
			this._bindShortcut();
		}
	}

	onOpenStateChanged(self, open) {
		this.super_btn.actor.visible = open || SETTINGS.get_boolean('always-show');
		this.clearCategories();
		this.searchItem.searchEntry.set_text('');
//		this.unloadCategories();

		let a = Mainloop.timeout_add(20, () => {
			if (open) {
				global.stage.set_key_focus(this.searchItem.searchEntry);
			}
			Mainloop.source_remove(a);
		});
	}

	unloadCategories() { //TODO isn't used yet
		for (let i=1; i<this.emojiCategories.length; i++) {
			this.emojiCategories[i].unload();
		}
	}

	toggle() {
		this.super_btn.menu.toggle();
	}

	_createAllCategories() {
		this.emojiCategories = [];

		/* creating new categories, with emojis not loaded yet */
		this.emojiCategories[0] = new EmojiCategory(	_('Smileys & Body'),		'face-smile-symbolic',		0); //'emoji-body-symbolic',
		this.emojiCategories[1] = new EmojiCategory(	_('Peoples & Clothing'),	'emoji-people-symbolic',	1);
		this.emojiCategories[2] = new EmojiCategory(	_('Animals & Nature'),		'emoji-nature-symbolic',	2);
		this.emojiCategories[3] = new EmojiCategory(	_('Food & Drink'), 			'emoji-food-symbolic',		3);
		this.emojiCategories[4] = new EmojiCategory(	_('Travel & Places'), 		'emoji-travel-symbolic',	4);
		this.emojiCategories[5] = new EmojiCategory(	_('Activities & Sports'),	'emoji-activities-symbolic',5);
		this.emojiCategories[6] = new EmojiCategory(	_('Objects'),				'emoji-objects-symbolic',	6);
		this.emojiCategories[7] = new EmojiCategory(	_('Symbols'),				'emoji-symbols-symbolic',	7);
		this.emojiCategories[8] = new EmojiCategory(	_('Flags'),					'emoji-flags-symbolic',		8);
	}

	_addAllCategories() {
		for (let i = 0; i< 9; i++) {
			this.super_btn.menu.addMenuItem(this.emojiCategories[i].super_item);
		}
	}

	_renderPanelMenuHeaderBox() {
		this._buttonMenuItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false
		});
		this.categoryButton = [];
		for (let i=0; i<this.emojiCategories.length; i++) {
			this._buttonMenuItem.actor.add(this.emojiCategories[i].getButton(), { expand: true, x_fill: false });
		}
	}

	clearCategories(){
		// removing the blue color of previously opened category's button
		for (let i = 0; i< 9; i++) {
			this.emojiCategories[i].getButton().style = '';
		}

		let items = this.super_btn.menu._getMenuItems();

		// closing and hinding opened categories
		if (POSITION == 'top') {
			for (let i=this._permanentItems; i < items.length; i++) {
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}

		if (POSITION == 'bottom') {
			for (let i=0; i<(items.length - this._permanentItems); i++) {
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}

		this._activeCat = -1;
		this._onSearchTextChanged(); //non optimal
	}

	_onSearchTextChanged() {
		this.searchItem._onSearchTextChanged();
		return;
	}

	_recentlyUsedInit() {
		let recentlyUsed = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false,
		});
		let container = new St.BoxLayout();
		recentlyUsed.actor.add(container, { expand: true });
		recents = [];

		for(let i=0; i<NB_COLS; i++) {
			recents[i] = new EmojiButton.EmojiButton('', null, []);
			container.add_child(recents[i].super_btn);
		}

		buildRecents();
		return recentlyUsed;
	}

	_bindShortcut() {
		let ModeType = Shell.hasOwnProperty('ActionMode') ?
			Shell.ActionMode : Shell.KeyBindingMode;

		Main.wm.addKeybinding(
			'emoji-keybinding',
			Convenience.getSettings(),
			Meta.KeyBindingFlags.NONE,
			ModeType.ALL,
			this.toggle.bind(this)
		);
	}
};

//------------------------------------------------------------

function init() {
	Convenience.initTranslations('emoji-selector');
}

//------------------------------------------------------------

function enable() {
	SETTINGS = Convenience.getSettings();

	/* TODO paramètres restants à dynamiser
	emoji-keybinding (tableau de chaînes), pourri de toutes manières
	nbcols (int), rebuild nécessaire
	position (chaîne) impossible tout court ?
	*/

	NB_COLS = SETTINGS.get_int('nbcols');
	POSITION = SETTINGS.get_string('position');

	GLOBAL_BUTTON = new EmojisMenu();

//	about addToStatusArea :
//	- 0 is the position
//	- `right` is the box where we want our GLOBAL_BUTTON to be displayed (left/center/right)
	Main.panel.addToStatusArea('EmojisMenu', GLOBAL_BUTTON.super_btn, 0, 'right');

	SIGNAUX[0] = SETTINGS.connect('changed::emojisize', () => { updateStyle(); });
	SIGNAUX[1] = SETTINGS.connect('changed::light-theme', () => { updateStyle(); });
	SIGNAUX[2] = SETTINGS.connect('changed::always-show', () => {
		GLOBAL_BUTTON.super_btn.actor.visible = SETTINGS.get_boolean('always-show');
	});
	SIGNAUX[3] = SETTINGS.connect('changed::use-keybinding', (z) => {
		if (z.get_boolean('use-keybinding')) {
			Main.wm.removeKeybinding('emoji-keybinding');
			GLOBAL_BUTTON._bindShortcut();
		} else {
			Main.wm.removeKeybinding('emoji-keybinding');
		}
	});
}

//------------------------------------------------------------

function disable() {
	//we need to save labels currently in recents[] for the next session
	saveRecents();

	if (SETTINGS.get_boolean('use-keybinding')) {
		Main.wm.removeKeybinding('emoji-keybinding');
	}

	SETTINGS.disconnect(SIGNAUX[0]);
	SETTINGS.disconnect(SIGNAUX[1]);
	SETTINGS.disconnect(SIGNAUX[2]);
	SETTINGS.disconnect(SIGNAUX[3]);

	GLOBAL_BUTTON.super_btn.destroy();
}

