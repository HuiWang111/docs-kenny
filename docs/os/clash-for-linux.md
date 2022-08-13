# clash for linux usage

### download
- [clash for linux](https://github.com/Dreamacro/clash/releases)

### online configuration
- [clash configuration](http://clash.razord.top/#/proxies)

### install
```bash
gzip -d clash-linux-amd64-v1.7.1.gz
mv clash-linux-amd64-v1.7.1 /usr/local/bin/clash
cd /usr/local/bin/
chmod +x clash
./clash # run clash, generate config file ~/.config/clash
```

### get subscription config
- download and rename `config.yaml` replace `~/.config/clash/config.yaml`
```bash
mkdir /etc/clash
mv ~/.config/clash/config.yaml /etc/clash/
mv ~/.config/clash/Country.mmdb /etc/clash/
```

### network setting
- network proxy
    - http
    - https
        - 127.0.0.1 7890
    - socket
        - 127.0.0.1 7891

### clash service
- /usr/lib/systemd/system/clash.service
```service
[Unit] 
Description=clash
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service
​
[Service]
Type=simple
User=kennys
Group=kennys
DynamicUser=true
ExecStart=/usr/local/bin/clash -d /etc/clash/
Restart=always
LimitNOFILE=512000
​
[Install]
WantedBy=multi-user.target
```
