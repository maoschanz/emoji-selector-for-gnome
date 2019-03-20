//this file is part of https://github.com/maoschanz/emoji-selector-for-gnome

const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const SkinTonesBar = Me.imports.emojiOptionsBar.SkinTonesBar;
const Extension = Me.imports.extension;
const EmojiButton = Me.imports.emojiButton;

//class EmojiCategory
//methods :
//	constructor(string, string, int)	init the button & the submenu's menu-item (label, tone/gender)
//	clear()								remove all emojis from the category
//	build()								build category's rows and buttons in it
//	_toggle()							do everything needed when the user click on the category's button
//	_openCategory()						open the category
//	getButton()							not useful getter
class EmojiCategory {
	constructor(categoryName, iconName, id) {
		this.super_item = new PopupMenu.PopupSubMenuMenuItem(categoryName);
		this.categoryName = categoryName;
		this.id = id;

		this.super_item.actor.visible = false;
		this.super_item.actor.reactive = false;
		this.super_item._triangleBin.visible = false;

		this.emojiButtons = []; // used only for updating the size/style

		// A single widget is created for all categories to simplify the update method
		if ((this.id == 1) || (this.id == 5)) {
			this.skinTonesBar = new SkinTonesBar(true);
		} else {
			this.skinTonesBar = new SkinTonesBar(false);
		}

		//	Smileys & body		Peoples			Activities
		if ((this.id == 0) || (this.id == 1) || (this.id == 5)) {
			this.skinTonesBar.addBar(this.super_item.actor);
		}

		this.categoryButton = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			accessible_name: categoryName,
			style_class: 'system-menu-action',
			child: new St.Icon({ icon_name: iconName }),
		});
		this.categoryButton.connect('clicked', this._toggle.bind(this));
		this.categoryButton.connect('notify::hover', this._onHover.bind(this));

		this._built = false; // will be true once loaded
	}

	clear() {
		this.super_item.menu.removeAll();
		this.emojiButtons = [];
	}

	build() { // load the category XXX
		let ln, container;
		for (let i = 0; i < Extension.EMOJIS_CHARACTERS[this.id].length; i++) {
			// lines of emojis
			if (i % Extension.NB_COLS === 0) {
				ln = new PopupMenu.PopupBaseMenuItem({
					style_class: 'EmojisList',
					reactive: false,
					can_focus: false,
				});
				ln.actor.track_hover = false;
				container = new St.BoxLayout();
				ln.actor.add(container, { expand: true });
				this.super_item.menu.addMenuItem(ln);
			}

			let button = new EmojiButton.EmojiButton(Extension.EMOJIS_CHARACTERS[this.id][i],
			                       this, Extension.EMOJIS_KEYWORDS[this.id][i]);
			this.emojiButtons.push(button);
			container.add_child(button.super_btn);
		}
		this._built = true;
	}

	_toggle() {
		if (this.super_item._getOpenState()) {
			Extension.GLOBAL_BUTTON.clearCategories();
		} else {
			this._openCategory();
		}
	}

	_onHover(a, b) {
		if (a.hover) {
			this.categoryButton.style = 'background-color: rgba(200, 200, 200, 0.2);';
		} else if (this.super_item._getOpenState()) {
			this.categoryButton.style = 'background-color: rgba(0, 0, 100, 0.2);';
		} else {
			this.categoryButton.style = '';
		}
	}

	_openCategory() {
		Extension.GLOBAL_BUTTON.clearCategories();
		this.super_item.label.text = this.categoryName;

		if(!this._built) {
			this.build();
		}
		this.skinTonesBar.update();

		this.categoryButton.style = 'background-color: rgba(0, 0, 200, 0.2);';
		this.super_item.actor.visible = true;
		this.super_item.setSubmenuShown(true);
		Extension.GLOBAL_BUTTON._activeCat = this.id;
		Extension.GLOBAL_BUTTON._onSearchTextChanged();
	}

	getButton() {
		return this.categoryButton;
	}
}

