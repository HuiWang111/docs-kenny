# NodeJs基础

### 如何实现文件拷贝
```js
const rs = fs.createReadStream(src);
const ws = fs.createWriteStream(dst);

rs.on('data', function (chunk) {
    // 判断传入的数据是写入目标了，还是临时放在了缓存了
    if (ws.write(chunk) === false) {
        rs.pause();
    }
});

rs.on('end', function () {
    ws.end();
});

// 判断什么时候只写数据流已经将缓存中的数据写入目标，可以传入下一个待写数据了
ws.on('drain', function () {
    rs.resume();
});
```

### path
- path.normalize
    - 将传入的路径标准化，具体如
        - 解析路径中的 `.` 与 `..`
        - 去掉多余的斜杠
    - 标准化之后的路径里的斜杠在Windows系统下是\，而在Linux系统下是/。如果想保证任何系统下都使用/作为路径分隔符的话，需要用.replace(/\\/g, '/')再替换一下标准路径
- path.join
```js
path.join('foo/', 'baz/', '../bar'); // => "foo/bar"
```
- path.extname
    - 获取文件的扩展名

### 文件BOM标记
- BOM用于标记一个文本文件使用Unicode编码，其本身是一个Unicode字符（"\uFEFF"），位于文本文件头部

### 移除文件BOM标记
```js
function readText(pathname) {
    let bin = fs.readFileSync(pathname);

    if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
        bin = bin.slice(3);
    }

    return bin.toString('utf-8');
}
```

### GBK转utf8
```js
import iconv from 'iconv-lite';

function readGBKText(pathname) {
    let bin = fs.readFileSync(pathname);

    return iconv.decode(bin, 'gbk');
}
```

### https
```js
const options = {
    key: fs.readFileSync('./ssl/default.key'),
    cert: fs.readFileSync('./ssl/default.cer'),
    // 禁止对证书有效性的检查，从而允许开发环境下使用自制的HTTPS服务器
    rejectUnauthorized: false
};

const server = https.createServer(options, function (request, response) {
    // ...
})
```

### url
- url.parse
    - 第二个参数为 `true`，该方法返回的URL对象中，`query` 字段不再是一个字符串，而是一个经过 `querystring` 模块转换后的参数对象
    - 第三个参数为 `true`，该方法可以正确解析不带协议头的URL，例如 `//www.example.com/foo/bar`
```js
url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
/* =>
{ protocol: 'http:',
  auth: 'user:pass',
  host: 'host.com:8080',
  port: '8080',
  hostname: 'host.com',
  hash: '#hash',
  search: '?query=string',
  query: 'query=string',
  pathname: '/p/a/t/h',
  path: '/p/a/t/h?query=string',
  href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash' }
*/
```
```js
http.createServer(function (request, response) {
    const tmp = request.url; // => "/foo/bar?a=b"
    url.parse(tmp);
    /* =>
    { protocol: null,
      slashes: null,
      auth: null,
      host: null,
      port: null,
      hostname: null,
      hash: null,
      search: '?a=b',
      query: 'a=b',
      pathname: '/foo/bar',
      path: '/foo/bar?a=b',
      href: '/foo/bar?a=b' }
    */
}).listen(80);
```
- url.format
    - 将一个URL对象转换为URL字符串
- url.resolve
    - 拼接url

### querystring
```js
querystring.parse('foo=bar&baz=qux&baz=quux&corge');
/* =>
{ foo: 'bar', baz: ['qux', 'quux'], corge: '' }
*/

querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
/* =>
'foo=bar&baz=qux&baz=quux&corge='
*/
```

### zlib
```js
// 数据压缩
http.createServer(function (request, response) {
    let i = 1024,
        data = '';

    while (i--) {
        data += '.';
    }

    if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
        zlib.gzip(data, function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            });
            response.end(data);
        });
    } else {
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end(data);
    }
}).listen(80);
```

### process
- process.env 环境变量，例如通过process.env.NODE_ENV获取不同环境项目配置信息
- process.nextTick 谈及EventLoop时经常会提到
- process.pid 获取当前进程的id
- process.ppid 获取当前进程的父进程id
- process.cwd() 获取当前进程工作目录
- process.platform 获取当前进程的操作系统平台
- process.uptime() 当前进程的已运行时间
- process.on(‘uncaughtException’, cb) 捕获异常信息
- process.on(‘exit’, cb）进程推出监听
- process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出

### 参数解析工具
- yargs-parser

### 退出进程
- process.exit()

### IO重定向
- 进程将输出给文件 `cat a.txt > b.txt`
    - `>` 覆盖重定向
    - `>>` 追加重定向
- 进程将结果给管道 `ls | xargs -l {} rm {}`

### 标准输入输出流
- process.stdin
- process.stdout
- process.stderr

### 创建缓冲区
```js
const buf = Buffer.from('你好');

const buf = Buffer.alloc(1024 * 4); // 每个字节都是0

const buf = Buffer.allocUnsafe(1024 * 4); // 每个字节的值不确定，推荐使用这种方法！！！

buf.length; // Buffer内部的字节数
```

### Buffer工作起来像数组
```js
const buf = Buffer.from('Hello');

const newBuf = buf.slice(0, 2);
newBuf[1]++; // e => f

console.log(newBuf.toString('utf8')); // Hf
console.log(buf.toString('utf8')); // Hfllo
```
**结论**：新旧buffer都会被修改

### 流是什么？
- 流是随着时间产生的数据

### 缓冲区的作用
- 提高速度
- 节省内存空间

### Nodejs异步
```js
const fs = require('fs');

// 阻塞，eventloop也不会执行，在接受到数据之前程序什么也做不了
const data = fs.readFileSync('a.txt', 'utf8');

// 非阻塞，在eventloop注册一个回调，收到通知后执行回调
fs.readFile('a.txt', 'utf8', function(err, data) {

});
```

### 阻塞和同步
**同步不代表阻塞**，如 `await`
- 以下是同步非阻塞代码例子
```js
await fetch('...'); // 代码层面上是同步的，但是 是一个非阻塞的程序
```

### 异步编程
- 将异步程序同步化

### 将文件转化为pdf的例子
[toPdf](https://github.com/mm-core/server/blob/0ce119396d8d1dc288bb5ee831c25a6b73cc0a0c/src/routers/file/file.ts#L223)

### 进程
- child_process
```js
import { fork, execSync, exec, execFile, spawn, spawnSync } from 'child_process';
import { resolve } from 'path';

const child = fork(resolve(__dirname, 'a.js')); // 开启一个子进程并执行js文件，在ts环境下也可以fork ts文件

child.send('message'); // 向子进程发送消息

child.on('message', () => {
    // 接受子进程发来的消息
})
```

```js
// a.js

process.send('111'); // 向父进程发送消息

process.on('message', () => {
    // 监听父进程发送过来的消息
})
```

### 网络
```js
import { createServer, Scoket } from 'net';

const server = createServer((socket) => {
    socket.write('hello'); // 向客户段发送信息
});

const client = new Socket();
client.connect(3000, '127.0.0.1', () => {
    client.write('hello');
});

client.on('data', data => {
    console.log(data.toString('utf8'));
    client.destory();
});
```

### 加密解密
```js
import { createHash, createCipheriv, randomBytes, createDecipheriv } from 'crypto';

// 摘要算法
const password = '123456';
const md5Password = createHash('md5').update(password).digest('hex');
const shaPassword = createHash('sha256').update(password).digest('hex');

// 对称加密
const key = randomBytes(32);
const iv = randomBytes(16);

const chipher = createCipheriv('aes-256-gcm', key, iv);
const buffer = chipher.update('123456');

const dechipher = createDecipheriv('aes-256-gcm', key, iv);
const output = dechipher.update(buffer);

console.log(output.toString('utf8'));
```

非对称加密
```js
import RSA from 'node-rsa';
```