
Wall_Update()
{
    local x_wall="$1"
    echo "${x_wall}" > "${wallSet}"
    python "$HOME/.config/material-colors/generate.py" --image "${x_wall}"
}

Wall_Set()
{
    if [ -z $xtrans ] ; then
        xtrans="grow"
    fi

    #? getting the real path as symlinks too glitch
    swww img "$(cat "${wallSet}")" \
    --transition-bezier .43,1.19,1,.4 \
    --transition-type "$xtrans" \
    --transition-duration 0.7 \
    --transition-fps 60 \
    --invert-y \
    --transition-pos "$( hyprctl cursorpos )"    

}


# set variables

ScrDir=`dirname "$(realpath "$0")"`
source $ScrDir/globalcontrol.sh
wallSet="${XDG_CONFIG_HOME:-$HOME/.cache}/wallpaper/wallpaper"

fullPath=$(echo "$ctlLine" | awk -F '|' '{print $NF}' | sed "s+~+$HOME+")

# evaluate options

while getopts "nps" option ; do
    case $option in
    s ) # set input wallpaper
        shift $((OPTIND -1))
        if [ -f "$1" ] ; then
            Wall_Update "$1"
        fi ;;
    * ) # invalid option
        echo "s : set input wallpaper"
        exit 1 ;;
    esac
done


# check swww daemon and set wall

swww query
if [ $? -eq 1 ] ; then
    swww init
fi

Wall_Set