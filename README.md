# 平行时空影业 · 地图制作组

Parallel Spacetime Pictures：一支 CS2 创意工坊地图制作组的介绍网站。

网址：<https://uuuuuuz.github.io/uuuuz.github.io/>

## 目录结构

```
index.html          首页（唯一的页面）
404.html            找不到页面时显示
favicon.svg         网站图标
assets/css/style.css  样式
assets/js/main.js     交互、成员岗位列表、报名表配置
assets/img/           配图（程序生成的原创图片）
.nojekyll           告诉 GitHub Pages 直接发布静态文件，不经过 Jekyll
```

## 常见修改

- **改招募岗位**：编辑 `assets/js/main.js` 顶部的 `ROLES`，成员卡片和报名表选项会一起更新。
- **开通报名表**：在 `assets/js/main.js` 顶部的 `APPLY_CONFIG.endpoint` 填上接收数据的地址。留空时表单显示「报名通道即将开放」。
- **改文字**：直接编辑 `index.html`。

## 本地预览

```sh
npx http-server .
```
