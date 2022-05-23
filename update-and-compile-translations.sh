#!/bin/bash

################################################################################

TRANSLATION_ID="emoji-selector"

echo "Generating .pot file..."
xgettext --files-from=POTFILES.in --from-code=UTF-8 --add-location=file --output=$TRANSLATION_ID@maestroschan.fr/locale/$TRANSLATION_ID.pot

################################################################################

IFS='
'
dir_list=`ls ./$TRANSLATION_ID@maestroschan.fr/locale/`
prefix="./$TRANSLATION_ID@maestroschan.fr/locale"

for dir in $dir_list; do
	if [ "$dir" != "$TRANSLATION_ID.pot" ]; then
		echo "Updating translation for: $dir"
		msgmerge --update --previous $prefix/$dir/LC_MESSAGES/$TRANSLATION_ID.po $prefix/$TRANSLATION_ID.pot
		echo "Compiling translation for: $dir"
		msgfmt $prefix/$dir/LC_MESSAGES/$TRANSLATION_ID.po -o $prefix/$dir/LC_MESSAGES/$TRANSLATION_ID.mo
		rm -f "$prefix/$dir/LC_MESSAGES/$TRANSLATION_ID.po~"
	fi
done

################################################################################

exit 0
