#!/bin/bash

# 2048 Pet Version - 部署脚本
# 自动上传更新的文件到 CloudBase 静态托管

echo "🚀 开始部署 2048 宠物版..."
echo ""

# 环境变量
ENV_ID="awesome-3grooch968c29fd1"

# 检查 CloudBase CLI 是否安装
if ! command -v tcb &> /dev/null; then
    echo "❌ CloudBase CLI 未安装"
    echo "请先安装: npm install -g @cloudbase/cli"
    echo "然后运行: tcb login"
    exit 1
fi

echo "📤 上传文件到静态托管..."
echo ""

# 上传 index.html
echo "⬆️  上传 index.html..."
tcb hosting upload index.html -e $ENV_ID

# 上传 game.js
echo "⬆️  上传 game.js..."
tcb hosting upload game.js -e $ENV_ID

echo ""
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址："
echo "   https://awesome-3grooch968c29fd1-1398617316.tcloudbaseapp.com/?v=$(date +%s)"
echo ""
echo "💡 提示：CDN 缓存可能需要 1-3 分钟刷新"
echo ""
