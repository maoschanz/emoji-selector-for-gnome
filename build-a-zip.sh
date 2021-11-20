#!/bin/bash

EXT_ID=emoji-selector@maestroschan.fr

# ./update-and-compile-translations.sh

cd $EXT_ID

glib-compile-schemas ./schemas

zip ../$EXT_ID.zip *.js
zip ../$EXT_ID.zip prefs.ui
zip ../$EXT_ID.zip metadata.json
zip ../$EXT_ID.zip stylesheet.css

zip -r ../$EXT_ID.zip data
zip -r ../$EXT_ID.zip schemas
zip -r ../$EXT_ID.zip locale
zip -r ../$EXT_ID.zip icons

shopt -s globstar

zip -d ../$EXT_ID.zip **/*.pot
zip -d ../$EXT_ID.zip **/*.po

