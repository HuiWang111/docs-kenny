# Vue SFC Compile
Vue中单文件组件的编译主要使用 `@vue/compiler-sfc` 工具，但是由于 `@vue/compiler-sfc` 目前不具备将 `vast` 转换成代码，因此这里介绍另一种方式来实现单文件组件的编译。

## 
```ts
/* eslint-disable @typescript-eslint/no-var-requires */
import { HtmlParser } from '@starptech/webparser'
import type HastUtil from '@starptech/hast-util-from-webparser'
// TODO: cjs 模块使用 import 导入无法正确使用
const fromWebparser = require('@starptech/hast-util-from-webparser')
const toHTML = require('@starptech/prettyhtml-hast-to-html')
const prettyhtml = require('@starptech/prettyhtml')

const htmlParser = new HtmlParser();

export type HastNode = ReturnType<typeof HastUtil>

export const HTML = {
  parse(code: string): HastNode {
    return fromWebparser(htmlParser.parse(code, '').rootNodes);
  },
  stringify(
    hast: HastNode,
    prettyOptions: Parameters<typeof prettyhtml>[1] = {},
  ) {
    let code: string = toHTML(hast);
    if (prettyOptions) {
      code = prettyhtml(code, prettyOptions).contents;
    }
    return code;
  },
}
```


