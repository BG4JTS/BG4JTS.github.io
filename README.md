# 小学毕业纪念页面

这是一个为小学毕业创建的交互式纪念网页。

## 功能

*   **动态身份显示**: 根据访问链接的ID，显示为教师或学生身份。
*   **本地聊天室**: 一个使用浏览器`localStorage`的简单聊天室，可以设置昵称并发送消息。
*   **毕业记忆翻牌**: 一个简单的翻牌配对小游戏。
*   **毕业赠言生成器**: 随机生成一条毕业赠言。
*   **联系方式 & 博客**: 展示个人联系方式和博客链接。

## 使用方法

### 访问

直接访问主页会默认显示学生页面。

要以特定身份访问，请使用以下格式的链接：

`https://bg4jts.github.io/graduation_commemoration/XX`

其中 `XX` 是您的编号:
*   **1-3**: 教师身份
*   **4-20**: 学生身份

例如:
*   `https://bg4jts.github.io/graduation_commemoration/02` (教师)
*   `https://bg4jts.github.io/graduation_commemoration/15` (学生)

### 部署

这是一个基于Jekyll的静态网站，部署在GitHub Pages上。所有更改推送到`main`分支后会自动部署。
