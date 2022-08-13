# Linux

### 32bit or 64bit
```bash
sudo uname --m
```

### hyper-v full screen
```bash
cd /etc/default
sudo gedit grub
```

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```
to
```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"
```

```bash
sudo update-grub
sudo reboot
```

### view storage
```bash
df -h --total
```

### 设置开机自启动
```bash
systemctl enable clash.service
```

### 停止开机启动
```bash
systemctl disable clash.service
```

### 验证是否是开机启动
```bash
systemctl is-enabled clash.service
```

### 查看所有已启动的服务
```bash
systemctl list-units --type=service
```

### install yarn
```bash
sudo apt remove cmdtest
sudo apt remove yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update
sudo apt-get install yarn -y
```

### install nodejs
1. Unzip the binary archive to any directory you wanna install Node, I use `/usr/local/lib/nodejs`
```bash
VERSION=v10.15.0
DISTRO=linux-x64
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
```

2. Set the environment variable `~/.profile`, add below to the end
```bash
# Nodejs
VERSION=v10.15.0
DISTRO=linux-x64
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
```

3. Refresh profile
```bash
source ~/.profile
```