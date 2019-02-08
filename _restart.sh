#!/bin/bash

echo "Restarting GNOME Shell..."

dbus-send --type=method_call --dest=org.gnome.Shell /org/gnome/Shell org.gnome.Shell.Eval string:'Meta.restart(_("Restarting…"))'
