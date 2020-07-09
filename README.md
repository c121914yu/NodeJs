# NodeJS 学习-2020

## 什么是 nodeJS

1. Node.js 基于 Chrome V8 引擎的 javaScript 运行环境
2. Node.js 使用一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效
3. Node.js 的包管理器 npm，是全球最大的开源库生态系统
4. Node.js 是用 c++写的
5. V8 引擎是 Node.js 的核心
6. Node.js 是运行在服务端的 javascript

## 什么是 V8 引擎

1. 电脑无法识别 js
2. js 引擎是让电脑识别代码
3. V8 由 c++写的

## 为什么使用 Node.js

1. 非阻塞式 I/O 模型 - 单线程不会被阻断，通过回调函数完成结束操作，无需等待请求响应。
2. 事件驱动: 接受请求->请求入栈->循环判断是否有请求->执行请求。不会阻断原来的事件，也不会丢失请求。

## 语法与实战

### 1. 入门语法 - reference

包括路径 path,文件 fs,操作系统 os,url,事件，http 模块

### 2. express 框架 - express

express 框架介绍

### 3. socket.io 库 - socket

实时通信库

### 4. multer 库上传图片 - multer

上传文件插件

### 5. cheerio 库操作 DOM - cheerio

服务器操作 DOM，可用于爬虫。

### 6. passport 身份验证 - passport

passport 身份验证

### 7. typescript 基础 - typescript
