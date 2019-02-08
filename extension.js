const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Lang = imports.lang;

//cause it is needed to grab the damn focus
const Mainloop = imports.mainloop;

//for the keybinding ?
const Meta = imports.gi.Meta;
const Gio = imports.gi.Gio;

/* Import PanelMenu and PopupMenu */
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/* Stuffs for settings, translations etc. */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;
const Convenience = Me.imports.convenience;

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

//----------------------------------------------

const SkinTonesBar = Me.imports.emojiOptionsBar.SkinTonesBar;
const EmojiCategory = Me.imports.emojiCategory.EmojiCategory;
const EmojiButton = Me.imports.emojiButton;

/*
 * Import data (array of arrays of characters, and array of arrays of strings).
 * Keywords are used for both:
 * - search
 * - skin tone management
 * - gender management
 */
var EMOJIS_CHARACTERS = Me.imports.emojisCharacters.ALL;
var EMOJIS_KEYWORDS = Me.imports.emojisKeywords.ALL_KEYWORDS;

var SETTINGS;
let SIGNAUX = [];

//-----------------------------------------------

/* Global variable : GLOBAL_BUTTON to click in the topbar */
var GLOBAL_BUTTON;

/* this array will store some St.Button(s) */
var recents = [];

/* These global variables are used to store some static settings */
var NB_COLS;
let POSITION;

//-----------------------------------------------

// This function is a copy-paste from clipboard-indicator, however it's
// not very good imo so FIXME TODO

const SCHEMA_NAME = 'org.gnome.shell.extensions.emoji-selector';

const getSchema = function () {
	let schemaDir = Me.dir.get_child('schemas').get_path();
	let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
	let schema = schemaSource.lookup(SCHEMA_NAME, false);

	return new Gio.Settings({ settings_schema: schema });
}

const SettingsSchema = getSchema();

//-----------------------------------------

function updateStyle() {
	recents.forEach(function(b){
		b.style = GLOBAL_BUTTON.getStyle();
	});
	GLOBAL_BUTTON.emojiCategories.forEach(function(c){
		c.emojiButtons.forEach(function(b){
			b.style = c.getStyle();
		});
	});
}

function saveRecents() {
	let backUp = '';
	for(var i = 0; i<NB_COLS; i++){
		backUp = backUp + recents[i].label + ',';
	}
	Convenience.getSettings().set_string('recents', backUp);
}

function buildRecents() {
	/*
	I didn't know where to store "recently used emojis"
	so I put them in a setting key where it is stored as a string.
	The format of the string is 'X,X,X,X,X,' where Xs are emojis.
	So, temp is an array of strings like ['X','X','X','X','X',''] where
	the last item is empty. FIXME use an array FIXME put at first index
	*/
	let temp = Convenience.getSettings().get_string('recents').split(',');
	
	for(var i = 0; i<NB_COLS; i++){
		if (i < temp.length - 1) {
			//length - 1 because of the empty last item
			recents[i].label = temp[i];
		} else {
			/* 
			If the extension was previously set with less "recently used emojis",
			we still need to load something in the labels.
			It will be a penguin for obvious reasons.
			*/
			recents[i].label = '🐧';
		}
	}
}

//----------------------------------------------

//class EmojiSearchItem
//methods :
//	_init()					create and connect a search entry, added to a menu item
//	_onSearchTextChanged()	change the "recently used" array content in reaction to a new search
const EmojiSearchItem = new Lang.Class({
	Name:		'EmojiSearchItem',
	Extends:	PopupMenu.PopupBaseMenuItem,
	
	_init: function() {
		
		this.parent({
			reactive: false,
			can_focus: false
		});
		
		this.searchEntry = new St.Entry({
			name: 'searchEntry',
			style_class: 'search-entry',
			can_focus: true,
			hint_text: _('Type here to search...'),
			track_hover: true
		});
		
		this.searchEntry.get_clutter_text().connect(
			'text-changed', 
			Lang.bind(this, this._onSearchTextChanged)
		);
		
		this.searchEntry.clutter_text.connect('key-press-event', Lang.bind(this, function(o, e) {
			let symbol = e.get_key_symbol();
			
			if (symbol == Clutter.Return || symbol == Clutter.KP_Enter) {
				let CurrentEmoji = recents[0].label;
				// FIXME il faudrait appliquer des tags à la recherche, mais comment ?
				let tags = [false, false, false];
				Clipboard.set_text(
					CLIPBOARD_TYPE,
					EmojiButton.applyTags(tags, CurrentEmoji)
				);
				GLOBAL_BUTTON.menu.close();
			}
		}));
		
		this.actor.add(this.searchEntry, { expand: true });
	},
	
	_onSearchTextChanged: function() {
		let searchedText = this.searchEntry.get_text();

		if(searchedText === '') {
			buildRecents();
		} else {
			searchedText = searchedText.toLowerCase();
			
			for (let j = 0; j < NB_COLS; j++) {
				recents[j].label = '';
			}
			
			let empty = 0;
			
			/* if no category is selected */
			if (GLOBAL_BUTTON._activeCat == -1) {
				for (let cat = 0; cat < EMOJIS_CHARACTERS.length; cat++) {
					for (let i = 0; i < EMOJIS_CHARACTERS[cat].length; i++) {
						let isMatching = false;
						if (empty < NB_COLS) {
							for (let k = 0; k < EMOJIS_KEYWORDS[cat][i].length; k++) {
								if (_(EMOJIS_KEYWORDS[cat][i][k]).includes(searchedText)) {
									isMatching = true;
								}
							}
							if (isMatching){
								recents[empty].label = EMOJIS_CHARACTERS[cat][i];
								empty++;
							}
						}
					}
				}
			}
			
			/* if a category is selected */
			else {
				let cat = GLOBAL_BUTTON._activeCat;
				for (let i = 0; i < EMOJIS_CHARACTERS[cat].length; i++) {
					let isMatching = false;
					if (empty < NB_COLS) {
						for (let k = 0; k < EMOJIS_KEYWORDS[cat][i].length; k++) {
							if (_(EMOJIS_KEYWORDS[cat][i][k]).includes(searchedText)) {
								isMatching = true;
							}
						}
						if (isMatching){
							recents[empty].label = EMOJIS_CHARACTERS[cat][i];
							empty++;
						}
					}
				}
			}
		}
		return;
	}
});

//class EmojiCategory
//This is the main class of this extension, corresponding to the menu in the top panel
//methods :
//	_init()						initialize the menu (buttons, search entry, recently used)
//	toggle()					open/close the menu (not useful wrapper)
//	_createAllCategories()		create all categories (buttons & submenu menuitems), empty
//	_addAllCategories()			add all invisible submenu menuitems to the extension interface
//	_renderPanelMenuHeaderBox()	add "back" button & categories' buttons to the extension interface
//	clearCategories()			clean the interface & close an eventual opened category
//	_onSearchTextChanged		wrapper calling EmojiSearchItem's _onSearchTextChanged
//	getStyle()					return the CSS to apply to buttons (as a string)
//	_recentlyUsedInit()			initialize the array of recently used emojis
//	copyRecent(??,??,??)		euh...
//	_bindShortcut()				bind the keyboard shorcut
//	destroy()					destroy the button and its menu
const EmojisMenu = new Lang.Class({
	Name:		'EmojisMenu',		// Class Name
	Extends:	PanelMenu.Button,	// Parent Class

	_init: function() {
		this.parent(0.0, 'EmojisMenu');
		let box = new St.BoxLayout();
		let icon = new St.Icon({ icon_name: 'face-cool-symbolic', style_class: 'system-status-icon emotes-icon'});

		box.add(icon);
		box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
		this.actor.add_child(box);
		this._permanentItems = 0;
		this._activeCat = -1;
		this.actor.visible = SETTINGS.get_boolean('always-show');
		
		//initializing categories
		this._createAllCategories();
		
		//initializing this._buttonMenuItem
		this._renderPanelMenuHeaderBox();
		
		//creating the search entry
		this.searchItem = new EmojiSearchItem();
		
		//initializing the "recently used" buttons	
		let RecentlyUsed = this._recentlyUsedInit();
		
		//-------------------------------------------------
		
		if (POSITION === 'top') {
			this.menu.addMenuItem(this._buttonMenuItem);
			this._permanentItems++;
			this.menu.addMenuItem(this.searchItem);
			this._permanentItems++;
			
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
		}
		
		//-----------------------------------------------
		
		this._addAllCategories();
		
		//-----------------------------------------------
		
		if (POSITION === 'bottom') {
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
			
			this.menu.addMenuItem(this.searchItem);
			this._permanentItems++;
			
			this.menu.addMenuItem(this._buttonMenuItem);
			this._permanentItems++;
		}
		
		//-----------------------------------------------
		
		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
		this.menu.connect('open-state-changed', Lang.bind(this, function(self, open){
			this.actor.visible = open || SETTINGS.get_boolean('always-show');
			
			this.clearCategories();
			this.searchItem.searchEntry.set_text('');
			
			let a = Mainloop.timeout_add(20, Lang.bind(this, function() {
				if (open) {
					global.stage.set_key_focus(this.searchItem.searchEntry);
				}
				Mainloop.source_remove(a);
			}));
		}));
		
		if(SETTINGS.get_boolean('use-keybinding')) {
			this._bindShortcut();
		}
	},
	
	toggle: function() {
		this.menu.toggle();
	},
	
	_createAllCategories: function() {
		this.emojiCategories = [];
	
		/* creating new categories with emojis loaded in EMOJIS_CHARACTERS */
		this.emojiCategories[0] = new EmojiCategory(	_('Smileys & Body'),		'face-smile-symbolic',			0	);
		this.emojiCategories[1] = new EmojiCategory(	_('Peoples & Clothing'),	'contact-new-symbolic',			1	);	
		this.emojiCategories[2] = new EmojiCategory(	_('Animals & Nature'),		'face-monkey-symbolic',			2	);	
		this.emojiCategories[3] = new EmojiCategory(	_('Food & Drink'), 			'my-caffeine-on-symbolic',		3	);
		this.emojiCategories[4] = new EmojiCategory(	_('Travel & Places'), 		'airplane-mode-symbolic',		4	);
		this.emojiCategories[5] = new EmojiCategory(	_('Activities & Sports'),	'applications-games-symbolic',	5	);
		this.emojiCategories[6] = new EmojiCategory(	_('Objects'),				'alarm-symbolic',				6	);
		this.emojiCategories[7] = new EmojiCategory(	_('Symbols'),				'emblem-default-symbolic',		7	);
		this.emojiCategories[8] = new EmojiCategory(	_('Flags'),					'flag-symbolic',				8	);
	},
	
	_addAllCategories: function() {
		for (let i = 0; i< 9; i++) {
			this.menu.addMenuItem(this.emojiCategories[i]);
		}
	},
	
	_renderPanelMenuHeaderBox: function() {
		this._buttonMenuItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false
		});
		this.categoryButton = [];
		for (let i = 0; i< 9; i++) {
			this._buttonMenuItem.actor.add(this.emojiCategories[i].getButton(), { expand: true, x_fill: false });
		}
	},
	
	clearCategories: function(){
		// removing the blue color of previously opened category's button
		for (let i = 0; i< 9; i++) {
			this.emojiCategories[i].getButton().style = 'background-color: transparent;';
		}
		
		let items = this.menu._getMenuItems();
		
		// closing and hinding opened categories
		if (POSITION == 'top') {
			for( var i = this._permanentItems; i < items.length; i++){
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}
		
		if (POSITION == 'bottom') {
			for( var i = 0; i < items.length - this._permanentItems; i++){
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}
		
		this._activeCat = -1;
		this._onSearchTextChanged(); //non optimal
	},
	
	_onSearchTextChanged: function() {
		this.searchItem._onSearchTextChanged();
		return;
	},
	
	getStyle: function() {
		let fontStyle = 'font-size: ' + ( Convenience.getSettings().get_int('emojisize') ) + 'px;';
		if(Convenience.getSettings().get_boolean('light-theme')){
			fontStyle += ' color: #000000;';
		} else {
			fontStyle += ' color: #FFFFFF;';
		}
		return fontStyle;
	},
	
	_recentlyUsedInit: function() {
		
		let RecentlyUsed = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false,
		});
		recents = [];
		
		let fontStyle = this.getStyle();
		
		for(var i = 0;i<NB_COLS;i++){
			recents[i] = new St.Button({
				style_class: 'EmojisItemStyle',
				style: fontStyle,
				can_focus: true,
			});
		}
		
		let container = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(container, { expand: true });
		
		buildRecents();
		
		for(var i = 0;i<NB_COLS;i++){
			/*
			These buttons will not be destroy during search.
			The signal needs to be able to handle different situations :
			- when the item is actually a recent emoji
			- when the item is a search result (in this case, it needs to
			be added to recent emojis)
			*/
			recents[i].connect('button-press-event', Lang.bind(
				this,
				this.copyRecent,
				i
			));
			
			recents[i].connect('key-press-event', Lang.bind(this, function(o, e, i) {
				let symbol = e.get_key_symbol();
				
				if (symbol == Clutter.Return || symbol == Clutter.KP_Enter) {
					let CurrentEmoji = recents[i].label;
					let tags = [false, false, false]; //FIXME ??
					let [x, y, mods] = global.get_pointer();
					let majPressed = (mods & Clutter.ModifierType.SHIFT_MASK) != 0;
					let ctrlPressed = (mods & Clutter.ModifierType.CONTROL_MASK) != 0;
					if (majPressed) {
						Clipboard.get_text(CLIPBOARD_TYPE, function (clipBoard, text) {
							Clipboard.set_text(
								CLIPBOARD_TYPE,
								text + EmojiButton.applyTags(tags, CurrentEmoji)
							);
						});
						return Clutter.EVENT_STOP;
					} else if (ctrlPressed) {
						Clipboard.set_text(
							CLIPBOARD_TYPE,
							EmojiButton.applyTags(tags, CurrentEmoji)
						);
						return Clutter.EVENT_STOP;
					} else {
						Clipboard.set_text(
							CLIPBOARD_TYPE,
							EmojiButton.applyTags(tags, CurrentEmoji)
						);
						GLOBAL_BUTTON.menu.close();
						return Clutter.EVENT_STOP;
					}
				}
			}, i));
		}
		
		for(var i = 0;i<NB_COLS;i++){
			container.add_child(recents[i]);
		}
		
		return RecentlyUsed;
		//end of _recentlyUsedInit
	},
	
	copyRecent: function(a, e, i) {
		EmojiButton.genericOnButtonPress(a, e, [false, false, false], recents[i].label);
	},
	
	_bindShortcut: function() {
		var ModeType = Shell.hasOwnProperty('ActionMode') ?
			Shell.ActionMode : Shell.KeyBindingMode;

		Main.wm.addKeybinding(
			'emoji-keybinding',
			SettingsSchema,
			Meta.KeyBindingFlags.NONE,
			ModeType.ALL,
			Lang.bind(this, this.toggle)
		);
	},
	
	destroy: function() {
		this.parent();
	}
});

//------------------------------------------------------------

function init() {
	Convenience.initTranslations("emoji-selector");
	let theme = imports.gi.Gtk.IconTheme.get_default();
	theme.append_search_path(Me.path + "/icons");
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
	Main.panel.addToStatusArea('EmojisMenu', GLOBAL_BUTTON, 0, 'right');
	
	SIGNAUX[0] = SETTINGS.connect('changed::emojisize', Lang.bind(this, function(){
		updateStyle();
	}));
	SIGNAUX[1] = SETTINGS.connect('changed::light-theme', Lang.bind(this, function(){
		updateStyle();
	}));
	SIGNAUX[2] = SETTINGS.connect('changed::always-show', Lang.bind(this, function(){
		GLOBAL_BUTTON.actor.visible = SETTINGS.get_boolean('always-show');
	}));
	SIGNAUX[3] = SETTINGS.connect('changed::use-keybinding', Lang.bind(this, function(z){
		if(z.get_boolean('use-keybinding')) {
			Main.wm.removeKeybinding('emoji-keybinding');
			GLOBAL_BUTTON._bindShortcut();
		} else {
			Main.wm.removeKeybinding('emoji-keybinding');
		}
	}));
}

//------------------------------------------------------------

function disable() {
	//we need to save labels currently in recents[] for the next session
	saveRecents();

	if(SETTINGS.get_boolean('use-keybinding')) {
		Main.wm.removeKeybinding('emoji-keybinding');
	}
	
	SETTINGS.disconnect(SIGNAUX[0]);
	SETTINGS.disconnect(SIGNAUX[1]);
	SETTINGS.disconnect(SIGNAUX[2]);
	SETTINGS.disconnect(SIGNAUX[3]);
	
	GLOBAL_BUTTON.destroy();
}

