#!/bin/bash

#####

echo "Generating .pot file..."

xgettext --files-from=POTFILES.in --from-code=UTF-8 --output=emoji-selector@maestroschan.fr/locale/emoji-selector.pot

#####

IFS='
'
liste=`ls ./emoji-selector@maestroschan.fr/locale/`
prefix="./emoji-selector@maestroschan.fr/locale"

for dossier in $liste
do
	if [ "$dossier" != "emoji-selector.pot" ]; then
		echo "Updating translation for: $dossier"
		msgmerge -N $prefix/$dossier/LC_MESSAGES/emoji-selector.po $prefix/emoji-selector.pot > $prefix/$dossier/LC_MESSAGES/emoji-selector.temp.po
		mv $prefix/$dossier/LC_MESSAGES/emoji-selector.temp.po $prefix/$dossier/LC_MESSAGES/emoji-selector.po
		echo "Compiling translation for: $dossier"
		msgfmt $prefix/$dossier/LC_MESSAGES/emoji-selector.po -o $prefix/$dossier/LC_MESSAGES/emoji-selector.mo
	fi
done

#####

exit 0
