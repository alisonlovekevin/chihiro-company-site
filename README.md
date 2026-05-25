# 千尋貿易合同会社 官网

传统干净 HTML 风格的企业官网。本地使用 Node 预览，部署时导出为静态 HTML，适合 Cloudflare Pages 自动部署。

## 本地预览

```powershell
npm.cmd run dev
```

打开：

```text
http://localhost:3000/
```

## 构建部署文件

```powershell
npm.cmd run build
```

构建结果会输出到：

```text
dist/
```

## Cloudflare Pages 自动部署

推荐流程：

1. 把本项目推送到 GitHub。
2. 登录 Cloudflare，进入 Pages，选择连接 GitHub 仓库。
3. 构建命令填写：

```text
npm.cmd run build
```

如果 Cloudflare 使用 Linux 环境，也可以填写：

```text
npm run build
```

4. 输出目录填写：

```text
dist
```

以后本地改完代码，只需要：

```powershell
git add .
git commit -m "Update site"
git push
```

Cloudflare Pages 会自动重新部署。
