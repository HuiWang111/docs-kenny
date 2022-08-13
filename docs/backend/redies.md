---
# id: backend/redis
title: Redis使用文档
tags:
  - Redis
  - backend
---

# Redis

### 什么事NoSQL？
- NoSQL，即Not-Only SQL(不仅仅是SQL)， 泛指**非关系型数据库**
- 什么是**关系型数据库**？数据库的结构是一种有行有列的数据库
- NoSQL数据库是为了解决**高并发、高可用、高可扩展、大数据库存储**问题而产生的数据库解决方案
- NoSQL可以作为关系型数据库的良好补充，但是**不能代替关系型数据库**

MySQL -> NoSQL -> NewSQL

### NoSQL数据库分类
- 键值存储数据库
  - 相关产品：Tokyo Cabinet/Tyrant、Redis、Voldemort、Berkeley DB
  - 典型应用：内容缓存，主要用于处理大量数据的高访问负载
  - 数据模型：一系列键值对
  - 优势：快速查询
  - 劣势：存储的数据缺少结构化
- 列存储数据库
- 文档型数据库
  - MongDB

### 什么是Redis
- 是一种NoSQL数据库
- 单线程的内存数据库，不存在**线程安全问题**
- 支持并发 10W QPS(每秒查询数)
- 主要是做缓存
- 提供了**五种数据类型**来存储**值**：字符串类型、散列类型（hash）、列表类型（list）、集合类型（set）、有序集合类型（sortedset）

### Redis应用场景
- 内存数据库（登录信息、购物车信息、用户浏览记录等）
- 缓存服务器（商品数据、广告数据等）（**最多使用**）
- 解决分布式集群架构中的session分离问题（session共享）
- 任务队列（秒杀、抢购、12306等等）
- 分布式锁的实现
- 支持发布订阅的消息模式
- 应用排行旁（有序集合）
- 网站访问统计
- **数据过期处理（可以精确到毫秒）**

### Redis安装
- 第一步：安装c语言需要的GCC环境
```shell
yum install -y gcc-c++
yum install -y wget
```
- 第二步：下载并解压缩Redis源码包
```shell
wget http://download.redis.io/releases/redis-5.0.4.tar.gz
tar -zxf redis-5.0.4.tar.gz
```
- 第三步：编译Redis源码，进入redis-5.0.4目录，执行编译命令
```shell
cd redis-5.0.4
make
```
- 第四步：安装Redis，需要通过PREFIX指定安装路径
```shell
make install PREFIX=/kkb/server/redis
```

### Redis启动
- 默认运行端口是6379
- 前端启动（不推荐）
- 后端启动（守护进程启动）
  - 第一步：拷贝redis-5.0.4/redis.conf配置文件到Redis安装的bin目录
  ```shell
  cp redis.conf /kkb/server/redis/bin
  ```
  - 第二步：修改`redis.conf`
  ```shell
  vim redis.conf
  ```
  ```shell
  # 将 `daemonize` 由no改为yes，改了这个就可以后端启动
  daemonize yes

  # 默认绑定的是回环地址，默认不能被其他机器访问
  # bind 127.0.0.1

  # 是否开启保护模式，由yes改为no
  protected-mode no
  ```
  - 第三步：启动服务
  ```shell
  ./redis-server redis.conf
  ```
- 后端启动的关闭方式
```shell
./redis-server shutdown
```
- 其他命令说明
- redis-server：启动redis服务
- redis-cli：进入redis命令客户端
- redis-benchmark：性能测试的工具
- redis-check-aof：aof文件检查的工具
- redis-check-dump：rdb文件进行检查的工具
- redis-sentinel：启动哨兵监控服务