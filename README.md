# Emoji Selector (for Gnome)
This Gnome shell extension provides a simple popup menu with some emojis in it ; Clicking on an emoji copies it to your clipboard.

## New features
- new way to display emojis, on a grid (which is far better)
- parametrable width for the grid
- new and better icon
- translations (english, french and german)
- new stylesheet
- recently used emojis are displayed above (or under) categories
- bug fixes
- less ugly code
- a nice interface for settings

![Screenshot](https://raw.githubusercontent.com/Maestroschan/emoji-selector-for-gnome/master/screenshot_v5.png)

## Installation
The better option is to install it from https://extensions.gnome.org/extension/1162/emoji-selector/

> How to manually install the extension ?

Download files and put them in an "emoji-selector@maestroschan.fr" folder to ~/.local/share/gnome-shell/extensions/

You may need to restart the gnome shell environnment ("logout and login again", or alt+f2 + r + enter).

> The screenshot looks great but it's ugly on my computer !

It will be less ugly if you have the « Twitter Color Emoji » font, or the « EmojiOne Color » font installed on your system. These fonts are on github, be careful with EmojiOne Color, the recommended way to install it may fuck your system.

## About Dash to Panel
The very popular extension "Dash to Panel" seems to cause some problems with my extension. 
You need to set a number of emojis per line around 25 to solve the issue.

## Your eventual observations :
> The "recently used" category is reset every time i login, is this normal ?

This behavior happens with the version on extensions.gnome.org but not with the version on github.

> Can you translate the extension in [some language] ?

The extension is currently available in english, french and german. I only know french and english, so if you need a specific language, please contribute : you just have to be inspired by the existing .po files !

> There is no racialized smileys / LGBT peoples / gender-specific activities / "numbers in square" symbols :'(

I'm sorry about that, but most fonts have a bad technical support for these caracters, which didn't display well (at least on my computer), so i prefered doing without these emojis.
