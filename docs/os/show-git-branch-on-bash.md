# How to show current git branch with colors in Bash prompt
1. edit file
```bash
vim ~/.bashrc
```

2. add code
```bash
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1)/'
}

export PS1="\u@\h \[\e[32m\]\w \[\e[91m\]\$(parse_git_branch)\[\e[00m\]$ "
```

3. source file
```bash
source ~/.bashrc
```
