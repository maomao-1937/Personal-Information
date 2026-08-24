# 精选项目 AI Agent 标签实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为 7 张精选项目卡片展示 3～6 个来自指定 Agent 能力词表的可读标签，并移除普通技术栈标签和标签中的下划线。

**架构：** 保留 `window.SITE.projects[].stack` 数据接口和现有 `.card__stack` 渲染／样式，只在项目配置中补齐经过仓库证据核对的标签。扩展 Node.js 回归测试，精确约束每个项目的标签映射、数量和词表范围，再用浏览器验证桌面端与移动端布局以及现有外链行为。

**技术栈：** 原生 HTML/JavaScript/CSS、Node.js `node:test`、Playwright。

---

## 文件结构

- 修改：`tests/featured-projects.test.cjs`——定义标签词表和每个项目的期望标签，验证映射、数量、渲染结果及旧标签移除。
- 修改：`index.html`——为 7 个 `window.SITE.projects` 项目写入 AI Agent 标签数组。
- 不修改：`script.js`——现有 `renderProjects()` 已按 `stack` 数组渲染标签。
- 不修改：`styles.css`——现有 `.card__stack` 已支持胶囊标签与自动换行。

### 任务 1：用测试锁定项目标签映射

**文件：**
- 修改：`tests/featured-projects.test.cjs:7-38`
- 修改：`tests/featured-projects.test.cjs:91-106`

- [ ] **步骤 1：定义允许词表和精确映射**

在 `expectedProjects` 后加入：

```js
const allowedAgentTags = new Set([
  "agent loop",
  "tool use",
  "permission",
  "hooks",
  "todo write",
  "subagent",
  "skill loading",
  "context compact",
  "memory",
  "task system",
  "background tasks",
  "cron scheduler",
  "agent teams",
  "mcp plugin",
  "integrated harness",
  "workflow runtime",
  "goal loop"
]);

const expectedAgentTags = new Map([
  ["爱支招", ["agent loop", "memory", "workflow runtime"]],
  ["AI Conversation Quality Inspector", ["permission", "skill loading", "task system", "workflow runtime"]],
  ["ExplainBack", ["agent loop", "skill loading", "memory", "goal loop"]],
  ["Learning Supervision and Planning Assistant", ["todo write", "skill loading", "memory", "task system", "goal loop"]],
  ["MeetingMemo", ["permission", "skill loading", "background tasks", "workflow runtime"]],
  ["ShipCheck", ["agent loop", "tool use", "permission", "background tasks", "workflow runtime", "subagent"]],
  ["灵感星图", ["skill loading", "memory", "workflow runtime"]]
]);
```

- [ ] **步骤 2：添加配置与渲染断言**

新增测试：

```js
test("每个精选项目只展示经过核对的 AI Agent 标签", () => {
  const site = loadSiteConfig();

  site.projects.forEach(({ title, stack }) => {
    assert.deepEqual(Array.from(stack), expectedAgentTags.get(title));
    assert.ok(stack.length >= 3 && stack.length <= 6, `${title} 应展示 3～6 个标签`);
    stack.forEach((tag) => {
      assert.ok(allowedAgentTags.has(tag), `${title} 包含词表外标签 ${tag}`);
      assert.match(tag, /^[a-z]+(?: [a-z]+)*$/, `${title} 标签不应包含下划线`);
    });
  });

  const markup = renderProjects(site);
  const renderedTags = Array.from(
    markup.matchAll(/<div class="card__stack">([\s\S]*?)<\/div>/g),
    (match) => Array.from(match[1].matchAll(/<span>([^<]+)<\/span>/g), (tag) => tag[1])
  );

  assert.deepEqual(renderedTags, Array.from(expectedAgentTags.values()));
  assert.doesNotMatch(markup, />LLM<|>Product Design<|>RAG<|>Next\.js<|>FastAPI</);
});
```

- [ ] **步骤 3：运行测试确认失败**

运行：`node --test tests/featured-projects.test.cjs`

预期：4 项测试中新增测试 FAIL；爱支招仍是 `LLM`、`Product Design`、`RAG`，其余 6 个项目没有 `stack`。

- [ ] **步骤 4：提交失败测试**

```bash
git add tests/featured-projects.test.cjs
git commit -m "test: 锁定项目 Agent 标签映射"
```

### 任务 2：写入 AI Agent 标签数据

**文件：**
- 修改：`index.html:27-67`

- [ ] **步骤 1：替换爱支招旧标签并补齐其余项目标签**

将 7 个项目的 `stack` 配置分别写为：

```js
stack: ["agent loop", "memory", "workflow runtime"]
```

```js
stack: ["permission", "skill loading", "task system", "workflow runtime"]
```

```js
stack: ["agent loop", "skill loading", "memory", "goal loop"]
```

```js
stack: ["todo write", "skill loading", "memory", "task system", "goal loop"]
```

```js
stack: ["permission", "skill loading", "background tasks", "workflow runtime"]
```

```js
stack: ["agent loop", "tool use", "permission", "background tasks", "workflow runtime", "subagent"]
```

```js
stack: ["skill loading", "memory", "workflow runtime"]
```

这些数组按 `爱支招`、`AI Conversation Quality Inspector`、`ExplainBack`、`Learning Supervision and Planning Assistant`、`MeetingMemo`、`ShipCheck`、`灵感星图` 的现有顺序写入。除 `stack` 外不修改标题、描述、链接和排序。

- [ ] **步骤 2：运行测试确认通过**

运行：`node --test tests/featured-projects.test.cjs`

预期：4 项测试全部 PASS，0 项失败。

- [ ] **步骤 3：检查差异并提交实现**

运行：

```bash
git diff --check
git diff -- index.html tests/featured-projects.test.cjs
```

预期：无空白错误；实现差异只包含 7 个 `stack` 数组，测试差异只包含词表和断言。

提交：

```bash
git add index.html
git commit -m "feat: 展示项目 Agent 技术标签"
```

### 任务 3：浏览器验收并准备集成

**文件：**
- 验证：`index.html`
- 验证：`script.js`
- 验证：`styles.css`

- [ ] **步骤 1：启动静态站点并执行桌面端验收**

在 worktree 根目录运行：

```bash
python3 -m http.server 4173
```

使用 Playwright 打开 `http://127.0.0.1:4173/`，在 1440×1000 视口验证：

```js
await expect(page.locator("#projectsList .card")).toHaveCount(7);
await expect(page.locator("#projectsList .card__stack")).toHaveCount(7);
await expect(page.locator("#projectsList .card__stack span")).toHaveCount(29);
await expect(page.locator("#projectsList .card__arrow")).toHaveCount(6);
await expect(page.locator('#projectsList a[target="_blank"][rel="noopener noreferrer"]')).toHaveCount(6);
```

逐卡读取标签并与 `expectedAgentTags` 顺序一致；确认标签没有覆盖「去查看 →」。

- [ ] **步骤 2：执行移动端验收**

将视口改为 390×844，确认：

- 项目卡片保持单列；
- 每张卡片的标签在卡片内部自动换行；
- 29 个标签全部可见且没有水平溢出；
- 6 个「去查看 →」仍位于各自链接卡片内。

- [ ] **步骤 3：执行最终验证**

运行：

```bash
node --test tests/featured-projects.test.cjs
git diff --check
git status --short
```

预期：4 项测试全部 PASS；无空白错误；工作区没有未提交的实现文件。

- [ ] **步骤 4：按 finishing-a-development-branch 流程集成**

在验证通过后，检查功能分支相对 `main` 的提交，合并 `feature/ai-agent-tags`，在 `main` 复跑测试，再推送 `origin/main`。不得覆盖或删除用户的其他分支和未提交改动。
