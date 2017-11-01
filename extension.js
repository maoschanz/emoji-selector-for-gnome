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

const EMOJIS_CHARACTERS = Me.imports.emojisCharacters.ALL;
//const EMOJIS_KEYWORDS = Me.imports.emojisKeywords.ALL_KEYWORDS;
let EMOJIS_KEYWORDS; //Keywords lists will be loaded only if research is enabled

//------------------------------------------------------------

/* Global variable : globalButton to click in the topbar */
let globalButton;

/* this array will stock some St.Button(s) */
let recents = [];

//-----------------------------------------------

/* These global variables are used to store some settings */
let NB_RECENTS;
let NB_COLS;
let POSITION;
let CLASSIC_INTERFACE;
let SEARCH_ENABLED;

//-----------------------------------------------

function saveRecents() {
	let backUp = '';
	for(var i = 0;i<NB_RECENTS;i++){
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
	the last item is empty.
	*/
	let temp = Convenience.getSettings().get_string('recents').split(',');
	
	for(var i = 0;i<NB_RECENTS;i++){
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

function shiftFor(CurrentEmoji) {
	if (CurrentEmoji == '') {return;}
	
	for(var j = NB_RECENTS-1;j > 0;j--){
		recents[j].label = recents[j-1].label;
	}
	recents[0].label = CurrentEmoji;
	saveRecents(); 
}

//-------------------------------------------------

//class EmojiCategory
//methods :	_init(categoryName, emojiList)
//			destroy()
const EmojiCategory = new Lang.Class({
	Name:		'EmojiCategory',
	Extends:	PopupMenu.PopupSubMenuMenuItem,
	
	_init:		function(categoryName, iconName, id) {
		this.parent(categoryName);
		let ln, container;
		
		if(!CLASSIC_INTERFACE) {
			this.actor.visible = false;
		}
		
		this.id = id;

		this.categoryButton = Main.panel.statusArea.aggregateMenu._system._createActionButton(iconName, categoryName);
		this.categoryButton.connect('clicked', Lang.bind(this, this._openCategory));
		
		for (var i = 0; i < EMOJIS_CHARACTERS[id].length; i++) {
			
			// management of lines of emojis
			if (i % NB_COLS === 0) {
				ln = new PopupMenu.PopupBaseMenuItem({
					reactive: false
				});
				ln.actor.track_hover = false;
				container = new St.BoxLayout();
				ln.actor.add(container, { expand: true });
				this.menu.addMenuItem(ln);
			}
			
			// creation of the clickable button
			let fontStyle = this.getStyle();
			let button = new St.Button(
				{ style_class: 'EmojisItemStyle', style: fontStyle }
			);
			let CurrentEmoji = EMOJIS_CHARACTERS[id][i];
			button.label = CurrentEmoji;
			
			//connection of the button
			button.connect('clicked', Lang.bind(this, function(){
				/* setting the emoji in the clipboard */
				Clipboard.set_text(CLIPBOARD_TYPE, CurrentEmoji);
				shiftFor(CurrentEmoji);
				this.menu.close();
				globalButton.menu.close();
			}));
			container.add_child(button, {hover: true});
		}
	},

	getStyle: function() {
		let fontStyle = 'font-size: ' + Convenience.getSettings().get_int('emojisize') + 'px;';
		if (Convenience.getSettings().get_boolean('light-theme')) {
			fontStyle += ' color: #000000;';
		} else {
			fontStyle += ' color: #FFFFFF;';
		}
		return fontStyle;
	},
	
	_openCategory: function() {
		globalButton.clearCategories();
		this.actor.visible = true;
		this.setSubmenuShown(true);
		globalButton._activeCat = this.id;
		globalButton._onSearchTextChanged();
	},
	
	getButton: function() {
		return this.categoryButton;
	},
	
	destroy: function() {
		this.parent();
	}
});

//------------------------------------------------

const EmojiResearchItem = new Lang.Class({
	Name:		'EmojiResearchItem',
	Extends:	PopupMenu.PopupBaseMenuItem,
	
	_init: function() {
		
		this.parent({	reactive: false	});
			
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
				Clipboard.set_text(CLIPBOARD_TYPE, CurrentEmoji);
				this.searchEntry.set_text('');
				buildRecents();
				
				let isIn = false;
				for(var i = 0;i<NB_RECENTS;i++){
					if (recents[i].label == CurrentEmoji) {
						isIn = true;
					}
				}
			
				if(!isIn) {
					shiftFor(CurrentEmoji);
				}
				globalButton.menu.close();
			}
		}));
		
		this.actor.add(this.searchEntry, { expand: true });
	},
	
	_onSearchTextChanged: function() {
		if(!SEARCH_ENABLED)
			return;
		
		let searchedText = this.searchEntry.get_text();

		if(searchedText === '') {
			buildRecents();
		} else {			
			for (let j = 0; j < NB_RECENTS; j++) {
				recents[j].label = ' ';
			}
			
			let empty = 0;
			
			if (globalButton._activeCat == -1) {
				for (let cat = 0; cat < EMOJIS_CHARACTERS.length; cat++) {
					for (let i = 0; i < EMOJIS_CHARACTERS[cat].length; i++) {
						let isMatching = false;
						if (empty < NB_RECENTS) {
							for (let k = 0; k < EMOJIS_KEYWORDS[cat][i].length; k++) {
								if ( searchedText.substr(0, searchedText.length) == _( EMOJIS_KEYWORDS[cat][i][k]).substr(0, searchedText.length) ){
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
			} else {
				let cat = globalButton._activeCat;
				for (let i = 0; i < EMOJIS_CHARACTERS[cat].length; i++) {
					let isMatching = false;
					if (empty < NB_RECENTS) {
						for (let k = 0; k < EMOJIS_KEYWORDS[cat][i].length; k++) {
							if ( searchedText.substr(0, searchedText.length) == _( EMOJIS_KEYWORDS[cat][i][k]).substr(0, searchedText.length) ){
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

//------------------------------------------------

const EmojisMenu = new Lang.Class({
	Name:		'EmojisMenu',		// Class Name
	Extends:	PanelMenu.Button,	// Parent Class

	_init: function() {
		this.parent(0.0, 'EmojisMenu');
		let box = new St.BoxLayout();
		let icon = new St.Icon({ icon_name: 'face-cool-symbolic', style_class: 'system-status-icon emotes-icon'});

		let toplabel = new St.Label({
			y_align: Clutter.ActorAlign.CENTER
		});

		box.add(icon);
		box.add(toplabel);
		box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
		this.actor.add_child(box);
		this._permanentItems = 0;
		this._activeCat = -1;
		
		//--------------------------------------------------
		
		//initializing categories
		this._createAllCategories();
		
		//initializing this._buttonMenu
		this._renderPanelMenuHeaderBox();
		
		if(SEARCH_ENABLED) {
			//creating the search entry
			EMOJIS_KEYWORDS = Me.imports.emojisKeywords.ALL_KEYWORDS;
			this.researchItem = new EmojiResearchItem();
		}
		
		//initializing the "recently used" buttons	
		let RecentlyUsed = this._recentlyUsedInit();
		
		//-------------------------------------------------
		
		if (POSITION === 'top') {
			if(!CLASSIC_INTERFACE) {
				this.menu.addMenuItem(this._buttonMenu);
				this._permanentItems++;
			}
			if(SEARCH_ENABLED) {
				this.menu.addMenuItem(this.researchItem);
				this._permanentItems++;
			}
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
		}
		
		//-----------------------------------------------
		
		this._addAllCategories();
		
		//-----------------------------------------------
		
		if (POSITION === 'bottom') {
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
			if(SEARCH_ENABLED) {
				this.menu.addMenuItem(this.researchItem);
				this._permanentItems++;
			}
			if(!CLASSIC_INTERFACE) {
				this.menu.addMenuItem(this._buttonMenu);
				this._permanentItems++;
			}
		}
		
		//-----------------------------------------------
		
		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
		this.menu.connect('open-state-changed', Lang.bind(this, function(self, open){
			
			if(!CLASSIC_INTERFACE) {
				this.clearCategories();
			}
			
			let a = Mainloop.timeout_add(20, Lang.bind(this, function() {
				if (open && SEARCH_ENABLED) {
					this.researchItem.searchEntry.set_text('');
					global.stage.set_key_focus(this.researchItem.searchEntry);
				}
				Mainloop.source_remove(a);
			}));
		}));
		
		if(Convenience.getSettings().get_boolean('use-keybinding')) {
			this.USE_KEYBINDING = true;
			this._bindShortcut();
		} else {
			this.USE_KEYBINDING = false;
		}
		// end of _init //----------------------------------		
	},
	
	toggle: function() {
		this.menu.toggle();
	},
	
	_createAllCategories: function() {
		this.emojiCategories = [];
	
		/* creating new categories with emojis loaded in EMOJIS_CHARACTERS */
		this.emojiCategories[0] = new EmojiCategory(	_('Smileys & People'),		'face-smile-symbolic',			0	);
		this.emojiCategories[1] = new EmojiCategory(	_('Animals & Nature'),		'face-monkey-symbolic',			1	);	
		this.emojiCategories[2] = new EmojiCategory(	_('Food & Drink'), 			'my-caffeine-on-symbolic',		2	);
		this.emojiCategories[3] = new EmojiCategory(	_('Travel & Places'), 		'airplane-mode-symbolic',		3	);
		this.emojiCategories[4] = new EmojiCategory(	_('Activities & Sports'),	'applications-games-symbolic',	4	);
		this.emojiCategories[5] = new EmojiCategory(	_('Objects'),				'alarm-symbolic',				5	);
		this.emojiCategories[6] = new EmojiCategory(	_('Symbols'),				'emblem-default-symbolic',		6	);
		this.emojiCategories[7] = new EmojiCategory(	_('Flags'),					'flag-symbolic',				7	);
	},
	
	_addAllCategories: function() {
		for (let i = 0; i< 8; i++) {			
			this.menu.addMenuItem(this.emojiCategories[i]);
		}
	},
	
	_renderPanelMenuHeaderBox: function() {
	
		let systemMenu = Main.panel.statusArea.aggregateMenu._system;
		this._buttonMenu = new PopupMenu.PopupBaseMenuItem(	{	reactive: false	}	);
		
		this.backBtn = systemMenu._createActionButton('go-previous-symbolic', _("Back"));
		this._buttonMenu.actor.add_actor(this.backBtn);
		
		this.categoryButton = [];
		
		for (let i = 0; i< 8; i++) {
			this._buttonMenu.actor.add_actor(this.emojiCategories[i].getButton());
		}
		
		this.backBtn.connect('clicked', Lang.bind(this, this.clearCategories));
	},
	
	clearCategories: function(){
		
		let items = this.menu._getMenuItems();
		
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
		if(SEARCH_ENABLED){
			this.researchItem._onSearchTextChanged();
		}
		return;
	},
	
	getStyle: function() {
		let fontStyle = 'font-size: ' + ( Convenience.getSettings().get_int('emojisize') + 4 ) + 'px;';
		if(Convenience.getSettings().get_boolean('light-theme')){
			fontStyle += ' color: #000000;';
		} else {
			fontStyle += ' color: #FFFFFF;';
		}
		return fontStyle;
	},
	
	_recentlyUsedInit: function () {
		
		let RecentlyUsed = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		recents = [];
		
		let fontStyle = this.getStyle();
		
		for(var i = 0;i<NB_RECENTS;i++){
			recents[i] = new St.Button({ style_class: 'RecentItemStyle', style: fontStyle });
		}
		
		let container = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(container, { expand: true });
		
		buildRecents();
		
		for(var i = 0;i<NB_RECENTS;i++){
			/*
			These buttons will not be destroy during research.
			The signal needs to be able to handle different situations :
			- when the item is actually a recent emoji
			- when the item is a search result (in this case, it needs to
			be added to recent emojis)
			*/
			recents[i].connect('clicked', Lang.bind(this, function(){
				let retour = recents[arguments[2]].label;
				
				Clipboard.set_text(CLIPBOARD_TYPE, retour);
				
			//	The "isIn" boolean is true if the clicked emoji is already saved as recently used in the setting key.
				let isIn = false;
				let temp = Convenience.getSettings().get_string('recents').split(',');
				for(var i = 0;i<NB_RECENTS;i++){
					if (temp[i] == retour) {
						isIn = true;
					}
				}
				/* The "recents" list from before the research is rebuild */
				buildRecents();
				/* Then it's modified because the searched emoji need to be added */
				if (!isIn) {
					shiftFor(retour);
				}
				saveRecents();
				this.menu.close();
			}, i));
		}
		
		for(var i = 0;i<NB_RECENTS;i++){
			container.add_child(recents[i], {hover: true});
		}
		
		return RecentlyUsed;
		//end of _recentlyUsedInit
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

//-----------------

const SCHEMA_NAME = 'org.gnome.shell.extensions.emoji-selector';

const getSchema = function () {
	let schemaDir = Me.dir.get_child('schemas').get_path();
	let schemaSource = Gio.SettingsSchemaSource.new_from_directory(schemaDir, Gio.SettingsSchemaSource.get_default(), false);
	let schema = schemaSource.lookup(SCHEMA_NAME, false);

	return new Gio.Settings({ settings_schema: schema });
}

const SettingsSchema = getSchema();

//------------------------------------------------------------

function init() {
	Convenience.initTranslations("emoji-selector");
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(Me.path + "/icons");
}

//------------------------------------------------------------

let _settings
function enable() {	
	_settings = Convenience.getSettings();
	//_settings = Convenience.getSettings('org.gnome.shell.extensions.emoji-selector');
	
	NB_RECENTS = _settings.get_int('nbrecents');
	NB_COLS = _settings.get_int('nbcols');
	POSITION = _settings.get_string('position');
	CLASSIC_INTERFACE = _settings.get_boolean('classic-interface');
	SEARCH_ENABLED = _settings.get_boolean('search-enabled');
	
	globalButton = new EmojisMenu();
//	about addToStatusArea :
//	- 0 is the position
//	- `right` is the box where we want our globalButton to be displayed (left/center/right)
	Main.panel.addToStatusArea('EmojisMenu', globalButton, 0, 'right');
}

//------------------------------------------------------------

function disable() {
	//we need to save labels currently in recents[] for the next session
	saveRecents();
	if(globalButton.USE_KEYBINDING) {
		Main.wm.removeKeybinding('emoji-keybinding');
	}
	globalButton.destroy();
}
