//this file is part of https://github.com/maoschanz/emoji-selector-for-gnome

const St = imports.gi.St;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Extension = Me.imports.extension;

/* Stuffs for translations etc. */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

////////////////////////////////////////////////////////////////////////////////

var SkinTonesBar = class SkinTonesBar {
	constructor(hasGender) {
		this._toneArray = [];

		this._buildToneButton(	_("No skin tone")			, '#FFEE00'	);
		this._buildToneButton(	_("Light skin tone")		, '#FFD8A8'	);
		this._buildToneButton(	_("Medium light skin tone")	, '#E5B590'	);
		this._buildToneButton(	_("Medium skin tone")		, '#B88750'	);
		this._buildToneButton(	_("Medium dark skin tone")	, '#9B6020'	);
		this._buildToneButton(	_("Dark skin tone")			, '#4B2000'	);

		this._genderArray = [];
		if(hasGender) {
			this._buildGendersButtons()
		}
		this.update();
	}

	// Build the buttons for the 3 genders: null, men, women. Actually, null is
	// here just for consistency with how the data is represented in the
	// gsettings database, where 0 means no gender variation.
	_buildGendersButtons() {
		this._genderArray[0] = null;
		this._addGenderButton(1, _("Women"), "♀");
		this._addGenderButton(2, _("Men"), "♂");
	}

	_addGenderButton(intId, accessibleName, labelChar) {
		let btn = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			toggle_mode: true,
			accessible_name: accessibleName,
			style_class: 'EmojisGender',
			label: labelChar,
		});
		btn.connect('clicked', w => {
			if (Extension.SETTINGS.get_int('gender') != intId) {
				this._setGender(intId);
			} else {
				this._setGender(0);
			}
		});
		this._genderArray.push(btn);
	}

	// Signal callback when the user clicks on a tone button
	_updateToneBtn(intToSet, btn) {
		this.removeCircle();
		btn.set_checked(true);
		Extension.SETTINGS.set_int('skin-tone', intToSet);
	}

	_setGender(intToSet) {
		Extension.SETTINGS.set_int('gender', intToSet);
		this._genderArray[1].set_checked(intToSet == 1);
		this._genderArray[2].set_checked(intToSet == 2);
	}

	addBar(categoryItemActor) {
		this._genderArray.forEach(function(b) {
			if (b) { // index 0 contains null
				categoryItemActor.add_child(b);
			}
		});
		this._toneArray.forEach(function(b) {
			categoryItemActor.add_child(b);
		});
	}

	removeCircle() {
		this._toneArray.forEach(function(b) {
			b.set_checked(false);
		});
	}

	// Update buttons appearance, reflecting the current state of the settings
	update() {
		this.removeCircle();
		this._toneArray[Extension.SETTINGS.get_int('skin-tone')].set_checked(true);
		this._genderArray.forEach(function(b) {
			if (b) { // index 0 contains null
				b.set_checked(false);
			}
		});
		if (this._genderArray.length != 0) {
			let intId = Extension.SETTINGS.get_int('gender');
			if (intId > 0) {
				this._genderArray[intId].set_checked(true);
			}
		}
	}

	// Build a button for a specific skin tone
	_buildToneButton(accessibleName, color) {
		let btn = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			toggle_mode: true,
			accessible_name: accessibleName,
			style_class: 'EmojisTone',
			style: 'background-color: ' + color + ';',
		});

		let intId = this._toneArray.length;
		btn.connect('clicked', this._updateToneBtn.bind(this, intId));
		this._toneArray.push(btn);
	}
}

////////////////////////////////////////////////////////////////////////////////

