# AutoJS6 自动化与 UI 重点笔记

## 先记一个重要现实

从官方文档结构上看，`Automator` 和 `UI` 都是核心章节，但其中有部分内容仍然写着“待补充”。

这意味着：

- 可以把官方文档当主参考
- 但不能把它当“每一步都写得特别细”的保姆手册

所以项目里一定要自己沉淀二次文档。

## Automator 章节的真实价值

官方把自动化相关能力拆成：

- `SimpleActionAutomator`
- `RootAutomator`
- `AutomatorConfiguration`
- `UiSelector`
- `UiObject`
- `UiObjectCollection`
- `UiObjectActions`

这里最重要的不是前面三个名词，而是后面四个对象模型。

### 你应该这样理解它们

- `UiSelector`：找谁
- `UiObject`：找到的那个控件
- `UiObjectCollection`：找到的一组控件
- `UiObjectActions`：对控件做什么

这套模型是后面“登录输入、勾选协议、点按钮、选区”的基础。

## 对项目设计的启发

后面新项目不要一开始就把“点击、输入、校验、回退”揉成一个超大函数。

更好的拆法应该是：

- `findXxx`
- `ensureXxx`
- `tapXxx`
- `inputXxx`
- `verifyXxx`

这样一旦失败，日志会停在明确的小步骤上。

## UI 章节最关键的一点

官方 UI 章节有一条很关键：

- 带 UI 的脚本必须在最前面写 `"ui";`

这是 UI 脚本和普通脚本的模式切换开关。

你后面如果要给新项目做配置面板、调试面板、浮窗切换入口，这一点必须单独记住。

## UI 章节的另一个重点

官方明确说，AutoJS6 的 UI 系统来自 Android，本身很多属性和方法可以回到 Android 官方文档理解。

这条很重要，因为它说明：

- AutoJS6 UI 不是完全独立设计的一套 DSL
- 它和 Android View / Widget 思维是一致的
- 遇到布局、属性、行为问题时，可以借 Android 的知识来理解

## 对你后续迁移的直接建议

### 登录页

优先尝试：

- 控件选择器
- 控件动作
- 目标控件状态校验

不要一开始就退回找图。

### 日常任务页

优先尝试：

- 图像匹配
- 状态判断
- 小步骤点击

不要把一整条任务链路写成一个超长函数。

### 悬浮控制

建议当前项目继续保持分层：

- `main.js` 只做入口
- `modules/*.js` 放公共能力与业务流程
- 若后续需要悬浮调试，再单独引入 `ui.js`

## 当前最适合的学习顺序

如果只盯迁移落地，不做学术式通读，建议顺序：

1. `UiSelector`
2. `UiObject`
3. `UiObjectActions`
4. `Image`
5. `Floaty`
6. `UI`
7. `Thread`

## 当前结论

后面新项目最重要的不是“API 有没有”，而是先立好这套工程纪律：

- 控件优先
- 图像兜底
- 小函数
- 强校验
- 日志明确

官方参考：

- [Automator - 自动化](https://docs.autojs6.com/#/automator)
- [UiSelector - 选择器](https://docs.autojs6.com/#/uiSelectorType)
- [UiObject - 控件节点](https://docs.autojs6.com/#/uiObjectType)
- [UiObjectActions - 控件节点行为](https://docs.autojs6.com/#/uiObjectActionsType)
- [UI - 用户界面](https://docs.autojs6.com/#/ui)
