# AeroChart
基于[Bootstrap](www.bootcss.com)自己做的图表jQuery插件，主要用在了MES车间看板系统里面。目前放在github上的只有进度条插件，外观基本和bootstrap一致，然后额外加了一些功能。

>PS: README一写，突然就感觉好高端了

## Installation
```html
<link rel="stylesheet" href="bootstrap.min.css">
<script src="jquery-2.0.3.min.js"></script>
<script src="aerochart.js"></script>
```


## Overview
* pregressbar:进度条上可以自定义文本内容，进度值也全部放在了js代码里面，文字高度和位置自适应。


## Usage
###progressbar
```javascript
$('.progress .progress-bar').progressbar({
    current_value:30,
    max_value:100,
    min_value:0,
    text_format:'$per%,剩$rem工时',
    display_text:'center'
});
```
别的options不需要多说明了。主要是进度条内容text_format，使用通配符替换：
* $now: 当前值
* $max,$min:最大最小值
* $per:当前百分比
* $rem:剩余值
