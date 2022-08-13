# Decorator

## 类方法装饰
```ts
class Log {
    print(message) {
        console.log(message)
    }
}

function wrapper(target, property) {
    const oldMethod = target.prototype[property];
    return (msg) => {
        const message = `[${msg}]`
        oldMethod(message)
    }
}

wrapper(Log, 'print')

const log = new Log()
log.print('Hello') // [Hello]
```

## 注解风格装饰器
```ts
function decorate(target, property, descriptor) {
    const oldValue = descriptor.value
    descriptor.value = function(msg) {
        const message = `[${msg}]`
        oldValue.call(null, message)
    }
    return descriptor
}

class Log {
    @decorate
    print(message) {
        console.log(message)
    }
}
```
