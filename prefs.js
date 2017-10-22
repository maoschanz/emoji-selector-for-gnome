
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('emoji-selector');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

//-----------------------------------------------

function init() {
    Convenience.initTranslations();
}

//-----------------------------------------------

const EmojiSettingsWidget = new GObject.Class({
    Name: 'EmojiSelector.Prefs.Widget',
    GTypeName: 'EmojiSelectorPrefsWidget',
    Extends: Gtk.Box,

    _init: function(params) {
		this.parent(params);
        this.margin = 20;
        this.spacing = 15;
        this.fill = true;
        this.set_orientation(Gtk.Orientation.VERTICAL);

		this._settings = Convenience.getSettings();

		let labelMain = '<b>' + _("Modifications will be effective after reloading the extension.") + '</b>';
		this.add(new Gtk.Label({ label: labelMain, use_markup: true, halign: Gtk.Align.START }));
		
		//------------------------------------------
		
		let labelPosRecent = _("Display of recent emojis:");
		this.add(new Gtk.Label({ label: labelPosRecent, use_markup: true, halign: Gtk.Align.START }));

		let align = new Gtk.Alignment({ left_padding: 40 });
		this.add(align);

		let radioBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, /*expand: true,*/ spacing: 8 });
		align.add(radioBox);
		
		//radioTop is both the first Gtk.RadioButton and the group in which the 3 buttons belong
		let radioTop = null;
		radioTop = new Gtk.RadioButton({ group: radioTop, label: _("Top"), valign: Gtk.Align.START });
		let radioBottom = new Gtk.RadioButton({ group: radioTop, label: _("Bottom"), valign: Gtk.Align.START });
		
		//getting the current 'position' setting state, before an eventual modification
		let position_s = this._settings.get_string('position');
		//displaying this current state to the user
		if (position_s === 'bottom') {
			radioBottom.set_active(true);
		} else {
			radioTop.set_active(true);
		}
		
		radioTop.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'top');
			}
		}));
		
		radioBottom.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'bottom');
			}
		}));
		
		radioBox.add(radioTop);
		radioBox.add(radioBottom);
		
		//-------------------------------------------------------
		
		let labelNbRecents = _("Number of recently used emojis:");
		
		let nbRecents = new Gtk.SpinButton();
        nbRecents.set_sensitive(true);
        nbRecents.set_range(0, 40);
		nbRecents.set_value(13);
        nbRecents.set_value(this._settings.get_int('nbrecents'));
        nbRecents.set_increments(1, 2);
        
		nbRecents.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('nbrecents', value);
		}));
		
		let recentBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		recentBox.pack_start(new Gtk.Label({ label: labelNbRecents, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		recentBox.pack_end(nbRecents, false, false, 0);
		this.add(recentBox);
		
		//-------------------------------------------------------
		
		let labelNbEmojis = _("Number of emojis per line:");
		
		let nbCols = new Gtk.SpinButton();
        nbCols.set_sensitive(true);
        nbCols.set_range(1, 60);
		nbCols.set_value(14);
		nbCols.set_value(this._settings.get_int('nbcols'));
        nbCols.set_increments(1, 2);
        
		nbCols.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('nbcols', value);
		}));
		
		let colsBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		colsBox.pack_start(new Gtk.Label({ label: labelNbEmojis, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		colsBox.pack_end(nbCols, false, false, 0);
		this.add(colsBox);
		
		//-------------------------------------------------------
		
		let labelSizeEmojis = _("Size of emojis (px):");
		
		let emojiSize = new Gtk.SpinButton();
        emojiSize.set_sensitive(true);
        emojiSize.set_range(10, 100);
		emojiSize.set_value(24);
		emojiSize.set_value(this._settings.get_int('emojisize'));
        emojiSize.set_increments(1, 2);
        
		emojiSize.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('emojisize', value);
		}));
		
		let sizeBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		sizeBox.pack_start(new Gtk.Label({ label: labelSizeEmojis, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		sizeBox.pack_end(emojiSize, false, false, 0);
		this.add(sizeBox);
		
		//--------------------------------------------------------
		
		let labelSearch = _("Enable research:");
		
		let searchSwitch = new Gtk.Switch();
		searchSwitch.set_state(true);
		searchSwitch.set_state(this._settings.get_boolean('search-enabled'));
		
		searchSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_boolean('search-enabled', true);
			} else {
				this._settings.set_boolean('search-enabled', false);
			}
		}));
		
		let searchBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		searchBox.pack_start(new Gtk.Label({ label: labelSearch, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		searchBox.pack_end(searchSwitch, false, false, 0);
		this.add(searchBox);
		
		//--------------------------------------------------------
		
		let labelClassicInterface = _("Use old interface:");
		let interfaceSwitch = new Gtk.Switch();
		interfaceSwitch.set_state(true);
		interfaceSwitch.set_state(this._settings.get_boolean('classic-interface'));
		
		interfaceSwitch.connect('notify::active', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_boolean('classic-interface', true);
			} else {
				this._settings.set_boolean('classic-interface', false);
			}
		}));
		
		let classicBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
		classicBox.pack_start(new Gtk.Label({ label: labelClassicInterface, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		classicBox.pack_end(interfaceSwitch, false, false, 0);
		this.add(classicBox);
		
	}
});

//-----------------------------------------------

//I guess this is like the "enable" in extension.js : something called each
//time he user try to access the settings' window
function buildPrefsWidget() {
    let widget = new EmojiSettingsWidget();
    widget.show_all();

    return widget;
}
