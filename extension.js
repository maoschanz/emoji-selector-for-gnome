/* Import St because is the library that allow you to create UI elements */
const St = imports.gi.St;

/* Import Clutter because is the library that allow you to layout UI elements */
const Clutter = imports.gi.Clutter;

/*
Import Main because is the instance of the class that have all the UI elements
and we have to add to the Main instance our UI elements
*/
const Main = imports.ui.main;

/* Import PanelMenu and PopupMenu */
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

/* Import Lang because we will write code in a Object Oriented Manner */
const Lang = imports.lang;

//------------------------------------------------
/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/* Stuffs for settings, translations etc. */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;
const Convenience = Me.imports.convenience;

//------------------------------------------------

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

//----------------------------------------------

const Em = Me.imports.emojisCharacters;

//-----------------------------------------------

/* These global variables used to store some settings */
let nbRecents;
let nbCols;
let position;

//-----------------------------------------------

//class EmojiCategory
//methods :	_init(categoryName, emojiList)
//			destroy()
const EmojiCategory = new Lang.Class({
	Name:		'EmojiCategory',
	Extends:	PopupMenu.PopupSubMenuMenuItem,
	
	_init:		function(categoryName, emojiList) {
		this.parent(categoryName);

		let ln, container;

		for (var i = 0; i < emojiList.length; i++) {
			
			// management of lines of emojis
			if (i % nbCols === 0) {
				ln = new PopupMenu.PopupBaseMenuItem('');
				ln.actor.track_hover = false;
				container = new St.BoxLayout();
				ln.actor.add(container, { expand: true });
				this.menu.addMenuItem(ln);
			}
			
			// creation of the clickable button
			let button = new St.Button(
				{ style_class: 'EmojisItemStyle' }
			);
			let CurrentEmoji = emojiList[i];
			button.label = CurrentEmoji;
			
			//connection of the button
			button.connect('clicked', Lang.bind(this, function(){
				/* setting the emoji in the clipboard */
				Clipboard.set_text(CLIPBOARD_TYPE, CurrentEmoji);
				
				/* shifting recent emojis */
				for(var j = nbRecents-1;j > 0;j--){
					recents[j].label = recents[j-1].label;
				}
				recents[0].label = CurrentEmoji;
				
			}));
			container.add_child(button, {hover: true});
		}
	},

	destroy: function() {
        this.parent();
    }
});

//------------------------------------------------

//class EmojiMenu
//methods :	_init()
//			_recentlyUsedInit (returns a PopupMenu.PopupBaseMenuItem)
//			destroy
const EmojisMenu = new Lang.Class({
    Name:		'EmojisMenu',		// Class Name
    Extends:	PanelMenu.Button,	// Parent Class

    // Constructor
    _init: function() {
		
        this.parent(0.0, 'EmojisMenu');

        let box = new St.BoxLayout();
        
        let icon =  new St.Icon({ icon_name: 'face-cool-symbolic', style_class: 'system-status-icon emotes-icon'});

        let toplabel = new St.Label({
			y_align: Clutter.ActorAlign.CENTER
		});

		box.add(icon);
        box.add(toplabel);
		box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.actor.add_child(box);
        
		//-------------------------------------------------
		
		/* creating new categories with emojis loaded in Em */
		let SmileysPeople = new EmojiCategory(	_('Smileys & People'),		Em.SMILEYSANDPEOPLE	);
		let Nature = new EmojiCategory(			_('Nature'),				Em.NATURE			);	
		let FoodDrink = new EmojiCategory(		_('Food & Drink'), 			Em.FOODANDDRINK		);
		let ActivitySports = new EmojiCategory(	_('Activities & Sports'), 	Em.ACTIVITIESANDSPORTS	);
		let TravelPlaces = new EmojiCategory(	_('Travel & Places'), 		Em.TRAVELANDPLACES	);
		let Objects = new EmojiCategory( 		_('Objects'),				Em.OBJECTS			);
		let Symbols = new EmojiCategory(		_('Symbols'),				Em.SYMBOLS			);
		let Flags = new EmojiCategory(			_('Flags'),					Em.FLAGS			);
		
		//initializing the "recently used" buttons	
		let RecentlyUsed = this._recentlyUsedInit();
		
		//--------------------------------------------------
		
		if (position === 'top') {
			this.menu.addMenuItem(RecentlyUsed);
		}
		
		// add categories' submenus
		this.menu.addMenuItem(SmileysPeople);
		this.menu.addMenuItem(Nature);
		this.menu.addMenuItem(FoodDrink);
		this.menu.addMenuItem(ActivitySports);
		this.menu.addMenuItem(TravelPlaces);
		this.menu.addMenuItem(Objects);
		this.menu.addMenuItem(Symbols);
		this.menu.addMenuItem(Flags);
		
		if (position === 'bottom') {
			this.menu.addMenuItem(RecentlyUsed);
		}
		
		//--------------------------------------------------

		// this sets the default behavior of each submenu : false means it is close when the extension's menu opens
    	this.menu.connect('open-state-changed', Lang.bind(this, function(){
			SmileysPeople.setSubmenuShown(false);
			Nature.setSubmenuShown(false);
			FoodDrink.setSubmenuShown(false);
			ActivitySports.setSubmenuShown(false);
			TravelPlaces.setSubmenuShown(false);
			Objects.setSubmenuShown(false);
			Symbols.setSubmenuShown(false);
			Flags.setSubmenuShown(false);
		}));
		// end of _init
    },
	
	_recentlyUsedInit: function () {
		
		let RecentlyUsed = new PopupMenu.PopupBaseMenuItem('');
		recents = [];
		
		for(var i = 0;i<nbRecents;i++){
			recents[i] = new St.Button({ style_class: 'RecentItemStyle' });
		}
		
		let container = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(container, { expand: true });
		
		//I didn't know where to store "recently used emojis" from previous
		//session, so I put it in a setting key where it is store as a string.
		//The format of the string is 'X,X,X,X,X,' where Xs are emojis.
		//So, temp is an array of strings like ['X','X','X','X','X',''] where
		//the last item is empty.
		var temp = Convenience.getSettings().get_string('recents').split(',');
		
		for(var i = 0;i<nbRecents;i++){
			if (i < temp.length - 1) {
				//length - 1 because of the empty last item
				recents[i].label = temp[i];
			} else {
				//If the extension was previously set with less "recently used emojis",
				//we still need to load something in the labels.
				//It will be a penguin for obvious reasons.
				recents[i].label = '🐧';
			}
		}
		
		for(var i = 0;i<nbRecents;i++){
			recents[i].connect('clicked', Lang.bind(this, function(){
				Clipboard.set_text(CLIPBOARD_TYPE, recents[arguments[2]].label);
			}, i));
		}
		
		for(var i = 0;i<nbRecents;i++){
			container.add_child(recents[i], {hover: true});
		}
		
		return RecentlyUsed;
		//end of _recentlyUsedInit
	},
	
    destroy: function() {
        this.parent();
    }
});

//------------------------------------------------------------

/* Global variable : button to click in the topbar */
let button;

/* this array will stock some St.Button-s */
let recents = [];

//------------------------------------------------------------

function init() {
	Convenience.initTranslations("emoji-selector");
}

//------------------------------------------------------------

function enable() {	
	let _settings = Convenience.getSettings();
	_settings = Convenience.getSettings('org.gnome.shell.extensions.emoji-selector');
	
	nbRecents = _settings.get_int('nbrecents');
	nbCols = _settings.get_int('nbcols');
	position = _settings.get_string('position');
    
	button = new EmojisMenu();
//	about addToStatusArea :
//	- 0 is the position
//	- `right` is the box where we want our button to be displayed (left/center/right)
	Main.panel.addToStatusArea('EmojisMenu', button, 0, 'right');
}

//------------------------------------------------------------

function disable() {
	//we need to save labels currently in recents[] for the next session
	var backUp = '';
	for(var i = 0;i<nbRecents;i++){
		backUp = backUp + recents[i].label + ',';
	}
	Convenience.getSettings().set_string('recents', backUp);
	
	button.destroy();
}
