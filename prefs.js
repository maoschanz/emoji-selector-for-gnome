
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
        this.margin = 30;
        this.spacing = 25;
        this.fill = true;
        this.set_orientation(Gtk.Orientation.VERTICAL);

		this._settings = Convenience.getSettings();

		let labelMain = '<b>' + _("Modifications will be effective after reloading the extension.") + '</b>';
		this.add(new Gtk.Label({ label: labelMain, use_markup: true, halign: Gtk.Align.START }));
		
		//------------------------------------------
		
		let labelPosRecent = _("Display of recent emojis :");
		this.add(new Gtk.Label({ label: labelPosRecent, use_markup: true, halign: Gtk.Align.START }));

		let align = new Gtk.Alignment({ left_padding: 40 });
		this.add(align);

		let radioBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, expand: true, spacing: 12 });
		align.add(radioBox);
		
		//radioTop is both the first Gtk.RadioButton and the group in which the 3 buttons belong
		let radioTop = null;
		radioTop = new Gtk.RadioButton({ group: radioTop, label: _("Top"), valign: Gtk.Align.START });
		let radioBottom = new Gtk.RadioButton({ group: radioTop, label: _("Bottom"), valign: Gtk.Align.START });
		let radioNone = new Gtk.RadioButton({ group: radioTop, label: _("Do not display"), valign: Gtk.Align.START });
		
		//getting the current 'position' setting state, before an eventual modification
		let position_s = this._settings.get_string('position');
		//displaying this current state to the user
		if(position_s === 'top') {
			radioTop.set_active(true);
		} else if (position_s === 'bottom') {
			radioBottom.set_active(true);
		} else {
			radioNone.set_active(true);
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
		
		radioNone.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'none');
			}
		}));
		
		radioBox.add(radioTop);
		radioBox.add(radioBottom);
		radioBox.add(radioNone);
		
		//-------------------------------------------------------
		
		let labelNbRecents = _("Number of recently used emojis :");
		
		let nbRecents = new Gtk.SpinButton();
        nbRecents.set_sensitive(true);
        nbRecents.set_range(0, 40);
		nbRecents.set_value(12);
        nbRecents.set_value(this._settings.get_int('nbrecents'));
        nbRecents.set_increments(1, 2);
        
		nbRecents.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('nbrecents', value);
		}));
		
		let recentBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		recentBox.pack_start(new Gtk.Label({ label: labelNbRecents, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		recentBox.pack_end(nbRecents, false, false, 0);
		this.add(recentBox);
		
		//-------------------------------------------------------
		
		let labelNbEmojis = _("Number of emojis on one line :");
		
		let nbCols = new Gtk.SpinButton();
        nbCols.set_sensitive(true);
        nbCols.set_range(1, 50);
		nbCols.set_value(15);
		nbCols.set_value(this._settings.get_int('nbcols'));
        nbCols.set_increments(1, 2);
        
		nbCols.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('nbcols', value);
		}));
		
		let colsBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		colsBox.pack_start(new Gtk.Label({ label: labelNbEmojis, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		colsBox.pack_end(nbCols, false, false, 0);
		this.add(colsBox);
		
		//-------------------------------------------------------
		
		let labelSizeEmojis = _("Size of emojis :");
		
		let emojiSize = new Gtk.SpinButton();
        emojiSize.set_sensitive(true);
        emojiSize.set_range(12, 50);
		emojiSize.set_value(20);
		emojiSize.set_value(this._settings.get_int('emojisize'));
        emojiSize.set_increments(1, 2);
        
		emojiSize.connect('value-changed', Lang.bind(this, function(w){
			var value = w.get_value_as_int();
			this._settings.set_int('emojisize', value);
		}));
		
		let sizeBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 15 });
		sizeBox.pack_start(new Gtk.Label({ label: labelSizeEmojis, use_markup: true, halign: Gtk.Align.START }), false, false, 0);
		sizeBox.pack_end(emojiSize, false, false, 0);
		this.add(sizeBox);
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
