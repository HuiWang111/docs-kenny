---
# id: backend/mySQL
title: MySql使用文档
tags:
  - MySql
  - backend
---

# MySQL

### 什么是数据库
数据库是**存储数据的仓库**，本质是**文件系统**，数据按照特定的格式存储起来

### 什么是关系型数据库
数据库中的**记录是有行有列**就是关系型数据库，与之相反的就是NoSQL数据库

### 什么是SQL
Structured Query Language

### SQL语言的分类
- 数据定义语言：DDL(Data Define Language)
  - 关键字：create/alter/drop等
- 数据操作语言：DML(Data Manipulation Language)
  - 关键字：insert/delete/update等
- 数据控制语言：DCL(Data Control Language)
  - 关键字：grant等
- 数据查询语言：DQL(Data Query Language)
  - 关键字：select/from/where

### 卸载MySQL
```shell
# linux
yum remove -y mysql mysql-libs mysql-common # 卸载mysql
rm -rf /var/lib/mysql #删除mysql的数据文件
rm etc/my.cnf # 删除mysql配置文件
yum remove -y mysql-community-release-el6-5.noarch # 删除组件
```

### 安装MySQL
```shell
# 下载rpm文件
wget http://repo.mysql.com/mysql-community-release-el6-6.noarch.rpm
# 执行rpm源文件
rpm -ivh mysql-community-release-el6-6.noarch.rpm
# 执行安装文件
yum install mysql-community-server
```

### 启动mysql
```shell
systemctl start mysqld
```

### 设置root用户密码
```shell
/usr/bin/mysqladmin -u root [-p 'oldpassword'] password 'root' ## -p 'oldpassword' 可选，如果有原来的密码才需要写
```

### 修改mysql配置
```shell
vim etc/my.cnf
```
修改内容如下
```conf
lower_case_table_names=1
# 设置默认数据库字符集
character-set-server=utf8
```

### MySQL远程接连授权
```sql
mysql > grant 权限 on 数据库对象 to 用户
```
**示例**
授权root用户对所有数据库对象的全部操作权限：
```sql
mysql > GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
mysql > FLUSH PRIVILEGES; # 刷新权限
```
- `ALL PRIVILEGES`：表示授予所有的权限，此处可以指定具体的授权权限
- `*.*`：表示所有库中的所有表
- `'root'@'%'`：root是数据库的用户名，%表示是任意ip地址，可以指定具体ip地址

### 查看权限
```sql
mysql > show grant for root;
```

### 关闭linux防火墙
```shell
systemctl stop firewalld # 默认
systemctl disable firewalld.service # 设置开机不启动
```

### 创建数据库
```sql
create database databaseName character set 'utf-8';
```

### 查看某个数据库的定义的信息
```sql
show create database databaseName
```

### 单表约束
```sql
primary key -- 主键约束
unique -- 唯一约束
not null -- 非空约束
```

**注意**
```
主键约束 = 唯一约束 + 非空约束
```

### 查看表结构
```sql
desc tableName
```

### 删除表
```sql
drop table tableName;
```

### 修改表
```sql
alter table tableName add columnName 类型(长度) 约束; -- 修改表添加列
alter table tableName modify columnName 类型(长度) 约束; -- 修改表修改列的类型长度及约束
alter table tableName change oldColumnName newColumnName 类型(长度) 约束; -- 修改表修改列名
alter table tableName drop columnName; -- 修改表删除列
rename table tableName to newTableName; -- 修改表名
alter table tableName character set 'utf-8'; -- 修改表的字符集
```

### 插入记录
```sql
insert into tableName (column1, column2, column3, ...) values (value1, value2, value3, ...); --向表中插入某些列
insert into tableName values (value1, value2, value3, ...); -- 向表中所有列插入
insert into tableName (column1, column2, column3, ...) values select (value1, value2, value3, ...) from tableName;
insert into tableName values select * from tableName;
```

### 更新记录
```sql
update tableName set columnName1=value1, columnName2=value2
update tableName set columnName1=value1, columnName2=value2 where condition
```

### 删除记录
```sql
delete from tableName where condition;
```

### 删除方式
- delete 一条一条删除，不清空 auto_increment 记录数
- truncate 直接将表删除，重新建表，auto_increment 将置为零，从新开始

### where后的条件写法
- 比较运算
```sql
>, <, >=, >=, <>
```

- like 使用占位符 _和 % -- _代表一个字符 %代表任意个字符
```sql
select * from product where pname like '%新%'
```

- in 在某个范围中获得值
```sql
select * from product where pid in (2,5,8)
```

- BETWEEN ... AND ...
显示在某一个区间的值（含头含尾）

- IS NULL
判断是否为空

- and 

- or 

- not

### 函数
```sql
sum() -- 求某一列的和
avg() -- 求某一列的平均值
max() -- 求某一列的最大值
min() -- 求某一列的最小值
count() -- 求某一列的元素个数
```

### 分页查询 LIMIT
```sql
LIMIT [offset,] rows; -- mysql独有语法
```

- 逻辑分页：把数据查到内存中再进行分页
- 物理分页：通过 `LIMIT` 关键字直接在数据库中进行分页查询，最终返回数据只是分页后的数据

```sql
SELECT * FROM TABLENAME LIMIT [offset,] rows;
```

### 子查询
- 定义
  - 子查询允许把一个查询嵌套在另一个查询中
  - 子查询，又叫内部查询；相对于内部查询，包含内部查询的就称为外部查询
  - 子查询可以包含 普通的`select`可包括的任何子句，比如 `distinct` `group by` `order by` `limit` `join` `union`
  - 但对应的外部查询必须是以下语句之一：`select` `insert` `update` `delete`


### 多表关联查询
- `CROSS JOIN` 交叉连接
**隐式交叉连接**
```sql
mysql > select * from A, B;
```
**显式交叉连接**
```sql
mysql > select * from A cross join B;
```
- `INNER JOIN` 内连接或者等值连接
**隐式内连接**
```sql
mysql > select * from A, B where A.id=B.id;
```
**隐式内连接**
```sql
mysql > select * from A inner join B on A.id=B.id;
```
- `OUTER JOIN` 外连接
**左外连接**
```sql
mysql > select * from A left join B on A.id=B.id; -- 以左表为准
```
**右外连接**
```sql
mysql > select * from A right join B on A.id=B.id; -- 以右表为准
```
**全外连接**（MySQL不支持）
```sql
full join
-- 或者
full outer join

select * from A full join B on A.id=B.id;
```

### SQL语句的解析顺序
```sql
-- 行过滤
from <left_table>
on <join_condition>
<join_type> join <right_table> -- 第二步和第三步会循环执行
where <where_conditon> -- 第四步会循环执行，多个条件的执行顺序是从左到右的
group by <group_by_list>
having <having_condition>
-- 列过滤
select -- 分组之后才会执行select
distinct <select_list>
order by <order_by_condition>
-- MySQL附加的
limit <limit_number>
```

### 查看存储引擎
```sql
mysql > show engines;
```