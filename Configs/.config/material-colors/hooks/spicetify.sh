#!/bin/bash
material_cache="$HOME"/.cache/material/

cp $material_cache/spicetify-color.ini "$HOME"/.config/spicetify/Themes/text/color.ini

spicetify config current_theme text
spicetify config color_scheme Material

spicetify apply
