// this file is part of https://github.com/maoschanz/emoji-selector-for-gnome

const St = imports.gi.St;

const PopupMenu = imports.ui.popupMenu;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Extension = Me.imports.extension;
const EmojiButton = Me.imports.emojiButton.EmojiButton;

/* Translations */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

//------------------------------------------------------------------------------

/**
 * A wrapper around a menu item, with a search entry added to it, and a second
 * menu item with a list of buttons for recently used emojis.
 */
var EmojiSearchItem = class EmojiSearchItem {

	constructor(nbColumns) {
		this.super_item = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false
		});

		this._nbColumns = nbColumns;

		this.searchEntry = new St.Entry({
			name: 'searchEntry',
			style_class: 'search-entry',
			can_focus: true,
			hint_text: _("Type here to search…"),
			track_hover: true,
			x_expand: true,
		});

		this.searchEntry.get_clutter_text().connect(
			'text-changed',
			this._onSearchTextChanged.bind(this)
		);

		this.searchEntry.clutter_text.connect('key-press-event', (o, e) => {
			this._recents[0].onKeyPress(o, e);
		});

		this.super_item.actor.add_child(this.searchEntry);

		// initializing the "recently used" buttons
		this.recentlyUsedItem = this._recentlyUsedInit();
	}

	////////////////////////////////////////////////////////////////////////////

	// Updates the "recently used" buttons content in reaction to a new search
	// query (the text changed or the category changed).
	_onSearchTextChanged() {
		let searchedText = this.searchEntry.get_text();
		if (searchedText === '') {
			this._buildRecents();
			this._updateSensitivity();
			return;
		} // else { ...
		searchedText = searchedText.toLowerCase();

		for (let j = 0; j < this._nbColumns; j++) {
			this._recents[j].super_btn.label = '';
		}

		let minCat = 0;
		let maxCat = Extension.GLOBAL_BUTTON.emojiCategories.length;
		let activeCat = Extension.GLOBAL_BUTTON._activeCat
		if (activeCat != -1) {
			minCat = activeCat;
			maxCat = activeCat + 1;
		}

		let results = [];
		// First, search for an exact match with emoji names
		results = this._getResults(searchedText, minCat, maxCat, results, 3);
		// Then, search only across emoji names
		results = this._getResults(searchedText, minCat, maxCat, results, 2);
		// Finally, search across all keywords
		results = this._getResults(searchedText, minCat, maxCat, results, 1);

		let firstEmptyIndex = 0;
		for (let i = 0; i < results.length; i++) {
			if (i < this._nbColumns) {
				this._recents[firstEmptyIndex].super_btn.label = results[i];
				firstEmptyIndex++;
			}
		}
		this._updateSensitivity();
	}

	_updateSensitivity() {
		for (let i = 0; i < this._recents.length; i++) {
			let can_focus = this._recents[i].super_btn.label != "";
			this._recents[i].super_btn.set_can_focus(can_focus);
			this._recents[i].super_btn.set_track_hover(can_focus);
		}
	}

	// Search results are queried in several steps, from more important criteria
	// to very general string matching.
	_getResults(searchedText, minCat, maxCat, results, priority) {
		for (let cat = minCat; cat < maxCat; cat++) {
			let availableSlots = this._recents.length - results.length;
			if (availableSlots > 0) {
				let emojiCategory = Extension.GLOBAL_BUTTON.emojiCategories[cat];
				let catResults = emojiCategory.searchEmoji(
					searchedText, availableSlots, priority
				);
				results = results.concat(catResults);
			}
		}
		return results;
	}

	////////////////////////////////////////////////////////////////////////////

	// Initializes the container showing the recently used emojis as buttons
	_recentlyUsedInit() {
		let recentlyUsed = new PopupMenu.PopupBaseMenuItem({
			reactive: false,
			can_focus: false,
		});
		let container = new St.BoxLayout();
		recentlyUsed.actor.add_child(container);
		this._recents = [];

		for(let i = 0; i < this._nbColumns; i++) {
			this._recents[i] = new EmojiButton('', []);
			this._recents[i].build(null);
			container.add_child(this._recents[i].super_btn);
		}

		this._buildRecents();
		return recentlyUsed;
	}

	saveRecents() {
		let backUp = [];
		for(let i = 0; i < this._nbColumns; i++) {
			backUp.push(this._recents[i].super_btn.label);
		}
		Extension.SETTINGS.set_strv('recently-used', backUp);
	}

	_buildRecents() {
		let temp = Extension.SETTINGS.get_strv('recently-used')
		for(let i = 0; i < this._nbColumns; i++) {
			if (i < temp.length) {
				this._recents[i].super_btn.label = temp[i];
			} else {
				// If the extension was previously set with less "recently used
				// emojis", we still need to load something in the labels.
				// It will be a penguin for obvious reasons.
				this._recents[i].super_btn.label = '🐧';
			}
		}
	}

	updateStyleRecents() {
		this._recents.forEach(function(b) {
			b.updateStyle();
		});
	}

	shiftFor(currentEmoji) {
		if (currentEmoji == '') { return; }
		let temp = Extension.SETTINGS.get_strv('recently-used');
		for(let i = 0; i < temp.length; i++) {
			if (temp[i] == currentEmoji) {
				temp.splice(i, 1);
			}
		}
		for(let j = temp.length; j > 0; j--) {
			temp[j] = temp[j-1];
		}
		temp[0] = currentEmoji;
		Extension.SETTINGS.set_strv('recently-used', temp);
		this._buildRecents();
		this.saveRecents();
		Extension.GLOBAL_BUTTON._onSearchTextChanged();
	}
}

//------------------------------------------------------------------------------

