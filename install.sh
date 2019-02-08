#!/bin/bash

if (( $EUID == 0 )); then

	if [ ! -d "/usr/share/gnome-shell/extensions" ]; then
		mkdir /usr/share/gnome-shell/extensions
	fi
	
	INSTALL_DIR="/usr/share/gnome-shell/extensions/emoji-selector@maestroschan.fr"

else

	if [ ! -d "$HOME/.local/share/gnome-shell/extensions" ]; then
		mkdir $HOME/.local/share/gnome-shell/extensions
	fi
	
	INSTALL_DIR="$HOME/.local/share/gnome-shell/extensions/emoji-selector@maestroschan.fr"

fi

if [ ! -d "$INSTALL_DIR" ]; then
	mkdir $INSTALL_DIR
fi

echo "Installing extension files in $INSTALL_DIR"

cp emojiButton.js $INSTALL_DIR/emojiButton.js
cp emojiCategory.js $INSTALL_DIR/emojiCategory.js
cp emojiOptionsBar.js $INSTALL_DIR/emojiOptionsBar.js
cp extension.js $INSTALL_DIR/extension.js
cp prefs.js $INSTALL_DIR/prefs.js
cp convenience.js $INSTALL_DIR/convenience.js
cp stylesheet.css $INSTALL_DIR/stylesheet.css
cp metadata.json $INSTALL_DIR/metadata.json

cp emojisCharacters.js $INSTALL_DIR/emojisCharacters.js
cp emojisKeywords.js $INSTALL_DIR/emojisKeywords.js

cp -r schemas $INSTALL_DIR
cp -r locale $INSTALL_DIR
cp -r icons $INSTALL_DIR

echo "Done."

exit

