# NodeJS学习-2020

## 什么是nodeJS  
1. Node.js基于Chrome V8引擎的javaScript运行环境  
2. Node.js使用一个事件驱动、非阻塞式I/O的模型，使其轻量又高效  
3. Node.js的包管理器npm，是全球最大的开源库生态系统  
4. Node.js是用c++写的  
5. V8引擎是Node.js的核心  
6. Node.js是运行在服务端的javascript  

## 什么是V8引擎
1. 电脑无法识别js  
2. js引擎是让电脑识别代码  
3. V8由c++写的  

## 为什么使用Node.js  
1. 非阻塞式I/O模型 - 单线程不会被阻断，通过回调函数完成结束操作，无需等待请求响应。  
2. 事件驱动: 接受请求->请求入栈->循环判断是否有请求->执行请求。不会阻断原来的事件，也不会丢失请求。  

## 语法与实战
### 1. 入门语法 - reference
包括路径path,文件fs,操作系统os,url,事件，http模块  

### 2. express框架 - express
express框架介绍

### 3. socket.io库 - socket  
实时通信库