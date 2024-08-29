#!/bin/bash
material_cache="$HOME"/.cache/material/

sass $material_cache/material-discord.scss $material_cache/material-discord.css
cp $material_cache/material-discord.css "$HOME"/.config/BetterDiscord/themes/material-discord.theme.css
