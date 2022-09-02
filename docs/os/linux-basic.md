# Linux

## 一 系统命令
```bash
sudo uname --m # 查看系统是32位还是64位

df -h --total # 查看系统存储空间

# service相关
systemctl enable clash.service # 设置开机自启动
systemctl disable clash.service # 停止开机启动
systemctl is-enabled clash.service # 验证是否是开机启动
systemctl list-units --type=service # 查看所有已启动的服务

# 系统账户相关
id -u # get current account id
id -u {username} # get account id by username 
```

## 二 环境安装相关
### 1. install yarn
```bash
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y
```

### 2. install node
Step 1. Unzip the binary archive to any directory you wanna install Node, I use `/usr/local/lib/nodejs`
```bash
VERSION=v10.15.0
DISTRO=linux-x64
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
```

Step 2. Set the environment variable `~/.profile`, add below to the end
```bash
# Nodejs
VERSION=v10.15.0
DISTRO=linux-x64
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
```

Step 3. Refresh profile
```bash
source ~/.profile
```