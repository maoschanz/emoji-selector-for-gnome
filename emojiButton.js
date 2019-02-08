const St = imports.gi.St;
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;

/* Import the current extension, mainly because we need to access other files */
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Extension = Me.imports.extension;

const Clipboard = St.Clipboard.get_default();
const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;

//				none	woman					man
const GENDERS =	['',	'\u200D\u2640\uFE0F',	'\u200D\u2642\uFE0F'];
const GENDERS2 = ['👩','👨'];
const TONES = ['', '🏻', '🏼', '🏽', '🏾', '🏿'];

//------------------------------------------------------------------------------

const EmojiButton = new Lang.Class({
	Name:		'EmojiButton',
	Extends:	St.Button,
	
	_init: function() {
		this.parent({
			style_class: 'EmojisItemStyle',
			style: fontStyle,
			can_focus: true,
		});
	},
	
	
	
	
});


// TODO


/*
 * This function is called at each click and copies the emoji to the clipboard.
 * 
 * The exact behavior of the method depends on the mouse button used:
 * - left click overwrites clipboard content with the emoji, and closes the menu;
 * - middle click too, but does not close the menu;
 * - right click adds the emoji at the end of the current clipboard content (and does not close the menu).
 */
function genericOnButtonPress (actor, event, tags, CurrentEmoji){
	let mouseButton = event.get_button();
	if (mouseButton == 1) {
		Clipboard.set_text(
			CLIPBOARD_TYPE,
			applyTags(tags, CurrentEmoji)
		);
		Extension.GLOBAL_BUTTON.menu.close();
		return Clutter.EVENT_STOP;
	} else if (mouseButton == 2) {
		Clipboard.set_text(
			CLIPBOARD_TYPE,
			applyTags(tags, CurrentEmoji)
		);
		return Clutter.EVENT_STOP;
	} else if (mouseButton == 3) {
		Clipboard.get_text(CLIPBOARD_TYPE, function (clipBoard, text) {
			Clipboard.set_text(
				CLIPBOARD_TYPE,
				text + applyTags(tags, CurrentEmoji)
			);
		});
		return Clutter.EVENT_STOP;
	}
	return Clutter.EVENT_PROPAGATE;
}

/*
 * This returns an emoji corresponding to CurrentEmoji with tags applied to it.
 * If all tags are false, it returns unmodified CurrentEmoji.
 * "tags" is an array of 3 boolean, which describe how a composite emoji is built:
 * - tonable -> return emoji concatened with the selected skin tone;
 * - genrable -> return emoji concatened with the selected gender;
 * - gendered -> the emoji is already gendered, which modifies the way skin tone is
 * applied ([man|woman] + [skin tone if any] + [other symbol(s)]).
 */
function applyTags (tags, CurrentEmoji) {
	if(CurrentEmoji != '') {
		let tonable = tags[0];
		let genrable = tags[1];
		let gendered = tags[2];
		let temp = CurrentEmoji;
//		log( tags + " appliqués à " + CurrentEmoji );
		if (tonable) {
			if (gendered) {
				if (temp.includes(GENDERS2[0])) {
					CurrentEmoji = CurrentEmoji.replace(GENDERS2[0], GENDERS2[0]+TONES[Extension.SETTINGS.get_int('skin-tone')])
				} else if (temp.includes(GENDERS2[1])) {
					CurrentEmoji = CurrentEmoji.replace(GENDERS2[1], GENDERS2[1]+TONES[Extension.SETTINGS.get_int('skin-tone')])
				} else {
					log('Error: ' + GENDERS2[0] + " isn't a valid gender prefix.");
				}
				temp = CurrentEmoji;
			} else {
				temp += TONES[Extension.SETTINGS.get_int('skin-tone')];
			}
		}
		if (genrable) {
			temp += GENDERS[Extension.SETTINGS.get_int('gender')];
		}
		shiftFor(temp);
		return temp;
	} // FIXME else ?
}

//-----------------------------------------

function shiftFor(CurrentEmoji) {
	if (CurrentEmoji == '') {return;}
	
	//	The "isIn" boolean is true if the clicked emoji is already saved as recently used in the setting key.
	let isIn = false;
	let temp = Convenience.getSettings().get_string('recents').split(',');
	for(var i=0; i<Extension.NB_COLS; i++){
		if (temp[i] == CurrentEmoji) {
			isIn = true;
		}
	}
	
	if (!isIn) {
		Extension.buildRecents();
		for(var j=Extension.NB_COLS-1; j>0; j--){
			Extension.recents[j].label = Extension.recents[j-1].label;
		}
		Extension.recents[0].label = CurrentEmoji;
		Extension.saveRecents();
	}
	Extension.GLOBAL_BUTTON._onSearchTextChanged();
}



