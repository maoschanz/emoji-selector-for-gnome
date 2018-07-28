#!/bin/bash

./update-and-compile-translations.sh

glib-compile-schemas ./schemas

zip emoji-selector@maestroschan.fr.zip convenience.js emojisCharacters.js emojisKeywords.js extension.js metadata.json prefs.js stylesheet.css LICENSE
zip -r emoji-selector@maestroschan.fr.zip schemas locale icons
