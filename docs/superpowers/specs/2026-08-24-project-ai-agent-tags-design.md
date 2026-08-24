# 精选项目 AI Agent 标签设计

## 目标

为「精选项目」中的每张卡片补充 3～6 个 AI Agent 能力标签。标签只允许使用用户截图中的 Agent 技术词，不展示 Next.js、FastAPI、数据库、测试框架、LLM、RAG 或 Product Design 等通用技术栈。

## 标签词表

页面只允许出现以下标签：

- `agent loop`
- `tool use`
- `permission`
- `hooks`
- `todo write`
- `subagent`
- `skill loading`
- `context compact`
- `memory`
- `task system`
- `background tasks`
- `cron scheduler`
- `agent teams`
- `mcp plugin`
- `integrated harness`
- `workflow runtime`
- `goal loop`

不为了凑数量添加没有仓库证据的标签。`context compact`、`cron scheduler`、`agent teams` 和 `mcp plugin` 等未在当前项目中发现实际使用证据，因此本次不展示。

## 证据口径

标签可以来自两类可核查证据：

1. 产品运行时能力：源代码中存在对应循环、工具调用、权限边界、持久化记忆、后台任务或工作流编排。
2. AI 开发工作流：仓库中存在 Skills、Superpowers 规格／计划或明确的技能驱动开发记录。

同一张卡片可以组合这两类标签。标签描述“该项目实际使用过的 AI Agent 能力”，不暗示所有能力都运行在面向最终用户的产品中。

## 项目标签映射

| 项目 | 展示标签 | 证据摘要 |
| --- | --- | --- |
| 爱支招 | `agent loop`、`memory`、`workflow runtime` | 根据现有情感问题分析平台描述及原有 LLM/RAG 标签，保留最小的对话循环、上下文记忆和分析流程能力；该项目没有公开仓库，属于基于现有站点信息的保守映射。 |
| AI Conversation Quality Inspector | `permission`、`skill loading`、`task system`、`workflow runtime` | 邀请码、配额和安全边界提供权限控制；Superpowers 计划证明技能驱动的任务实现；分析服务按解析、模型分析、证据校验、报告生成组成工作流。 |
| ExplainBack | `agent loop`、`skill loading`、`memory`、`goal loop` | 训练状态机持续执行回答、评估、追问、支持与复测；会话和尝试持久化；循环以掌握或待复习为目标；实现计划证明技能驱动开发。 |
| Learning Supervision and Planning Assistant | `todo write`、`skill loading`、`memory`、`task system`、`goal loop` | 项目包含任务写入、子任务树、持续学习目标和打卡记录；仓库包含 `skills-lock.json` 与完整 Prisma Skills。 |
| MeetingMemo | `permission`、`skill loading`、`background tasks`、`workflow runtime` | 摘要发送需要访问和审批边界；后台 Job Runner 执行处理；摘要 Pipeline 编排模型与校验；发布计划证明技能驱动开发。 |
| ShipCheck | `agent loop`、`tool use`、`permission`、`background tasks`、`workflow runtime`、`subagent` | 验收 Runner 逐项执行检查；BrowserSession 提供导航、截图、读 DOM、点击和输入工具；破坏性操作受权限控制；验收作为后台任务运行并由固定工作流编排；项目已确认使用 Subagent。 |
| 灵感星图 | `skill loading`、`memory`、`workflow runtime` | Superpowers 规格和执行计划证明技能驱动开发；素材和项目假设持久化；孵化流程明确编排检索、质量门、生成、校验和保存。 |

## 展示设计

- 继续复用现有 `.card__stack` 胶囊标签样式，不增加图标、说明气泡或新颜色。
- 标签使用全小写英文和空格，不显示开头或词间下划线。
- 每张卡片展示 3～6 个标签，允许自动换行。
- 保持卡片标题、描述、GitHub 链接、「去查看 →」和整卡点击行为不变。
- 不新增页面筛选、图例或标签交互。

## 数据与实现边界

- `window.SITE.projects[].stack` 继续作为唯一标签数据源。
- 本次只修改 `index.html` 中 7 个项目的 `stack` 数组，以及覆盖标签映射的回归测试。
- `script.js` 已能渲染任意 `stack` 数组，`styles.css` 已能展示并换行胶囊标签，因此不修改渲染逻辑和样式。
- README、其他栏目和项目顺序保持不变。

## 验收标准

1. 7 张项目卡片都显示 3～6 个标签。
2. 所有标签都来自指定的 17 项 AI Agent 词表，页面不展示下划线。
3. 每个项目的标签顺序和内容与本规格表一致。
4. 页面不再显示 `LLM`、`Product Design`、`RAG`、Next.js、FastAPI 等非词表标签。
5. 6 个 GitHub 整卡外链与「去查看 →」保持正确，爱支招仍保持不可点击。
6. 桌面端和移动端标签均能自然换行，不遮挡标题、描述或查看入口。
7. 自动化测试和浏览器验收全部通过。
