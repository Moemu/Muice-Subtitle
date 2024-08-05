# 前言
用于通过打字的方式，在web实现动态的字幕显示效果。  

支持HTTP API，可以配合其他程序协同工作。

（本分支用于协助Muice-Vtuber的开发）  

![Demo](C:\Users\Moemu\AppData\Roaming\Typora\typora-user-images\image-20240805205327115.png)

# 使用方法

在OBS中加入浏览器源，填入网址，然后按照推流分辨率大小调整窗口大小。（网站默认大小为1920x1080）

调整该浏览器源的滤镜设置，加入色度键

# API

请求地址：/api/sendmessage，方法：POST

| 参数    | 说明               |
| ------- | ------------------ |
| user    | 弹幕发出者用户名   |
| avatar  | 弹幕发出者头像链接 |
| message | 弹幕               |
| respond | Vtuber回复         |

当正确调用时，返回：

```json
{"code": 200, "message": "OK"}
```

当错误调用/发生错误时，返回：

```json
{"code": 400, "message": "Error"}
```

# FAQ
1. 更改端口：

   修改`js/index.js`中的`server_port`常量与`app.py`中的`port`变量

2. 更改网页分辨率：

   修改`css/index.css`中的`body`下的`width`与`height`

3. 更改字体：

   修改`css/index.css`中的`tip_text`下的`family`