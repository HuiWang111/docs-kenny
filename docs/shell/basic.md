# shell basic

### 获取当前路径
```shell
DIR=$(cd `dirname $0`; pwd)
```

- 使用
```shell
cd "$DIR/../somefolder" # cd到上一层目录下的somefolder目录
```