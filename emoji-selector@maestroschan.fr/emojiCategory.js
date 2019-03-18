const St = imports.gi.St;
const Lang = imports.lang;

const PopupMenu = imports.ui.popupMenu;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const SkinTonesBar = Me.imports.emojiOptionsBar.SkinTonesBar;
const Extension = Me.imports.extension;
const EmojiButton = Me.imports.emojiButton;

//class EmojiCategory
//methods :
//	_init(string, string, int)	init the button & the submenu's menu-item (label, tone/gender)
//	clear()						remove all emojis from the category
//	build()						build category's rows and buttons in it
//	_toggle()					do everything needed when the user click on the category's button
//	_openCategory()				open the category
//	getButton()					not useful getter
//	destroy()					//TODO
const EmojiCategory = new Lang.Class({
	Name:		'EmojiCategory',
	Extends:	PopupMenu.PopupSubMenuMenuItem,
	
	_init:		function(categoryName, iconName, id) {
		this.parent(categoryName);
		this.categoryName = categoryName;
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
		this.categoryButton.connect('clicked', Lang.bind(this, this._toggle));
		
		this._built = false;
	},
	
	clear: function() {
		this.menu.removeAll();
		this.emojiButtons = [];
	},
	
	build: function() {
		let ln, container;
		for (var i = 0; i < Extension.EMOJIS_CHARACTERS[this.id].length; i++) {
			
			// management of lines of emojis
			if (i % Extension.NB_COLS === 0) {
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
			
			let button = new EmojiButton.EmojiButton(
										Extension.EMOJIS_CHARACTERS[this.id][i],
										this,
										Extension.EMOJIS_KEYWORDS[this.id][i]);
			this.emojiButtons.push(button);
			container.add_child(button);
		}
		this._built = true;
	},
	
	_toggle: function() {
		if (this._getOpenState()) {
			Extension.GLOBAL_BUTTON.clearCategories();
		} else {
			this._openCategory();
		}
	},
	
	_openCategory: function() {
		Extension.GLOBAL_BUTTON.clearCategories();
		this.label.text = this.categoryName;
		
		if(!this._built) {
			this.build();
		}
		this.skinTonesBar.update();
		
		this.categoryButton.style = 'background-color: rgba(0,0,200,0.2);';
		this.actor.visible = true;		
		this.setSubmenuShown(true);
		Extension.GLOBAL_BUTTON._activeCat = this.id;
		Extension.GLOBAL_BUTTON._onSearchTextChanged();
	},
	
	getButton: function() {
		return this.categoryButton;
	},
	
	destroy: function() {
		this.parent();
	}
});
