# 项目卡片查看入口实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在 6 张带 GitHub URL 的项目卡片底部显示明确的「去查看 →」文案，同时让无 URL 的「爱支招」不显示操作入口。

**架构：** 保留当前整卡 `<a>` 链接结构，仅在 `renderProjects()` 中按 `p.url` 条件渲染操作文案；继续使用现有 `.card__arrow` 样式和悬浮动效。扩展现有 Node.js 回归测试，并用浏览器验证文案数量和点击目标。

**技术栈：** 原生 JavaScript、CSS、Node.js `node:test`、Playwright。

---

## 文件结构

- 修改：`tests/featured-projects.test.cjs`——验证 6 个「去查看 →」入口及「爱支招」无入口。
- 修改：`script.js`——根据项目 URL 条件渲染明确的查看文案。

### 任务 1：为链接卡片增加明确操作文案

**文件：**
- 修改：`tests/featured-projects.test.cjs:114`
- 修改：`script.js:29`

- [ ] **步骤 1：编写失败测试**

在「六个 GitHub 项目渲染为安全的整卡外链」测试中加入：

```js
assert.equal((markup.match(/<span class="card__arrow">去查看 <span aria-hidden="true">→<\/span><\/span>/g) || []).length, 6);
assert.doesNotMatch(markup, /↗/);
```

- [ ] **步骤 2：运行测试并确认正确失败**

运行：`node --test tests/featured-projects.test.cjs`

预期：FAIL；当前渲染仍包含 7 个 `↗`，尚无「去查看 →」文案。

- [ ] **步骤 3：编写最少实现**

在 `renderProjects()` 的每次映射中根据 `p.url` 生成操作文案：

```js
const action = p.url
  ? '<span class="card__arrow">去查看 <span aria-hidden="true">→</span></span>'
  : "";
```

用 `${action}` 替换当前无条件输出的 `<span class="card__arrow" aria-hidden="true">↗</span>`。整卡链接、`target`、`rel`、焦点样式和布局保持不变。

- [ ] **步骤 4：运行测试并确认通过**

运行：`node --test tests/featured-projects.test.cjs`

预期：3 项测试全部 PASS。

- [ ] **步骤 5：浏览器验收**

使用本地静态服务器与 Playwright 验证：

```python
actions = page.locator("#projectsList .card__arrow")
assert actions.count() == 6
assert actions.all_text_contents() == ["去查看 →"] * 6
assert page.locator("#projectsList article.card .card__arrow").count() == 0
```

同时复测 6 张链接卡片均保留正确的 `href`、`target="_blank"` 和 `rel="noopener noreferrer"`。

- [ ] **步骤 6：提交并推送**

```bash
git add tests/featured-projects.test.cjs script.js docs/superpowers/plans/2026-08-24-project-card-view-link.md
git commit -m "feat: 明确项目查看入口"
git push origin main
```
