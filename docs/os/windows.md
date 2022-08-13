# windows

### saftware
- cmder
- ConEmu

### alias
```PowerShell
alias cd~=cd /d "%UserProfile%"
alias cdc=cd /d "%ConEmuDir%"
alias clear=cls
alias clink="C:\Program Files\cmder\vendor\clink\clink_x64.exe" $*
alias cmderr=cd /d "%CMDER_ROOT%"
alias gl=git log --oneline --all --graph --decorate  $*
alias history="C:\Program Files\cmder\vendor\clink\clink_x64.exe" history $*
alias ll=ls -l
alias ls=ls --show-control-chars -F --color $*
alias open=explorer $*
alias pwd=cd
alias unalias=alias /d $1
alias vi=vim $*
alias cdc=cd /d "%ConEmuDir%"
alias cd~=cd /d "%UserProfile%"
```

### 端口查询
```shell
# windows
netstat -ano | findstr 3000
taskkill /PID /F 3000

# linux
netstat -ano | grep 3000
```