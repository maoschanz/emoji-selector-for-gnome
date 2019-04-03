#!/bin/bash

glib-compile-schemas ./emoji-selector@maestroschan.fr/schemas

if (( $EUID == 0 )); then
	if [ ! -d "/usr/share/gnome-shell/extensions" ]; then
		mkdir /usr/share/gnome-shell/extensions
	fi
	INSTALL_DIR="/usr/share/gnome-shell/extensions"
else
	if [ ! -d "$HOME/.local/share/gnome-shell/extensions" ]; then
		mkdir $HOME/.local/share/gnome-shell/extensions
	fi
	INSTALL_DIR="$HOME/.local/share/gnome-shell/extensions"
fi

echo "Installing extension files in $INSTALL_DIR/emoji-selector@maestroschan.fr"
cp -r emoji-selector@maestroschan.fr $INSTALL_DIR

echo "Done."
exit 0

