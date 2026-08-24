# 精选项目更新实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 保留「爱支招」，以用户提供的 6 个项目替换旧版 ExplainBack，并为新增项目提供整卡 GitHub 跳转。

**架构：** `index.html` 中的 `window.SITE.projects` 继续作为唯一数据源；`script.js` 根据项目是否含 `url` 渲染普通 `<article>` 或外链 `<a>` 卡片；`styles.css` 只补充链接卡片的键盘焦点样式。使用 Node.js 内置测试运行器和一个最小 DOM 桩验证项目数据与真实渲染结果，不新增依赖。

**技术栈：** HTML、CSS、原生 JavaScript、Node.js `node:test`、`vm`。

---

## 文件结构

- 创建：`tests/featured-projects.test.cjs`——加载真实页面配置和渲染脚本，验证 7 个项目及链接卡片输出。
- 修改：`index.html`——维护 7 个精选项目的数据、描述和 6 个 GitHub URL。
- 修改：`script.js`——根据 `url` 输出外链卡片或普通卡片。
- 修改：`styles.css`——为外链卡片添加键盘焦点样式。
- 修改：`README.md`——同步精选项目清单及项目数据字段说明。

### 任务 1：建立精选项目回归测试

**文件：**
- 创建：`tests/featured-projects.test.cjs`

- [ ] **步骤 1：编写失败测试**

测试读取 `index.html` 的首个内联脚本并在 `vm` 中获得 `window.SITE`，然后用最小 DOM 桩执行 `script.js`。断言：项目标题顺序为「爱支招 + 6 个新项目」；6 个新描述和 URL 精确匹配；「爱支招」无 URL；渲染结果包含 6 个安全外链卡片和 1 个普通卡片；CSS 包含链接卡片焦点样式。

```js
const expectedProjects = [
  ["AI Conversation Quality Inspector", "AI 自动质检销售/客服对话，定位问题并给出改进建议。", "https://github.com/maomao-1937/Personal-Projects/tree/main/AI%20Conversation%20Quality%20Inspector"],
  ["ExplainBack", "基于费曼学习法，通过 AI 追问帮助用户真正理解知识。", "https://github.com/maomao-1937/Personal-Projects/tree/main/ExplainBack"],
  ["Learning Supervision and Planning Assistant", "用任务、番茄钟和打卡，帮助用户持续推进学习。", "https://github.com/maomao-1937/Personal-Projects/tree/main/Learning%20Supervision%20and%20Planning%20Assistant"],
  ["MeetingMemo", "自动整理会议内容，提取结论、待办、负责人和截止时间。", "https://github.com/maomao-1937/Personal-Projects/tree/main/MeetingMemo"],
  ["ShipCheck", "根据 PRD 自动验收网页，找出未完成需求并给出证据。", "https://github.com/maomao-1937/Personal-Projects/tree/main/ShipCheck"],
  ["灵感星图", "把零散收藏和灵感，转化为可以快速验证的项目想法。", "https://github.com/maomao-1937/Personal-Projects/tree/main/%E7%81%B5%E6%84%9F%E6%98%9F%E5%9B%BE"]
];

assert.deepEqual(site.projects.map(({ title }) => title), ["爱支招", ...expectedProjects.map(([title]) => title)]);
assert.deepEqual(site.projects.slice(1).map(({ title, description, url }) => [title, description, url]), expectedProjects);
assert.equal(site.projects[0].url, undefined);
assert.equal((projectsList.innerHTML.match(/<a class="card card--link reveal"/g) || []).length, 6);
assert.equal((projectsList.innerHTML.match(/<article class="card reveal"/g) || []).length, 1);
assert.equal((projectsList.innerHTML.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 6);
assert.match(styles, /\.card--link:focus-visible/);
```

- [ ] **步骤 2：运行测试并确认正确失败**

运行：`node --test tests/featured-projects.test.cjs`

预期：FAIL；标题数组仍为现有的「爱支招、ExplainBack」，且尚未渲染 6 个链接卡片。

- [ ] **步骤 3：提交测试**

```bash
git add tests/featured-projects.test.cjs docs/superpowers/plans/2026-08-24-featured-projects.md
git commit -m "test: 覆盖精选项目列表和链接"
```

### 任务 2：更新项目数据和卡片链接

**文件：**
- 修改：`index.html:25`
- 修改：`script.js:25`
- 修改：`styles.css:405`

- [ ] **步骤 1：更新项目配置**

保留「爱支招」对象不变；用规格中的 6 个对象替换旧 ExplainBack。每个新对象包含精确的 `title`、`description` 和 `url`，并统一设置 `tag: "AI 项目"`；不添加未经确认的 `stack`。

- [ ] **步骤 2：最小化实现链接卡片渲染**

在 `renderProjects()` 中根据 `p.url` 生成标签：

```js
const tag = p.url ? "a" : "article";
const linkAttrs = p.url
  ? ` href="${p.url}" target="_blank" rel="noopener noreferrer"`
  : "";
const linkClass = p.url ? " card--link" : "";

return `
  <${tag} class="card${linkClass} reveal"${linkAttrs}>
    <!-- 沿用现有卡片内容 -->
  </${tag}>
`;
```

- [ ] **步骤 3：增加键盘焦点样式**

```css
.card--link:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}
```

- [ ] **步骤 4：运行测试并确认通过**

运行：`node --test tests/featured-projects.test.cjs`

预期：PASS，1 个测试文件无失败。

- [ ] **步骤 5：提交实现**

```bash
git add index.html script.js styles.css
git commit -m "feat: 更新精选项目及外链"
```

### 任务 3：同步文档并完成验证

**文件：**
- 修改：`README.md:20`

- [ ] **步骤 1：更新 README**

把精选项目说明更新为「爱支招、AI Conversation Quality Inspector、ExplainBack、Learning Supervision and Planning Assistant、MeetingMemo、ShipCheck、灵感星图」，并在配置示例中标注 `projects` 可包含项目 GitHub URL。

- [ ] **步骤 2：运行完整验证**

运行：

```bash
node --test
git diff --check HEAD~2
git status --short
```

预期：Node.js 测试全部通过；无空白错误；工作区只包含本任务预期的 README 修改。

- [ ] **步骤 3：提交文档**

```bash
git add README.md
git commit -m "docs: 同步精选项目清单"
```

- [ ] **步骤 4：最终需求核对**

逐项对照设计规格中的 7 条验收标准，并通过 `git show --stat --oneline HEAD~3..HEAD` 确认提交只涉及规格、计划、测试、项目内容、渲染、样式与 README。
