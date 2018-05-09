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

/*
 * Import data (array of arrays of characters, and array of arrays of strings).
 * Keywords are used for both:
 * - research
 * - skin tone management
 * - gender management
 */
const EMOJIS_CHARACTERS = Me.imports.emojisCharacters.ALL;
const EMOJIS_KEYWORDS = Me.imports.emojisKeywords.ALL_KEYWORDS;

//				none	woman					man
const GENDERS =	['',	'\u200D\u2640\uFE0F',	'\u200D\u2642\uFE0F'];
const GENDERS2 = ['👩','👨'];
const TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

//------------------------------------------------------------

/*
TODO
affichage prétraité ?
...
*/

/* Global variable : globalButton to click in the topbar */
let globalButton;

/* this array will stock some St.Button(s) */
let recents = [];

//-----------------------------------------------

/* These global variables are used to store some settings */
let NB_COLS;
let POSITION;

//-----------------------------------------------

function updateStyle() {
	recents.forEach(function(b){
		b.style = globalButton.getStyle();
	});
	globalButton.emojiCategories.forEach(function(c){
		c.emojiButtons.forEach(function(b){
			b.style = c.getStyle();
		});
	});
}

function saveRecents() {
	let backUp = '';
	for(var i = 0;i<NB_COLS;i++){
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
	
	for(var i = 0;i<NB_COLS;i++){
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
	
	//	The "isIn" boolean is true if the clicked emoji is already saved as recently used in the setting key.
	let isIn = false;
	let temp = Convenience.getSettings().get_string('recents').split(',');
	for(var i = 0;i<NB_COLS;i++){
		if (temp[i] == CurrentEmoji) {
			isIn = true;
		}
	}
	
	if (!isIn) {
		buildRecents();
		for(var j = NB_COLS-1;j > 0;j--){
			recents[j].label = recents[j-1].label;
		}
		recents[0].label = CurrentEmoji;
		saveRecents();
	}
	globalButton._onSearchTextChanged();
}

/*
 * This function is called at each click and copies the emoji to the clipboard.
 * 
 * The exact behavior of the method depends on the mouse button used:
 * - left click overwrites clipboard content with the emoji, and closes the menu;
 * - middle click too, but does not close the menu;
 * - right click adds the emoji at the end of the current clipboard content (and does not close the menu).
 */
function genericOnButtonPress (actor, event, tags, CurrentEmoji){
	let mouseButton = event.get_button();
	if (mouseButton == 1) {
		Clipboard.set_text(
			CLIPBOARD_TYPE,
			applyTags(tags, CurrentEmoji)
		);
		globalButton.menu.close();
		return Clutter.EVENT_STOP;
	} else if (mouseButton == 2) {
		Clipboard.set_text(
			CLIPBOARD_TYPE,
			applyTags(tags, CurrentEmoji)
		);
		return Clutter.EVENT_STOP;
	} else if (mouseButton == 3) {
		Clipboard.get_text(CLIPBOARD_TYPE, function (clipBoard, text) {
			Clipboard.set_text(
				CLIPBOARD_TYPE,
				text + applyTags(tags, CurrentEmoji)
			);
		});
		return Clutter.EVENT_STOP;
	}
	return Clutter.EVENT_PROPAGATE;		
}
	
/*
 * This returns an emoji corresponding to CurrentEmoji with tags applied to it.
 * If all tags are false, it returns unmodified CurrentEmoji.
 * "tags" is an array of 3 boolean, which describe how a composite emoji is built:
 * - tonable -> return emoji concatened with the selected skin tone;
 * - genrable -> return emoji concatened with the selected gender;
 * - gendered -> the emoji is already gendered, which modifies the way skin tone is
 * applied ([man|woman] + [skin tone if any] + [other symbol(s)]).
 */
function applyTags (tags, CurrentEmoji) {
	if(CurrentEmoji != '') {
		let tonable = tags[0];
		let genrable = tags[1];
		let gendered = tags[2];
		let temp = CurrentEmoji;
//		log( tags + " appliqués à " + CurrentEmoji );
		if (tonable) {
			if (gendered) {
				if (temp.includes(GENDERS2[0])) {
					CurrentEmoji = CurrentEmoji.replace(GENDERS2[0], GENDERS2[0]+TONES[SETTINGS.get_int('skin-tone')])
				} else if (temp.includes(GENDERS2[1])) {
					CurrentEmoji = CurrentEmoji.replace(GENDERS2[1], GENDERS2[1]+TONES[SETTINGS.get_int('skin-tone')])
				} else {
					log('Error: ' + GENDERS2[0] + " isn't a valid gender prefix.");
				}
				temp = CurrentEmoji;
			} else {
				temp += TONES[SETTINGS.get_int('skin-tone')];
			}
		}
		if (genrable) {
			temp += GENDERS[SETTINGS.get_int('gender')];
		}
		shiftFor(temp);
		return temp;
	} // FIXME else ?
}

//-------------------------------------------------

//class EmojiCategory
//methods :	_init()
//			...
//			destroy()
const SkinTonesBar = new Lang.Class({
	Name:	'SkinTonesBar',
	
	_init:	function (hasGender) {
		this._toneArray = [];
		
		this._toneArray[0] = this.buildToneButton(	_("No skin tone")			, '#FFEE00'	);
		this._toneArray[1] = this.buildToneButton(	_("Light skin tone")		, '#FFD8A8'	);
		this._toneArray[2] = this.buildToneButton(	_("Medium light skin tone")	, '#E5B590'	);
		this._toneArray[3] = this.buildToneButton(	_("Medium skin tone")		, '#B88750'	);
		this._toneArray[4] = this.buildToneButton(	_("Medium dark skin tone")	, '#9B6020'	);
		this._toneArray[5] = this.buildToneButton(	_("Dark skin tone")			, '#4B2000'	);
		
		this._toneArray[0].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 0);
		}));
		this._toneArray[1].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 1);
		}));
		this._toneArray[2].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 2);
		}));
		this._toneArray[3].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 3);
		}));
		this._toneArray[4].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 4);
		}));
		this._toneArray[5].connect('clicked', Lang.bind(this, function(w){
			this.removeCircle();
			w.style_class = 'SelectedTone';
			SETTINGS.set_int('skin-tone', 5);
		}));
		
		this._genderArray = [];
		if(hasGender) {
			this._genderArray[0] = new St.Button({
				visible: false,
				label: 'dummy button',
			});
			this._genderArray[1] = new St.Button({
				reactive: true,
				can_focus: true,
				track_hover: true,
				width: 20,
				accessible_name: _("Men"),
				style: 'background-color: black;',
				label: '♀',
			});
			this._genderArray[2] = new St.Button({
				reactive: true,
				can_focus: true,
				track_hover: true,
				width: 20,
				accessible_name: _("Women"),
				style: 'background-color: black;',
				label: '♂',
			});
			
			this._genderArray[1].connect('clicked', Lang.bind(this, function(w){
				
				if (SETTINGS.get_int('gender') != 1) {
					this.clearGender();
					w.style = 'background-color: blue;';
					SETTINGS.set_int('gender', 1);
				} else {
					this.clearGender();
				}
			}));
			this._genderArray[2].connect('clicked', Lang.bind(this, function(w){
			
				if (SETTINGS.get_int('gender') != 2) {
					this.clearGender();
					w.style = 'background-color: blue;';
					SETTINGS.set_int('gender', 2);
				} else {
					this.clearGender();
				}
			}));
		}
		this.update();
	},
	
	clearGender: function() {
		SETTINGS.set_int('gender', 0);
		this._genderArray.forEach(function(b) {
			b.style = 'background-color: black;';
		});
	},
	
	addBar: function(catActor) {
		this._genderArray.forEach(function(b) {
			catActor.add(b);
		});
		this._toneArray.forEach(function(b) {
			catActor.add(b);
		});
	},
	
	removeCircle: function() {
		this._toneArray.forEach(function(b) {
			b.style_class = 'UnselectedTone';
		});
	},
	
	update: function() {
		this.removeCircle();
		this._toneArray[SETTINGS.get_int('skin-tone')].style_class = 'SelectedTone';
		this._genderArray.forEach(function(b) {
			b.style = 'background-color: black;';
		});
		if (this._genderArray.length != 0) {
			this._genderArray[SETTINGS.get_int('gender')].style = 'background-color: blue;';
		}
	},
	
	buildToneButton: function(accessibleName, color) {
		return (new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			width: 20,
			accessible_name: accessibleName,
			style_class: 'UnselectedTone',
			style: 'background-color: ' + color + ';',
		}));
	},
});

//-------------------------------------------------

//class EmojiCategory
//methods :	_init()
//			...
//			destroy()
const EmojiCategory = new Lang.Class({
	Name:		'EmojiCategory',
	Extends:	PopupMenu.PopupSubMenuMenuItem,
	
	_init:		function(categoryName, iconName, id) {
		this.parent(categoryName);
		this.actor.visible = false;
		this.id = id;
		this.emojiButtons = [];
		this.actor.reactive = false;
		this._triangleBin.visible = false;
		
		// A bar is created for all categories to simplify the update method
		if ((this.id == 1) || (this.id == 5)) {
			this.skinTonesBar = new SkinTonesBar(true);
		} else {
			this.skinTonesBar = new SkinTonesBar(false);
		}
		
		//	Smileys & body		Peoples			Activities
		if ((this.id == 0) || (this.id == 1) || (this.id == 5)) {
			this.skinTonesBar.addBar(this.actor);
		}
		
		this.categoryButton = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			accessible_name: categoryName,
			style_class: 'system-menu-action',
		});
		this.categoryButton.child = new St.Icon({ icon_name: iconName });
		this.categoryButton.connect('clicked', Lang.bind(this, this._openCategory));
		
		this._built = false;
	},
	
	clear: function() {
		this.menu.removeAll();
		this.emojiButtons = [];
	},
	
	build: function() {
		let ln, container;
		for (var i = 0; i < EMOJIS_CHARACTERS[this.id].length; i++) {
			
			// management of lines of emojis
			if (i % NB_COLS === 0) {
				ln = new PopupMenu.PopupBaseMenuItem({
					style_class: 'EmojisList',
					reactive: false,
					can_focus: false,
				});
				ln.actor.track_hover = false;
				container = new St.BoxLayout();
				ln.actor.add(container, { expand: true });
				this.menu.addMenuItem(ln);
			}
			
			// creation of the clickable button
			let fontStyle = this.getStyle();
			let button = new St.Button({
				style_class: 'EmojisItemStyle',
				style: fontStyle,
				can_focus: true,
			});
			let CurrentEmoji = EMOJIS_CHARACTERS[this.id][i];
			button.label = CurrentEmoji;
			
			let tonable = false;
			let genrable = false;
			let gendered = false;
			
			for (var j = 0; j < EMOJIS_KEYWORDS[this.id][i].length; j++) {
				if (EMOJIS_KEYWORDS[this.id][i][j] == 'HAS_TONE') {
					tonable = true;
				} else if (EMOJIS_KEYWORDS[this.id][i][j] == 'HAS_GENDER') {
					genrable = true;
				} else if (EMOJIS_KEYWORDS[this.id][i][j] == 'IS_GENDERED') {
					gendered = true;
				}
			}
			
			button.connect('button-press-event', Lang.bind(
				this,
				genericOnButtonPress,
				[tonable, genrable, gendered],
				CurrentEmoji
			));
			
			this.emojiButtons.push(button);
			container.add_child(button);
		}
		this._built = true;
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
		
		if(!this._built) {
			this.build();
		}
		this.skinTonesBar.update();
		
		this.categoryButton.style = 'background-color: rgba(0,0,200,0.2);';
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
				let tags = [false, false, false]; //FIXME ??
				Clipboard.set_text(
					CLIPBOARD_TYPE,
					applyTags(tags, CurrentEmoji)
				);
				globalButton.menu.close();
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
			if (globalButton._activeCat == -1) {
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
				let cat = globalButton._activeCat;
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
		
		this.actor.visible = SETTINGS.get_boolean('always-show');
		
		//--------------------------------------------------
		
		//initializing categories
		this._createAllCategories();
		
		//initializing this._buttonMenu
		this._renderPanelMenuHeaderBox();
		
		//creating the search entry
		this.researchItem = new EmojiResearchItem();
		
		//initializing the "recently used" buttons	
		let RecentlyUsed = this._recentlyUsedInit();
		
		//-------------------------------------------------
		
		if (POSITION === 'top') {
			this.menu.addMenuItem(this._buttonMenu);
			this._permanentItems++;
			this.menu.addMenuItem(this.researchItem);
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
			
			this.menu.addMenuItem(this.researchItem);
			this._permanentItems++;
			
			this.menu.addMenuItem(this._buttonMenu);
			this._permanentItems++;
		}
		
		//-----------------------------------------------
		
		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
		this.menu.connect('open-state-changed', Lang.bind(this, function(self, open){
			this.actor.visible = open || SETTINGS.get_boolean('always-show');
			this.clearCategories();

			let a = Mainloop.timeout_add(20, Lang.bind(this, function() {
				if (open) {
					this.researchItem.searchEntry.set_text('');
					global.stage.set_key_focus(this.researchItem.searchEntry);
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
		this.emojiCategories[1] = new EmojiCategory(	_('Peoples & Clothing'),		'contact-new-symbolic',			1	);	
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
		
		this.backBtn = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			accessible_name: _("Back"),
			style_class: 'system-menu-action',
			style: 'background-color: rgba(200,0,0,0.2);',
		});
		this.backBtn.child = new St.Icon({
			icon_name: 'go-previous-symbolic',
		});
		
		this._buttonMenu = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false,
		});
		this._buttonMenu.actor.add_actor(this.backBtn);
		
		this.categoryButton = [];
		
		for (let i = 0; i< 9; i++) {
			this._buttonMenu.actor.add_actor(this.emojiCategories[i].getButton());
		}
		
		this.backBtn.connect('clicked', Lang.bind(this, this.clearCategories));
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
		this.researchItem._onSearchTextChanged();
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
	
	_recentlyUsedInit: function () {
		
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
			These buttons will not be destroy during research.
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
								text + applyTags(tags, CurrentEmoji)
							);
						});
						return Clutter.EVENT_STOP;
					} else if (ctrlPressed) {
						Clipboard.set_text(
							CLIPBOARD_TYPE,
							applyTags(tags, CurrentEmoji)
						);
						return Clutter.EVENT_STOP;
					} else {
						Clipboard.set_text(
							CLIPBOARD_TYPE,
							applyTags(tags, CurrentEmoji)
						);
						globalButton.menu.close();
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
		genericOnButtonPress(a, e, [false, false, false], recents[i].label);
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

let SETTINGS
function enable() {	
	SETTINGS = Convenience.getSettings();
	
	/* TODO paramètres restants à dynamiser
	emoji-keybinding (tableau de chaînes)
	nbcols (int)
	position (chaîne)
	*/
	
	NB_COLS = SETTINGS.get_int('nbcols');
	POSITION = SETTINGS.get_string('position');
	
	globalButton = new EmojisMenu();
//	about addToStatusArea :
//	- 0 is the position
//	- `right` is the box where we want our globalButton to be displayed (left/center/right)
	Main.panel.addToStatusArea('EmojisMenu', globalButton, 0, 'right');
	
	SETTINGS.connect('changed::emojisize', Lang.bind(this, function(){
		updateStyle();
	}));
	SETTINGS.connect('changed::light-theme', Lang.bind(this, function(){
		updateStyle();
	}));
	SETTINGS.connect('changed::use-keybinding', Lang.bind(this, function(z){
		if(z.get_boolean('use-keybinding')) {
			Main.wm.removeKeybinding('emoji-keybinding');
			globalButton._bindShortcut();
		} else {
			Main.wm.removeKeybinding('emoji-keybinding');
		}
	}));
	//TODO disconnect
}

//------------------------------------------------------------

function disable() {
	//we need to save labels currently in recents[] for the next session
	saveRecents();

	if(SETTINGS.get_boolean('use-keybinding')) {
		Main.wm.removeKeybinding('emoji-keybinding');
	}
	globalButton.destroy();
}
