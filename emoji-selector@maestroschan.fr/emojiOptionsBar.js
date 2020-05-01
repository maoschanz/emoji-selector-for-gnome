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

//class SkinTonesBar TODO update comments
//methods :
//	_init()							build the UI
//	clearGender()					reset the gender
//	addBar(actor)					add all SkinTonesBar's buttons to `actor`
//	removeCircle()					reset the visual indication of the selected skin tone
//	update()						u
//	_buildToneButton(name, color)	build a button for a specific skin tone
var SkinTonesBar = class SkinTonesBar {
	constructor(hasGender) {
		this._toneArray = [];

		this._toneArray[0] = this._buildToneButton(	_("No skin tone")			, '#FFEE00'	);
		this._toneArray[1] = this._buildToneButton(	_("Light skin tone")		, '#FFD8A8'	);
		this._toneArray[2] = this._buildToneButton(	_("Medium light skin tone")	, '#E5B590'	);
		this._toneArray[3] = this._buildToneButton(	_("Medium skin tone")		, '#B88750'	);
		this._toneArray[4] = this._buildToneButton(	_("Medium dark skin tone")	, '#9B6020'	);
		this._toneArray[5] = this._buildToneButton(	_("Dark skin tone")			, '#4B2000'	);

		this._toneArray[0].connect('clicked', this._updateToneBtn.bind(this, 0));
		this._toneArray[1].connect('clicked', this._updateToneBtn.bind(this, 1));
		this._toneArray[2].connect('clicked', this._updateToneBtn.bind(this, 2));
		this._toneArray[3].connect('clicked', this._updateToneBtn.bind(this, 3));
		this._toneArray[4].connect('clicked', this._updateToneBtn.bind(this, 4));
		this._toneArray[5].connect('clicked', this._updateToneBtn.bind(this, 5));

		this._genderArray = [];
		if(hasGender) {
			this._buildGendersButtons()
		}
		this.update();
	}

	// Build the buttons for the 3 genders: men, women, and dummy button.
	// Actually the dummy button is a totally stupid hack that should be deleted
	// TODO change the update() method to allow this deletion
	_buildGendersButtons() {
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
			label: "♀",
		});
		this._genderArray[2] = new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			width: 20,
			accessible_name: _("Women"),
			style: 'background-color: black;',
			label: "♂",
		});

		this._genderArray[1].connect('clicked', w => { // TODO refacto callback
			if (Extension.SETTINGS.get_int('gender') != 1) {
				this.clearGender();
				w.style = 'background-color: blue;';
				Extension.SETTINGS.set_int('gender', 1);
			} else {
				this.clearGender();
			}
		});
		this._genderArray[2].connect('clicked', w => { // TODO refacto callback
			if (Extension.SETTINGS.get_int('gender') != 2) {
				this.clearGender();
				w.style = 'background-color: blue;';
				Extension.SETTINGS.set_int('gender', 2);
			} else {
				this.clearGender();
			}
		});
	}

	// Signal callback when the user clicks on a tone button
	_updateToneBtn(intToSet, btn) {
		this.removeCircle();
		btn.style_class = 'SelectedTone';
		Extension.SETTINGS.set_int('skin-tone', intToSet);
	}

	// Reset the gender to the state where none is selected
	clearGender() {
		Extension.SETTINGS.set_int('gender', 0);
		this._genderArray.forEach(function(b) {
			// TODO use actual toggle-buttons
			b.style = 'background-color: black;';
		});
	}

	addBar(categoryItemActor) {
		this._genderArray.forEach(function(b) {
			categoryItemActor.add(b);
		});
		this._toneArray.forEach(function(b) {
			categoryItemActor.add(b);
		});
	}

	removeCircle() {
		this._toneArray.forEach(function(b) {
			b.style_class = 'UnselectedTone';
		});
	}

	// Update buttons appearance, reflecting the current state of the settings
	update() {
		this.removeCircle();
		this._toneArray[Extension.SETTINGS.get_int('skin-tone')].style_class = 'SelectedTone';
		this._genderArray.forEach(function(b) {
			// TODO use actual toggle-buttons
			b.style = 'background-color: black;';
		});
		if (this._genderArray.length != 0) {
			this._genderArray[Extension.SETTINGS.get_int('gender')].style = 'background-color: blue;';
		}
	}

	// Build a button for a specific skin tone
	_buildToneButton(accessibleName, color) {
		// TODO use actual toggle-buttons
		// TODO connect them here
		return (new St.Button({
			reactive: true,
			can_focus: true,
			track_hover: true,
			width: 20,
			accessible_name: accessibleName,
			style_class: 'UnselectedTone',
			style: 'background-color: ' + color + ';',
		}));
	}
}

