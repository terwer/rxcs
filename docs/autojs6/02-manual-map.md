# AutoJS6 使用手册地图

## 手册怎么用

官方文档的 `Manual` 本质上是一个总目录，不是线性教程。

它更像：

- 模块总索引
- API 分类入口
- 概念章节与类型章节的混合导航

所以看手册时不要从头到尾硬啃，而要按任务场景切着看。

## 按任务拆分的查阅路径

### 启动 App / 切应用 / 回到桌面

优先看：

- `App`
- `AutoJs6`
- `Global`
- `Device`

### 无障碍控件点击 / 文本识别 / 控件树操作

优先看：

- `Automator`
- `UiSelector`
- `UiObject`
- `UiObjectActions`

### 图像匹配 / OCR / 按钮找图

优先看：

- `Image`
- `OCR`
- `Color`

### 悬浮窗和手动调试面板

优先看：

- `Floaty`
- `UI`
- `Dialog`
- `Canvas`

### 异步任务 / 长流程调度

优先看：

- `Thread`
- `Continuation`
- `Event`
- `Timer`
- `Task`

### 日志 / 控制台 / 通知

优先看：

- `Console`
- `Toast`
- `Notice`

## 对游戏脚本最重要的章节

结合你后面要做的“启动、登录、选区、日常任务”，最实用的是这几组：

### 第一层：基础动作

- `Global`
- `Automator`
- `App`
- `Device`

### 第二层：控件与图像

- `UiSelector`
- `UiObject`
- `UiObjectActions`
- `Image`
- `OCR`

### 第三层：工程化

- `Floaty`
- `UI`
- `Thread`
- `Timer`
- `Console`

## FAQ 章节值得重点留意的主题

官方 Q&A 目录里，至少这些主题值得后续补读：

- 文档格式不统一
- 内容难理解
- OCR 特性
- 区域截图
- 定时运行脚本
- 不同系统版本
- 不同设备厂商
- 不同 AutoJs6 版本
- 图片等资源共同打包及多脚本打包
- 打包应用不显示主界面

这些问题都和你后面真正跑脚本时会遇到的坑高度相关。

## 建议的沉淀顺序

后续继续往 `docs/autojs6` 补文档时，我建议顺序是：

1. 控件与自动化
2. 图像与 OCR
3. 悬浮窗/UI
4. 线程、定时与任务
5. 打包与疑难解答

## 当前结论

官方手册本身已经足够作为“查 API 的源头”，但不够当“项目内开发手册”。  
所以本地沉淀应该做的事不是复制 API，而是给出：

- 按任务的阅读顺序
- 哪个模块解决什么问题
- 哪些章节先学
- 遇到什么问题优先回哪个章节

官方参考：

- [使用手册 (Manual)](https://docs.autojs6.com/#/manual)
- [疑难解答 (Q&A)](https://docs.autojs6.com/#/qa)
