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
* pregressbar:进度条上可以自定义文本内容，文字高度和位置自适应。可以根据数值自动改变进度条主题。


## Usage
###progressbar
```html
<div class="aero-bar" data_c="70" aria-valuemin="0" aria-valuemax="100">分流板，共700min</div>
```
```javascript
$('.aero-bar').progressbar({
    auto_theme:true,
    text_format:'$per%,剩$rem工时',
    display_text:'center'
});
```
**text_format**:使用通配符替换：
* $now: 当前值
* $max,$min:最大最小值
* $per:当前百分比
* $rem:剩余值

**auto_theme**:是否自动设置主题
