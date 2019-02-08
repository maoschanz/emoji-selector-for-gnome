# Emoji Selector (for GNOME Shell)

This GNOME shell extension provides a searchable popup menu displaying most emojis ; Clicking on an emoji copies it to your clipboard.

## Features

- keyboard shorcut to open the extension's menu (Super+E by defaut)
- dynamic research (press enter to copy the first result to the clipboard)
- lots of parametrable things
- skin tone & gender modifiers
- middle click to set to the cliboard without closing the menu (or Ctrl+Enter)
- right click to add the emoji at the end of the current clipboard content (or Shift+Enter)

>currently Unicode 10

![Screenshot](https://i.imgur.com/sSjj3vH.png)

## About fonts

It will be less ugly if you have the « [Twitter Color Emoji](https://github.com/eosrei/twemoji-color-font/releases) » font, or the « [EmojiOne Color](https://github.com/emojione/emojione) » font installed on your system. These fonts are on github.

**Arch Linux** users can install [ttf-emojione from **AUR**](https://aur.archlinux.org/packages/ttf-emojione/).

Color emojis depends on the system you're using (GNOME > 3.26 is recommended).

## Contributors & translations

amivaleo (italian translation + lot of ideas)

jonnius (german translation)

picsi / frnogueira (brazilian portuguese and esperanto translations)

> Can you translate the extension in (some language) ?

The extension is currently available in english, french, brazilian portuguese, italian, esperanto and german. I only know french and english, so if you need a specific language, please contribute : you just have to be inspired by the existing .po files !

----

If you want to help by translating the interface, it's recommended to **NOT** translate the search/tooltips keywords (there are too many!). However, if you really want to translate them:

- everything as to be **in lower case**
- try to follow the Unicode wording for your language
- special keywords (**in upper case**) should **not** be translated
- your translations for keywords should **never** be more than 42 characters

## Installation

#### Default way to do

The better option is to install it from https://extensions.gnome.org/extension/1162/emoji-selector/

#### For Arch Linux users

Arch Linux users can install [gnome-shell-extension-emoji-selector-git](https://aur.archlinux.org/packages/gnome-shell-extension-emoji-selector-git/) from **AUR**.

#### Manual installation

Download files and put them in an "emoji-selector@maestroschan.fr" folder to `~/.local/share/gnome-shell/extensions/`

You may need to restart the gnome shell environment ("logout and login again", or `alt` + `f2` + `r` + enter).


