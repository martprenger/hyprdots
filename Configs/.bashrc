
##-----------------------------------------------------
## synth-shell-prompt.sh
if [ -f /home/pyro/.config/synth-shell/synth-shell-prompt.sh ] && [ -n "$( echo $- | grep i )" ]; then
	source /home/pyro/.config/synth-shell/synth-shell-prompt.sh
fi

# git auto complete
if [ -f /home/pyro/.bashScripts/.git-completion.bash ] && [ -n "$( echo $- | grep i )" ]; then
	source /home/pyro/.bashScripts/.git-completion.bash
fi

##-----------------------------------------------------
## better-ls
if [ -f /home/pyro/.config/synth-shell/better-ls.sh ] && [ -n "$( echo $- | grep i )" ]; then
	source /home/pyro/.config/synth-shell/better-ls.sh
fi

##-----------------------------------------------------
## alias
if [ -f /home/pyro/.config/synth-shell/alias.sh ] && [ -n "$( echo $- | grep i )" ]; then
	source /home/pyro/.config/synth-shell/alias.sh
fi

##-----------------------------------------------------
## better-history
if [ -f /home/pyro/.config/synth-shell/better-history.sh ] && [ -n "$( echo $- | grep i )" ]; then
	source /home/pyro/.config/synth-shell/better-history.sh
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

##eval "$(fzf --zsh)"


# Load Angular CLI autocompletion.
source <(ng completion script)
