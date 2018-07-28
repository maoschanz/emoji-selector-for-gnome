#!/bin/bash

#####

if ! [ -x "$(command -v jq)" ]; then
	echo '`jq` is not installed, aborting.' >&2
	exit 1
fi

#####

echo "Generating .pot file..."

#name=`cat metadata.json | jq -r '.name'`
#description=`cat metadata.json | jq -r '.description'`
#echo "_(\"$name\")" > other-strings.js
#echo "_(\"$description\")" >> other-strings.js

xgettext --files-from=POTFILES.in --from-code=UTF-8 --output=locale/emoji-selector.pot
xgettext -ja emojisKeywords.js --from-code=UTF-8 --output=locale/emoji-selector.pot

#####

IFS='
'
liste=`ls ./locale/`

for dossier in $liste
do
	if [ "$dossier" != "emoji-selector.pot" ]; then
		echo "Updating translation for: $dossier"
		msgmerge -N ./locale/$dossier/LC_MESSAGES/emoji-selector.po ./locale/emoji-selector.pot > ./locale/$dossier/LC_MESSAGES/emoji-selector.temp.po
		mv ./locale/$dossier/LC_MESSAGES/emoji-selector.temp.po ./locale/$dossier/LC_MESSAGES/emoji-selector.po
		echo "Compiling translation for: $dossier"
		msgfmt ./locale/$dossier/LC_MESSAGES/emoji-selector.po -o ./locale/$dossier/LC_MESSAGES/emoji-selector.mo
	fi
done

#####

#echo "Deleting temporary files"
#rm other-strings.js

exit 0
