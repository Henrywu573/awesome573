# 🐼 2048 熊猫堂版 - 合成游戏

一个基于 CloudBase 部署的熊猫堂主题 2048 游戏，使用熊猫堂成员的真实照片。

[![Powered by CloudBase](https://7463-tcb-advanced-a656fc-1257967285.tcb.qcloud.la/mcp/powered-by-cloudbase-badge.svg)](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit)

## 🎮 游戏特色

- 👥 **熊猫堂成员**: 11张真实成员照片作为游戏元素
- 🎨 **独特美学设计**: Playful/toy-like 风格，温馨可爱的玩具盒美学
- ⌨️ **多种操作方式**: 支持键盘方向键和触摸滑动操作
- 💾 **本地存储**: 自动保存最高分和游戏状态
- ↩️ **撤销功能**: 支持撤销最多10步操作
- 📱 **响应式设计**: 完美适配桌面和移动设备

## 🎯 游戏玩法

1. 使用方向键（↑↓←→）或触摸滑动移动方块
2. 相同成员合并后升级
3. 目标：合成最终的堂主（2048）
4. 可以使用撤销按钮悔棋

## 🏗️ 项目架构

### 技术栈
- **前端**: HTML5 + Vanilla JavaScript + Tailwind CSS
- **字体**: Google Fonts (Fredoka One, Poppins)
- **图标**: FontAwesome 6.4
- **部署**: CloudBase 静态托管

### 文件结构
```
2048-xiongmaotang/
├── index.html          # 游戏主页面
├── game.js            # 游戏核心逻辑
├── images/            
│   └── xiongmaotang/  # 熊猫堂成员照片 (11张)
└── README.md          # 项目说明
```

## 🚀 CloudBase 部署

部署到 CloudBase 静态托管即可使用。

## 🎨 设计规范

### 美学方向
- **风格**: Playful/toy-like（温馨可爱的玩具盒美学）
- **色彩**: 珊瑚粉(#FF6B6B) + 柔和黄(#FFD93D) + 奶油白(#FFF8E7)
- **字体**: Fredoka One (标题) + Poppins (正文)
- **布局**: 不对称布局，错落有致的卡片设计

## 📝 开发说明

本项目基于 [**CloudBase AI ToolKit**](https://github.com/TencentCloudBase/CloudBase-AI-ToolKit) 开发。

## 📄 许可证

MIT License
