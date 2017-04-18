/* Import St because is the library that allow you to create UI elements */
const St = imports.gi.St;

/* Import Clutter because is the library that allow you to layout UI elements */
const Clutter = imports.gi.Clutter;

/*
Import Main because is the instance of the class that have all the UI elements
and we have to add to the Main instance our UI elements
*/
const Main = imports.ui.main;

/*
Import PanelMenu and PopupMenu 
See more info about these objects in REFERENCE.md
*/
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

/*
Import Lang because we will write code in a Object Oriented Manner
*/
const Lang = imports.lang;

//------------------------------------------------
/*
get the current extension, mainly because we need to access other files
*/
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

/*
setting stuffs for translations etc.
*/
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;
const Convenience = Me.imports.convenience;

//------------------------------------------------

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

//----------------------------------------------

const Em = Me.imports.emojisCharacters;

//-----------------------------------------------

let nbRecents = 12;
let nbCols = 15;

//-----------------------------------------------

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

const EmojisMenu = new Lang.Class({
    Name:		'EmojisMenu',		// Class Name
    Extends:	PanelMenu.Button,	// Parent Class

    // Constructor
    _init: function(position) {
		
        this.parent(0.0, 'EmojisMenu');//, false);

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
		let Nature = new EmojiCategory(		_('Nature'),			Em.NATURE		);	
		let FoodDrink = new EmojiCategory(	_('Food & Drink'), 		Em.FOODANDDRINK		);
		let ActivitySports = new EmojiCategory(	_('Activities & Sports'), 	Em.ACTIVITIESANDSPORTS	);
		let TravelPlaces = new EmojiCategory(	_('Travel & Places'), 		Em.TRAVELANDPLACES	);
		let Objects = new EmojiCategory( 	_('Objects'),			Em.OBJECTS		);
		let Symbols = new EmojiCategory(	_('Symbols'),			Em.SYMBOLS		);
		let Flags = new EmojiCategory(		_('Flags'),			Em.FLAGS		);		
		
		//--------------------------------------------------
		
		/* we initialize the "recently used" buttons */
		
		let RecentlyUsed = this._recentlyUsedInit();
		
		//--------------------------------------------------
		
		if (position === 'top') {
			this.menu.addMenuItem(RecentlyUsed);
		}
		
		/*we add categories' submenus*/
		
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

		/* default behavior of submenu : false means it stays close when the extension's menu is opened */
		
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
		//here are set the 7 default "recently used emojis", in a pretty unprofessionnal way
		
		let RecentlyUsed = new PopupMenu.PopupBaseMenuItem('');
		recents = [];
		
		for(var i = 0;i<nbRecents;i++){
			recents[i] = new St.Button({ style_class: 'RecentItemStyle' });
		}
		
		let conteneur = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(conteneur, { expand: true });
		
		for(var i = 0;i<nbRecents;i++){
			recents[i].label = '🤔';
		}
		
		for(var i = 0;i<nbRecents;i++){
			recents[i].connect('clicked', Lang.bind(this, function(){
				Clipboard.set_text(CLIPBOARD_TYPE, recents[arguments[2]].label);
			}, i));
		}
		
		for(var i = 0;i<nbRecents;i++){
			conteneur.add_child(recents[i], {hover: true});
		}
		
		return RecentlyUsed;
	},
	
    destroy: function() {
        this.parent();
    }
});

//------------------------------------------------------------

/* Global variables for use as button to click */
let button;

let recents = [];

//------------------------------------------------------------

function init() {
	Convenience.initTranslations("emoji-selector");
}

//------------------------------------------------------------

function enable() {	
	let settings = Convenience.getSettings();
	settings = Convenience.getSettings('org.gnome.shell.extensions.emoji-selector');
	
	nbRecents = settings.get_int('nbrecents');
	nbCols = settings.get_int('nbcols');
	let pos = settings.get_string('position');
    
	button = new EmojisMenu(pos);
    /* in addToStatusArea :
    - 0 is the position
    - `right` is the box where we want our button to be displayed (left/center/right)
     */   
	Main.panel.addToStatusArea('EmojisMenu', button, 0, 'right');
}

//------------------------------------------------------------

function disable() {
	button.destroy();
}


