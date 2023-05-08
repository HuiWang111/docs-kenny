# windows

### saftware
- cmder
- ConEmu

### alias
1. 创建文件
```bash
touch ~/alias.bat
```

2. 设置常用别名
```bat
@echo off
doskey p=pnpm $*
doskey ls=dir /b $*
doskey rm=del $*
doskey -rf=/s $*
doskey mk=md $*
doskey clear=cls $*
doskey ll=dir $*
doskey cat=type $*
doskey which=where $*
doskey ifconfig=ipconfig $*
doskey mv=move $*
doskey cp=copy $*
doskey cat=type $*
doskey open=explorer $*
```

3. 修改注册表
- win+r，键入regedit，进入地址：计算机\HKEY_CURRENT_USER\Software\Microsoft\Command Processor
- 右边空白处右键新建->字符串值
- 双击编辑该值，随便起个名字（比如AutoRun），数值数据里填刚才新建的bat文件的路径
- 确定后重启cmd，别名就可以用啦

### 端口查询
```shell
# windows
netstat -ano | findstr 3000
taskkill /PID /F 3000

# linux
netstat -ano | grep 3000
```