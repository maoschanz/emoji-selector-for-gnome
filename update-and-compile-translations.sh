#!/bin/bash

################################################################################

extensionID="emoji-selector"

echo "Generating .pot file..."
xgettext --files-from=POTFILES.in --from-code=UTF-8 --output=$extensionID@maestroschan.fr/locale/$extensionID.pot

################################################################################

IFS='
'
liste=`ls ./$extensionID@maestroschan.fr/locale/`
prefix="./$extensionID@maestroschan.fr/locale"

for dossier in $liste; do
	if [ "$dossier" != "$extensionID.pot" ]; then
		echo "Updating translation for: $dossier"
		msgmerge -N $prefix/$dossier/LC_MESSAGES/$extensionID.po $prefix/$extensionID.pot > $prefix/$dossier/LC_MESSAGES/$extensionID.temp.po
		mv $prefix/$dossier/LC_MESSAGES/$extensionID.temp.po $prefix/$dossier/LC_MESSAGES/$extensionID.po
		echo "Compiling translation for: $dossier"
		msgfmt $prefix/$dossier/LC_MESSAGES/$extensionID.po -o $prefix/$dossier/LC_MESSAGES/$extensionID.mo
	fi
done

################################################################################

exit 0

