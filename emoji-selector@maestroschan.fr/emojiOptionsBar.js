const St = imports.gi.St;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Extension = Me.imports.extension;

/* Stuffs for translations etc. */
const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

//class SkinTonesBar
//methods :
//	_init()							build the UI
//	clearGender()					reset the gender
//	addBar(actor)					add all SkinTonesBar's buttons to `actor`
//	removeCircle()					reset the visual indication of the selected skin tone
//	update()						update buttons appearance, reflecting the actual settings
//	buildToneButton(name, color)	build a button for a specific skin tone
class SkinTonesBar {
	constructor(hasGender) {
		this._toneArray = [];

		this._toneArray[0] = this.buildToneButton(	_("No skin tone")			, '#FFEE00'	);
		this._toneArray[1] = this.buildToneButton(	_("Light skin tone")		, '#FFD8A8'	);
		this._toneArray[2] = this.buildToneButton(	_("Medium light skin tone")	, '#E5B590'	);
		this._toneArray[3] = this.buildToneButton(	_("Medium skin tone")		, '#B88750'	);
		this._toneArray[4] = this.buildToneButton(	_("Medium dark skin tone")	, '#9B6020'	);
		this._toneArray[5] = this.buildToneButton(	_("Dark skin tone")			, '#4B2000'	);

		this._toneArray[0].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 0);
		});
		this._toneArray[1].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 1);
		});
		this._toneArray[2].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 2);
		});
		this._toneArray[3].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 3);
		});
		this._toneArray[4].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 4);
		});
		this._toneArray[5].connect('clicked', w => {
			this.removeCircle();
			w.style_class = 'SelectedTone';
			Extension.SETTINGS.set_int('skin-tone', 5);
		});

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

			this._genderArray[1].connect('clicked', w => {

				if (Extension.SETTINGS.get_int('gender') != 1) {
					this.clearGender();
					w.style = 'background-color: blue;';
					Extension.SETTINGS.set_int('gender', 1);
				} else {
					this.clearGender();
				}
			});
			this._genderArray[2].connect('clicked', w => {

				if (Extension.SETTINGS.get_int('gender') != 2) {
					this.clearGender();
					w.style = 'background-color: blue;';
					Extension.SETTINGS.set_int('gender', 2);
				} else {
					this.clearGender();
				}
			});
		}
		this.update();
	}

	clearGender() {
		Extension.SETTINGS.set_int('gender', 0);
		this._genderArray.forEach(function(b) {
			b.style = 'background-color: black;';
		});
	}

	addBar(catActor) {
		this._genderArray.forEach(function(b) {
			catActor.add(b);
		});
		this._toneArray.forEach(function(b) {
			catActor.add(b);
		});
	}

	removeCircle() {
		this._toneArray.forEach(function(b) {
			b.style_class = 'UnselectedTone';
		});
	}

	update() {
		this.removeCircle();
		this._toneArray[Extension.SETTINGS.get_int('skin-tone')].style_class = 'SelectedTone';
		this._genderArray.forEach(function(b) {
			b.style = 'background-color: black;';
		});
		if (this._genderArray.length != 0) {
			this._genderArray[Extension.SETTINGS.get_int('gender')].style = 'background-color: blue;';
		}
	}

	buildToneButton(accessibleName, color) {
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
