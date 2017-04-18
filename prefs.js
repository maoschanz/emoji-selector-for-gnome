
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

function init() {
    Convenience.initTranslations();
}

const EmojiSettingsWidget = new GObject.Class({
    Name: 'EmojiSelector.Prefs.Widget',
    GTypeName: 'EmojiSelectorPrefsWidget',
    Extends: Gtk.Grid,

    _init: function(params) {
		this.parent(params);
        this.margin = 30;
        this.row_spacing = this.column_spacing = 12;
        this.set_orientation(Gtk.Orientation.VERTICAL);

		this._settings = Convenience.getSettings();

		let label_main = '<b>' + _("Modifications will be effective after restarting the extension.") + '</b>';
		this.add(new Gtk.Label({ label: label_main, use_markup: true, halign: Gtk.Align.START }));
		
		//-------------------------------
		
		let label_pos_recent = _("Display of recent emojis :");
		this.add(new Gtk.Label({ label: label_pos_recent, use_markup: true, halign: Gtk.Align.START }));

		let align = new Gtk.Alignment({ left_padding: 30 });
		this.add(align);

		let grid = new Gtk.Grid({ orientation: Gtk.Orientation.VERTICAL, row_spacing: 12, column_spacing: 12 });
		align.add(grid);
		
		let radio_top = null;
		radio_top = new Gtk.RadioButton({ group: radio_top, label: _("Top"), valign: Gtk.Align.START });
		let radio_bottom = new Gtk.RadioButton({ group: radio_top, label: _("Bottom"), valign: Gtk.Align.START });
		let radio_none = new Gtk.RadioButton({ group: radio_top, label: _("Do not display"), valign: Gtk.Align.START });
		
		let position_s = this._settings.get_string('position');
		
		if(position_s === 'top') {
			radio_top.set_active(true);
		} else if (position_s === 'bottom') {
			radio_bottom.set_active(true);
		} else {
			radio_none.set_active(true);
		}
		
		radio_top.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'top');
			}
		}));
		
		radio_bottom.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'bottom');
			}
		}));
		
		radio_none.connect('toggled', Lang.bind(this, function(widget) {
			if (widget.active) {
				this._settings.set_string('position', 'none');
			}
		}));
		
		grid.add(radio_top);
		grid.add(radio_bottom);
		grid.add(radio_none);
		
		//-------------------------------------------------------
		
		let label_nb_recent = _("Number of recently used emojis :");
		this.add(new Gtk.Label({ label: label_nb_recent, use_markup: true, halign: Gtk.Align.START }));
		
		let nbRecents = new Gtk.SpinButton();
        nbRecents.set_sensitive(true);
        nbRecents.set_range(0, 40);
		nbRecents.set_value(12);
        nbRecents.set_value(this._settings.get_int('nbrecents'));
        nbRecents.set_increments(1, 2);
		nbRecents.connect('value-changed', Lang.bind(this, function(w){
			let value2 = w.get_value_as_int();
			this._settings.set_int('nbrecents', value2);
		}));
		this.add(nbRecents);
		
		//-------------------------------------------------------
		
		let label_nb_recent = _("Number of emojis on one line :");
		this.add(new Gtk.Label({ label: label_nb_recent, use_markup: true, halign: Gtk.Align.START }));
		
		let nbCols = new Gtk.SpinButton();
        nbCols.set_sensitive(true);
        nbCols.set_range(1, 50);
		nbCols.set_value(15);
		nbCols.set_value(this._settings.get_int('nbcols'));
        nbCols.set_increments(1, 2);
		nbCols.connect('value-changed', Lang.bind(this, function(w){
			let value = w.get_value_as_int();
			this._settings.set_int('nbcols', value);
		}));
		this.add(nbCols);
		
		//-----------------------------------
	}
});

function buildPrefsWidget() {
    let widget = new EmojiSettingsWidget();
    widget.show_all();

    return widget;
}
