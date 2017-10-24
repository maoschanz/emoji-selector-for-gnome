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

const Em = Me.imports.emojisCharacters;

//------------------------------------------------------------

/* Global variable : globalButton to click in the topbar */
let globalButton;

/* this array will stock some St.Button(s) */
let recents = [];

//-----------------------------------------------

/* These global variables used to store some settings */
let nbRecents;
let nbCols;
let position;
let classicInterface;
let searchEnabled;

//-----------------------------------------------

function saveRecents() {
	let backUp = '';
	for(var i = 0;i<nbRecents;i++){
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
	
	for(var i = 0;i<nbRecents;i++){
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
	
	for(var j = nbRecents-1;j > 0;j--){
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
	
	_init:		function(categoryName, emojiList) {
		this.parent(categoryName);
		let ln, container;
		
		if(!classicInterface) {
			this.actor.visible = false;
		}
		
		for (var i = 0; i < emojiList.length; i++) {
			
			// management of lines of emojis
			if (i % nbCols === 0) {
				ln = new PopupMenu.PopupBaseMenuItem({
					reactive: false
				});
				ln.actor.track_hover = false;
				container = new St.BoxLayout();
				ln.actor.add(container, { expand: true });
				this.menu.addMenuItem(ln);
			}
			
			// creation of the clickable button
			let fontSize = 'font-size: ' + Convenience.getSettings().get_int('emojisize') + 'px';
			let button = new St.Button(
				{ style_class: 'EmojisItemStyle', style: fontSize }
			);
			let CurrentEmoji = emojiList[i];
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

	destroy: function() {
		this.parent();
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
		
		//-------------------------------------------------
		
		//initializing this._buttonMenu
		this._renderPanelMenuHeaderBox();
		
		//creating the search entry
		let searchItem = this._initSearch();
		
		//initializing the "recently used" buttons	
		let RecentlyUsed = this._recentlyUsedInit();
		
		//-------------------------------------------------
		
		if (position === 'top') {
			if(!classicInterface) {
				this.menu.addMenuItem(this._buttonMenu);
				this._permanentItems++;
			}
			if(searchEnabled) {
				this.menu.addMenuItem(searchItem);
				this._permanentItems++;
			}
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
		}
		
		//-----------------------------------------------
		
		this._addAllCategories();
		
		//-----------------------------------------------
		
		if (position === 'bottom') {
			this.menu.addMenuItem(RecentlyUsed);
			this._permanentItems++;
			if(searchEnabled) {
				this.menu.addMenuItem(searchItem);
				this._permanentItems++;
			}
			if(!classicInterface) {
				this.menu.addMenuItem(this._buttonMenu);
				this._permanentItems++;
			}
		}
		
		//-----------------------------------------------
		
		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
		this.menu.connect('open-state-changed', Lang.bind(this, function(self, open){
			
			if(!classicInterface) {
				this.clearCategories();
			}
			
			let a = Mainloop.timeout_add(20, Lang.bind(this, function() {
				if (open) {
					this.searchEntry.set_text('');
					global.stage.set_key_focus(this.searchEntry);
					Mainloop.source_remove(a);
				}
			}));
		}));
		
		this._bindShortcut();
		// end of _init
	},
	
	toggle: function() {
		this.menu.toggle();
	},
	
	_initSearch: function() {
		this.searchEntry = new St.Entry({
			name: 'searchEntry',
			style_class: 'search-entry',
			can_focus: true,
			hint_text: _('Type here to search...'),
			track_hover: true
		});
		
		this.searchEntry.get_clutter_text().connect(
			'text-changed', 
			Lang.bind(this, this._on_search_text_changed)
		);
		
		this.searchEntry.clutter_text.connect(
			'key-press-event', 
			Lang.bind(this, function(o, e) {
				let symbol = e.get_key_symbol();
				if (symbol == Clutter.Return || symbol == Clutter.KP_Enter) {
					let CurrentEmoji = recents[0].label;
					Clipboard.set_text(CLIPBOARD_TYPE, CurrentEmoji);
					this.searchEntry.set_text('');
					buildRecents();
					
					let isIn = false;
					for(var i = 0;i<nbRecents;i++){
						if (recents[i].label == CurrentEmoji) {
							isIn = true;
						}
					}
				
					if(!isIn) {
						shiftFor(CurrentEmoji);
					}
					globalButton.menu.close();
				}
			})
		);
		
		let searchItem = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		searchItem.actor.add(this.searchEntry, { expand: true });
		return searchItem;
	},
	
	_addAllCategories: function() {
		
		this.emojiCategories = [];
		
		/* creating new categories with emojis loaded in Em */
		this.emojiCategories[0] = new EmojiCategory(	_('Smileys & People'),		Em.ALL[0]	);
		this.emojiCategories[1] = new EmojiCategory(	_('Animals & Nature'),		Em.ALL[1]	);	
		this.emojiCategories[2] = new EmojiCategory(	_('Food & Drink'), 			Em.ALL[2]	);
		this.emojiCategories[3] = new EmojiCategory(	_('Travel & Places'), 		Em.ALL[3]	);
		this.emojiCategories[4] = new EmojiCategory(	_('Activities & Sports'), 	Em.ALL[4]	);
		this.emojiCategories[5] = new EmojiCategory(	_('Objects'),				Em.ALL[5]	);
		this.emojiCategories[6] = new EmojiCategory(	_('Symbols'),				Em.ALL[6]	);
		this.emojiCategories[7] = new EmojiCategory(	_('Flags'),					Em.ALL[7]	);
		
		//-------------------------------------------------
		
		for (let i = 0; i< 8; i++) {
//			this.categoryButton[i].connect('clicked', Lang.bind(this, function(i){
//				this.clearCategories();
//				this.emojiCategories[i].actor.visible = true;
//				this.emojiCategories[i].setSubmenuShown(true);
//				this._activeCat = i;
//			}));
			
			this.menu.addMenuItem(this.emojiCategories[i]);
		}
		
		this.categoryButton[0].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[0].actor.visible = true;
			this.emojiCategories[0].setSubmenuShown(true);
			this._activeCat = 0;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[1].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[1].actor.visible = true;
			this.emojiCategories[1].setSubmenuShown(true);
			this._activeCat = 1;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[2].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[2].actor.visible = true;
			this.emojiCategories[2].setSubmenuShown(true);
			this._activeCat = 2;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[3].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[3].actor.visible = true;
			this.emojiCategories[3].setSubmenuShown(true);
			this._activeCat = 3;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[4].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[4].actor.visible = true;
			this.emojiCategories[4].setSubmenuShown(true);
			this._activeCat = 4;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[5].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[5].actor.visible = true;
			this.emojiCategories[5].setSubmenuShown(true);
			this._activeCat = 5;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[6].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[6].actor.visible = true;
			this.emojiCategories[6].setSubmenuShown(true);
			this._activeCat = 6;
			this._on_search_text_changed();
		}));
		
		this.categoryButton[7].connect('clicked', Lang.bind(this, function(i){
			this.clearCategories();
			this.emojiCategories[7].actor.visible = true;
			this.emojiCategories[7].setSubmenuShown(true);
			this._activeCat = 7;
			this._on_search_text_changed();
		}));
		
	},
	
	_renderPanelMenuHeaderBox: function() {
	
		let systemMenu = Main.panel.statusArea.aggregateMenu._system;
		this._buttonMenu = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		
		this.backBtn = systemMenu._createActionButton('go-previous-symbolic', _("Back"));
		this._buttonMenu.actor.add_actor(this.backBtn);
		
		this.categoryButton = [];
		
		this.createButton('face-smile-symbolic',		"Smileys & People",		0);
		this.createButton('face-monkey-symbolic',		"Animals & Nature",		1);
		this.createButton('my-caffeine-on-symbolic',	"Food & Drink",			2);
		this.createButton('airplane-mode-symbolic',		"Activities & Sports",	3);
		this.createButton('applications-games-symbolic',"Travel & Places",		4);
		this.createButton('alarm-symbolic',				"Objects",				5);
		this.createButton('emblem-default-symbolic',	"Symbols",				6);
		this.createButton('flag-symbolic', 				"Flags",				7);
		
		this.backBtn.connect('clicked', Lang.bind(this, this.clearCategories));
	},
	
	createButton: function(icon, accessibleName, i) {
		let systemMenu = Main.panel.statusArea.aggregateMenu._system;
		this.categoryButton[i] = systemMenu._createActionButton(icon, _(accessibleName));
		this._buttonMenu.actor.add_actor(this.categoryButton[i]);
	},
	
	clearCategories: function(){
		
		let items = this.menu._getMenuItems();
		
		if (position == 'top') {
			for( var i = this._permanentItems; i < items.length; i++){
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}
		
		if (position == 'bottom') {
			for( var i = 0; i < items.length - this._permanentItems; i++){
				items[i].setSubmenuShown(false);
				items[i].actor.visible = false;
			}
		}
		
		this._activeCat = -1;
		
		this._on_search_text_changed(); //non optimal
	},
	
	_on_search_text_changed: function() {
		
		let searchedText = this.searchEntry.get_text();

		if(searchedText === '') {
			buildRecents();
		} else {			
			for (let j = 0; j < nbRecents; j++) {
				recents[j].label = ' ';
			}
			
			let empty = 0;
			
			if (this._activeCat == -1) {
				for (let cat = 0; cat < Em.ALL.length; cat++) {
					for (let i = 0; i < Em.ALL[cat].length; i++) {
						let isMatching = false;
						if (empty < nbRecents) {
							for (let k = 0; k < Em.ALL_TEXT[cat][i].length; k++) {
								if ( searchedText.substr(0, searchedText.length) == _( Em.ALL_TEXT[cat][i][k]).substr(0, searchedText.length) ){
									isMatching = true;
								}
							}
							if (isMatching){
								recents[empty].label = Em.ALL[cat][i];
								empty++;
							}
						}
					}
				}
			} else {
				let cat = this._activeCat;
				for (let i = 0; i < Em.ALL[cat].length; i++) {
					let isMatching = false;
					if (empty < nbRecents) {
						for (let k = 0; k < Em.ALL_TEXT[cat][i].length; k++) {
							if ( searchedText.substr(0, searchedText.length) == _( Em.ALL_TEXT[cat][i][k]).substr(0, searchedText.length) ){
								isMatching = true;
							}
						}
						if (isMatching){
							recents[empty].label = Em.ALL[cat][i];
							empty++;
						}
					}
				}
			}
		}
	},
	
	_recentlyUsedInit: function () {
		
		let RecentlyUsed = new PopupMenu.PopupBaseMenuItem({
			reactive: false
		});
		recents = [];
		
		for(var i = 0;i<nbRecents;i++){
			recents[i] = new St.Button({ style_class: 'RecentItemStyle' });
		}
		
		let container = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(container, { expand: true });
		
		buildRecents();
		
		for(var i = 0;i<nbRecents;i++){
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
				
				/*
				The "isIn" boolean is true if the clicked emoji is already
				saved as recently used in the setting key.
				*/
				let isIn = false;
				let temp = Convenience.getSettings().get_string('recents').split(',');
				for(var i = 0;i<nbRecents;i++){
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
		
		for(var i = 0;i<nbRecents;i++){
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
}

//------------------------------------------------------------

function enable() {	
	let _settings = Convenience.getSettings();
	//_settings = Convenience.getSettings('org.gnome.shell.extensions.emoji-selector');
	
	nbRecents = _settings.get_int('nbrecents');
	nbCols = _settings.get_int('nbcols');
	position = _settings.get_string('position');
	classicInterface = _settings.get_boolean('classic-interface');
	searchEnabled = _settings.get_boolean('search-enabled');
	
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
	Main.wm.removeKeybinding('emoji-keybinding');
	globalButton.destroy();
	Main.panel.statusArea['EmojisMenu'];
}
