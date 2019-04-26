---
title: Evernote基于nodeJS的API说明
date: 2014-11-22
tags: ["青涩的老文章"]
---
# Evernote基于nodeJS的API说明

前一段时间有幸通过了evernote的实习，中间有一个full stack测验工程实在让我头疼了一阵，工程是这样的：
> 用任意一种后端语言，通过evernote的api获取各种数据，然后在前端响应式的显示出来

刚拿到这个任务的时候觉得挺简单的，但是实际上evernote的api写的实在是有些模糊。

* 这里是api的链接 https://dev.yinxiang.com/doc/reference/
* 这里是Evernote node的sdk https://github.com/evernote/evernote-sdk-js

发现网络上的资料不是很多，所以想写一些东西，让后来者少走弯路

----

### 第一坑：

首先，你要知道所有你调用的Node API的回调函数中的传入参数中error必须是第一个
![Evernote NodeJS API](../static/images/node-api.png)
这是印象笔记官网上的实例教程，你如果复制粘贴到你的代码中，你得到的结果一定是`undefined`
这是为什么呢，因为他传入回调函数的参数少了一个error…这个bug让我一开始找到死啊。。

----

### 第二坑：

bodyHash数组转16进制字符串

使用情景是：你收到的整篇文章是通过evernote特殊编码的，（详情请见：Evernote Markup Language https://dev.yinxiang.com/doc/articles/enml.php ）当你要将里面的en-media换成img时你要经历那么几步：

1. 通过getNote将resources的参数设为true，接受所有img附件
2. 此时接受的附件是乱序的，唯一表示他的是bodyHash这个10进制数的数组
3. 将bodyHash的10进制数组转换为16进制字符串，与en-media中的hash属性去匹配 
4. 若匹配成功则用这个hash值去生成img的src

这里有写关于这个src的详情 ： https://dev.yinxiang.com/doc/articles/resources.php

----

### 第三坑：

关于oauth认证的官方github的example中已经写的很清楚了，那么坑在哪呢? 坑在你从evernote官网上申请的基本权限的api是不够用的，有些函数访问不了，而你用developeToken的时候就不会出现这种问题，如果你发现抛出错误的errorCode为3,那么很有可能就是这个问题

![](../static/images/api_permissions.png)

欢迎大家一起来讨论，说的不对的地方也请指出，谢谢~

(完)