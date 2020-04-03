# Emoji Selector (for GNOME Shell)

This GNOME shell extension provides a searchable popup menu displaying most emojis ; Clicking on an emoji copies it to your clipboard.

## Features

- keyboard shortcut to open the extension's menu (<kbd>Super</kbd>+<kbd>E</kbd> by defaut)
- dynamic search (press enter to copy the first result to the clipboard)
- lots of parametrable things
- skin tone & gender modifiers
- middle-click to set to the cliboard without closing the menu (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>)
- right-click to add the emoji at the end of the current clipboard content (or <kbd>Shift</kbd>+<kbd>Enter</kbd>)

>currently Unicode 11

![Screenshot](https://i.imgur.com/sSjj3vH.png)

## About fonts

It will be less ugly if you have the « [Twitter Color Emoji](https://github.com/eosrei/twemoji-color-font/releases) » font, the « Noto Emoji » font, or the « JoyPixels Color » font installed on your system.

Color emojis depends on the system you're using (GNOME > 3.26 is recommended).

## About memory

Loading hundreds of small pictures and thousands of keywords into the memory is a lot. Despite a few attempts to optimize their loading, I'm not an expert at all concerning memory management, and the extension may be responsible for between 10MB and 60MB of memory usage, which is a lot. Don't blame the actual GS devs for it.

## Contributors & translations

- [Ryan Gonzalez](https://github.com/kirbyfan64) (port to ES6 classes)
- amivaleo (italian translation + lot of ideas)
- jonnius (german translation)
- picsi / frnogueira (brazilian portuguese and esperanto translations)
<!--TODO credit all translators + credit them in the about-->

The extension is currently available in english, french, brazilian portuguese, italian, esperanto and german. I only know french and english, so if you need a specific language, please contribute!

## Installation

#### Default way to do

The better option is to install it from [here](https://extensions.gnome.org/extension/1162/emoji-selector/).

#### Native packages

- [`gnome-shell-extension-emoji-selector-git` (**AUR**)](https://aur.archlinux.org/packages/gnome-shell-extension-emoji-selector-git/)
- ...<!-- TODO à compléter -->

#### Manual installation

Download and extract the ZIP, then open a terminal in the project's directory, and run `./install.sh`. It should copy the "emoji-selector@maestroschan.fr" folder to `~/.local/share/gnome-shell/extensions/`, which can be done manually if you want.

You may need to restart the gnome shell environment ("logout and login again", or `alt` + `f2` + `r` + enter).

