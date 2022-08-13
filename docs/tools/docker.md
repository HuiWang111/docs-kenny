# docker

### 阿里云加速器
- [点击获取阿里云加速地址](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

### 修改加速器配置
    - windows
        - 修改 `C:\Users\Administrator\.docker\config.json`
        ```json
        {
            "registry-mirrors":"https://g58d4r1h.mirror.aliyuncs.com"
        }
        ```

### 启动应用
```shell
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag

# --name 应用实例名称
# -e 传递环境变量
# -d 使后台运行
```

### 查看应用实例详情信息
```shell
docker inspect [docker containerId]; # id可以通过docker ps查看
```

### 数据库管理工具
```shell
docker pull dbeaver/cloudbeaver:latest
```

### 运行 dbeaver
```shell
docker run -d --name cloudbeaver --rm -ti -p 8081:8978 -v /var/cloudbeaver/workspace:/opt/cloudbeaver/workspace dbeaver/cloudbeaver:latest

# --rm 之前启动过就把之前的删了，保证只启动一份
# -ti 显示命令行输出的信息
# -p 端口 8081是本机端口，8978是容器内端口
# -v 配置工作空间的路径
```

### ADMINISTRATOR CREDENTIALS
- dbadmin
- 123456

### 创建mysql修改配置
- `useSSL = false`
- `allowPublicKeyRetrieval = true`

### docker原理
- 不隔离计算，之隔离环境
- docker不是虚拟机，运行容器使用的还是本机的内存，cpu
- 使用的是本机真实的进程
- docker是一种隔离技术，而不是虚拟化