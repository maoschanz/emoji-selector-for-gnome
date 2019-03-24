#!/bin/bash

./update-and-compile-translations.sh

cd emoji-selector@maestroschan.fr

glib-compile-schemas ./schemas

zip ../emoji-selector@maestroschan.fr.zip *.js
zip ../emoji-selector@maestroschan.fr.zip prefs.ui
zip ../emoji-selector@maestroschan.fr.zip metadata.json
zip ../emoji-selector@maestroschan.fr.zip stylesheet.css

zip -r ../emoji-selector@maestroschan.fr.zip schemas
zip -r ../emoji-selector@maestroschan.fr.zip locale
zip -r ../emoji-selector@maestroschan.fr.zip icons


