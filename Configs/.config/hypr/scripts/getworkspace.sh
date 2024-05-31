#!/bin/bash

# Check if a parameter is provided and is a number
if [ -z "$1" ] || ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "Usage: $0 <numeric_parameter>"
    exit 1
fi

# Run hyprctl and capture its output
hyprctl_output=$(hyprctl monitors -j)

# Parse the JSON to get the name and ID of the active monitor
active_monitor_id=$(echo "$hyprctl_output" | jq '.[] | select(.focused == true) | .id')

# Assign values based on the screen name
case "$active_monitor_id" in
    0) value=1 ;;
    1) value=2 ;;
    2) value=0 ;;
    *) value=999 ;; # Default value for unknown screen names
esac

# Perform the calculation (multiply by 10 and add to the parameter)
parameter=$1
result=$((value * 10 + parameter))

# Print the result
echo "$result"

