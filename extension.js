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

const EmojiCategory = new Lang.Class({
	Name:		'EmojiCategory',
	Extends:	PopupMenu.PopupSubMenuMenuItem,
	
	_init:		function(categoryName, emojiList) {
		this.parent(categoryName);

		let ln, container;
		
		for (var i = 0; i < emojiList.length; i++) {
			
			// management of lines of emojis
			if (i % 15 === 0) {
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
				recent7.label = recent6.label;
				recent6.label = recent5.label;
				recent5.label = recent4.label;
				recent4.label = recent3.label;
				recent3.label = recent2.label;
				recent2.label = recent1.label;
				recent1.label = CurrentEmoji;
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
    _init: function() {

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
		
		let SmileysPeople = new EmojiCategory(	_('Smileys & People'),		Em.SMILEYSANDPEOPLE		);
		let Nature = new EmojiCategory(			_('Nature'),				Em.NATURE				);	
		let FoodDrink = new EmojiCategory(		_('Food & Drink'), 			Em.FOODANDDRINK			);
		let ActivitySports = new EmojiCategory(	_('Activities & Sports'), 	Em.ACTIVITIESANDSPORTS	);
		let TravelPlaces = new EmojiCategory(	_('Travel & Places'), 		Em.TRAVELANDPLACES		);
		let Objects = new EmojiCategory( 		_('Objects'),				Em.OBJECTS				);
		let Symbols = new EmojiCategory(		_('Symbols'),				Em.SYMBOLS				);
		let Flags = new EmojiCategory(			_('Flags'),					Em.FLAGS				);		
		
		//--------------------------------------------------
		
		/* we initialize the "recently used" buttons */
		
		this._recentlyUsedInit();
		
		this.menu.addMenuItem(RecentlyUsed);

		//--------------------------------------------------
		
		/*we add categories' submenus*/
		
		this.menu.addMenuItem(SmileysPeople);
		this.menu.addMenuItem(Nature);
		this.menu.addMenuItem(FoodDrink);
		this.menu.addMenuItem(ActivitySports);
		this.menu.addMenuItem(TravelPlaces);
		this.menu.addMenuItem(Objects);
		this.menu.addMenuItem(Symbols);
		this.menu.addMenuItem(Flags);
		
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
		let conteneur = new St.BoxLayout();
	
		RecentlyUsed.actor.track_hover = false;
		RecentlyUsed.actor.add(conteneur, { expand: true });
		
		recent1.label = '😍';
		recent2.label = '👌';
		recent3.label = '🤔';
		recent4.label = '😭';
		recent5.label = '😱';
		recent6.label = '😩';
		recent7.label = '😂';
		
		recent1.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent1.label );
		}));
		recent2.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent2.label );
		}));
		recent3.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent3.label );
		}));
		recent4.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent3.label );
		}));
		recent5.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent3.label );
		}));
		recent6.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent3.label );
		}));
		recent7.connect('clicked', Lang.bind(this, function(){
			Clipboard.set_text(CLIPBOARD_TYPE, recent3.label );
		}));
		
		conteneur.add_child(recent1, {hover: true});
		conteneur.add_child(recent2, {hover: true});
		conteneur.add_child(recent3, {hover: true});
		conteneur.add_child(recent4, {hover: true});
		conteneur.add_child(recent5, {hover: true});
		conteneur.add_child(recent6, {hover: true});
		conteneur.add_child(recent7, {hover: true});
	},
	
    destroy: function() {
        this.parent();
    }
});

//------------------------------------------------------------

/* Global variables for use as button to click */
let button;

/* Recently used emoji will be displayed by those buttons, who work better if they are global variables */
let RecentlyUsed = new PopupMenu.PopupBaseMenuItem('');
let recent1 = new St.Button({ style_class: 'RecentItemStyle' });
let recent2 = new St.Button({ style_class: 'RecentItemStyle' });
let recent3 = new St.Button({ style_class: 'RecentItemStyle' });
let recent4 = new St.Button({ style_class: 'RecentItemStyle' });
let recent5 = new St.Button({ style_class: 'RecentItemStyle' });
let recent6 = new St.Button({ style_class: 'RecentItemStyle' });
let recent7 = new St.Button({ style_class: 'RecentItemStyle' });

//------------------------------------------------------------

function init() {
	Convenience.initTranslations("emoji-selector");
}

//------------------------------------------------------------

function enable() {
	
	button = new EmojisMenu;
    /* in addToStatusArea :
    - 0 is the position
    - `right` is the box where we want our button to be displayed (left/center/right)
     */
	Main.panel.addToStatusArea('EmojisMenu', button, 0, 'right');
}

//------------------------------------------------------------

function disable() {
	button.destroy();
	
	RecentlyUsed.destroy();
	recent1.destroy();
	recent2.destroy();
	recent3.destroy();
	recent4.destroy();
	recent5.destroy();
	recent6.destroy();
	recent7.destroy();
}


