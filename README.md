<div align="center">

# 刘昶 · Chang Liu

### AI Product Manager

**🔗 在线访问：https://maomao-1937.github.io/Personal-Information/**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-在线-brightgreen)](https://maomao-1937.github.io/Personal-Information/)

</div>

---

## 📖 简介

这是我的个人主页，一个纯静态、无需构建工具的网站。深色与浅色结合的卡片式设计，blurple 紫色调，包含：

- **关于我** —— 个人定位与产品理念
- **精选项目** —— 爱支招、AI Conversation Quality Inspector、ExplainBack、Learning Supervision and Planning Assistant、MeetingMemo、ShipCheck、灵感星图
- **文章与思考** —— 公众号、小红书的文章入口
- **联系** —— 邮箱

## 🚀 在线预览

访问 👉 **https://maomao-1937.github.io/Personal-Information/** （GitHub Pages 托管，全球可访问）

## 📂 文件结构

```
├── index.html    # 页面结构 + 个性配置（window.SITE）
├── styles.css    # 设计系统（CSS 变量）
├── script.js     # 内容渲染 + 交互
└── README.md
```

## ✏️ 如何修改内容

所有个人信息集中在 `index.html` 顶部的 `window.SITE` 中：

```js
window.SITE = {
  name: "刘昶",
  nameEn: "Chang Liu",
  title: "AI Product Manager",
  email: "lc15716951535@gmail.com",
  projects: [...],   // 精选项目（可设置 GitHub URL）
  platforms: [...],  // 公众号 / 小红书
  articles: [...]    // 文章列表
};
```

改完提交推送即可，GitHub Pages 约 1 分钟内自动更新。

## 📄 License

个人主页，保留所有权利。
