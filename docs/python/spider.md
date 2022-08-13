# 爬虫基础
- 正则
    - match方法
    ```python
    import re

    info = "姓名：bobby 生日：1987年10月1日 本科：2005年9月1日"

    print(re.findall("\d{4}", info))

    # match是从最开始匹配的，因此前面需要加上.*
    # match匹配是贪婪模式，匹配最长符合的字符串，因此.*后需要加上?
    match_res = re.match(".*生日.*？(\d{4})", info); # _sre.SRE_Match Object
    # 利用（）进行分组
    # group传0是整个匹配字符串，1是第一个分组，一次类推
    print(match_res.group(1)); # 1987
    # 第三个参数模式：
    # re.I 忽略大小写
    # re.DOTALL 不会因为回车换行符结束匹配

    sub_res = re.sub("\d{4}", "2019", info);
    print(sub_res) # 搜索4位数字都替换成2019
    ```

    - match与search方法的区别
        - search不要求必须从开开始匹配
        - match只能匹配单行（匹配的截止位置就是回车换行符），除非用re.DOTALL

### BeautifulSoup
```shell
workon spider # 切换到某一个虚拟环境
pip list # 查看已经安装的包
pip install beautifulsoup4
```
```python
from bs4 import BeautifulSoup
import re

html = """
<html>
</html>
"""

bs = BeautifulSoup(html, "html.parser")
title_tag = bs.title # 返回Tag类，点取发只能取到满足条件的第一个
title_tag.string # 获取title中的文本

bs.find('div') # 也只能取到满足条件的第一个
div_tags = bs.find_all('div') # 取到所有

for div_tag in div_tags:
    print(div_tag.string)
    

bs.find(id='info')
bs.find('div', id='info')
bs.find('div', id=re.compile('post-\d+'))
bs.find(string='') # 利用标签中的文本查找
```

### 如何解决python包安装慢的问题
- [Unofficial Windows Binaries for Python Extension Packages](https://www.lfd.uci.edu/~gohlke/pythonlibs/)

### xpath
- 简介
    - xpath使用路径表达式在xml和html中进行导航
    - xpath包含标准函数库
    - xpath是一个w3c的标准

- xpath语法 
    - 最后三行的语法为
        - `//div/a | //div/p`
        - `//span | //ul`
        - `article/div/p | span`
        
| 语法                   | 含义                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| article                | 选取所有article元素的所有子节点                                           |
| /article               | 选取根元素article                                                         |
| /article/a             | 选取所有属于article的子元素的a元素                                        |
| //div                  | 选取所有div的子元素（不论出现在文档任何地方）                             |
| article//div           | 选取所有属于article元素的后代的div元素，不管它出现在article之下的任何位置 |
| //@class               | 选取所有名为class的属性                                                   |
| /article/div[1]        | 选取输入article子元素的第一个div元素                                      |
| /article/div[last()]   | 选取输入article子元素的最后一个div元素                                    |
| /article/div[last()-1] | 选取输入article子元素的倒数第二个div元素                                  |
| //div[@lang]           | 选取所有拥有lang属性的div元素                                             |
| //div[@lang='eng']     | 选取所有拥有lang属性为eng的div元素                                        |
| /div/*                 | 选取div元素的所有子节点                                                   |
| //*                    | 选取所有元素                                                              |
| //div[@*]              | 选取所有带属性的div元素                                                   |
|                        | 选取div元素的a和p元素                                                     |
|                        | 选取文档中的span元素和ul元素                                              |
|                        | 选取文档中article的div的p元素以及文档中的span元素                         |

```python
from scrapy import Selector

sel = Selector(text=html)
# xpath方法返回的是SelectorList extract方法提取html字符串数组
# text()提取标签下的文字
tag = sel.xpath("//*[id='info']/div/p[1]/text()").extract()[0]
 
# contains方法
teacher_tag = sel.xpath("//div[contains(@class， 'teacher_info')]/p")
 
# 获取属性的值
teacher_tag_class = sel.xpath("//div[contains(@class， 'teacher_info')]/@class"). extract()
```

### css选择器
```python
from scrapy import Selector

sel = Selector(text=html)

teacher_info_tag = sel.css(".teacher_info")

# ::text获取标签中的文本值
teacher_info_tag_text = sel.css(".teacher_info::text")
```