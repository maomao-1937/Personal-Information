const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");

const expectedProjects = [
  [
    "AI Conversation Quality Inspector",
    "AI 自动质检销售/客服对话，定位问题并给出改进建议。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/AI%20Conversation%20Quality%20Inspector"
  ],
  [
    "ExplainBack",
    "基于费曼学习法，通过 AI 追问帮助用户真正理解知识。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/ExplainBack"
  ],
  [
    "Learning Supervision and Planning Assistant",
    "用任务、番茄钟和打卡，帮助用户持续推进学习。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/Learning%20Supervision%20and%20Planning%20Assistant"
  ],
  [
    "MeetingMemo",
    "自动整理会议内容，提取结论、待办、负责人和截止时间。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/MeetingMemo"
  ],
  [
    "ShipCheck",
    "根据 PRD 自动验收网页，找出未完成需求并给出证据。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/ShipCheck"
  ],
  [
    "灵感星图",
    "把零散收藏和灵感，转化为可以快速验证的项目想法。",
    "https://github.com/maomao-1937/Personal-Projects/tree/main/%E7%81%B5%E6%84%9F%E6%98%9F%E5%9B%BE"
  ]
];

function loadSiteConfig() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const scripts = Array.from(html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g));
  const configScript = scripts.map((match) => match[1]).find((source) => source.includes("window.SITE"));
  assert.ok(configScript, "index.html should contain the window.SITE configuration");

  const sandbox = { window: {} };
  vm.runInNewContext(configScript, sandbox);
  return sandbox.window.SITE;
}

function renderProjects(site) {
  const makeElement = () => ({
    innerHTML: "",
    style: {},
    classList: { add() {}, remove() {}, toggle() { return false; } },
    addEventListener() {},
    querySelectorAll() { return []; },
    setAttribute() {}
  });

  const projectsList = makeElement();
  const elements = new Map([
    ["#projectsList", projectsList],
    ["#whatIDo", makeElement()],
    ["#platformsList", makeElement()],
    ["[data-socials]", makeElement()],
    ["#scrollProgress", makeElement()],
    ["#nav", makeElement()],
    ["#navToggle", makeElement()],
    ["#navLinks", makeElement()]
  ]);
  const IntersectionObserver = class {
    observe() {}
    unobserve() {}
  };
  const document = {
    documentElement: { scrollHeight: 0, clientHeight: 0, scrollTop: 0 },
    querySelector: (selector) => elements.get(selector) || null,
    querySelectorAll: () => [],
    addEventListener: (event, callback) => {
      if (event === "DOMContentLoaded") callback();
    }
  };
  const window = {
    SITE: site,
    IntersectionObserver,
    addEventListener() {},
    scrollY: 0
  };

  vm.runInNewContext(fs.readFileSync(path.join(root, "script.js"), "utf8"), {
    document,
    IntersectionObserver,
    window
  });
  return projectsList.innerHTML;
}

test("精选项目配置保留爱支招并准确加入六个项目", () => {
  const site = loadSiteConfig();
  const titles = Array.from(site.projects, ({ title }) => title);
  const actualProjects = Array.from(
    site.projects.slice(1),
    ({ title, description, url }) => [title, description, url]
  );

  assert.deepEqual(titles, ["爱支招", ...expectedProjects.map(([title]) => title)]);
  assert.deepEqual(actualProjects, expectedProjects);
  assert.equal(site.projects[0].url, undefined);
});

test("六个 GitHub 项目渲染为安全的整卡外链", () => {
  const markup = renderProjects(loadSiteConfig());
  const linkedCards = Array.from(
    markup.matchAll(/<a class="card card--link reveal"[\s\S]*?<\/a>/g),
    (match) => match[0]
  );
  const unlinkedCard = markup.match(/<article class="card reveal"[\s\S]*?<\/article>/)?.[0];

  assert.equal(linkedCards.length, 6);
  assert.equal((markup.match(/<article class="card reveal"/g) || []).length, 1);
  assert.equal((markup.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 6);
  assert.equal((markup.match(/<span class="card__arrow">去查看 <span aria-hidden="true">→<\/span><\/span>/g) || []).length, 6);
  assert.doesNotMatch(markup, /↗/);
  linkedCards.forEach((card) => assert.match(card, /<span class="card__arrow">去查看/));
  assert.ok(unlinkedCard);
  assert.doesNotMatch(unlinkedCard, /card__arrow|去查看/);
  expectedProjects.forEach(([, , url]) => assert.match(markup, new RegExp(`href="${url}"`)));
});

test("链接卡片提供可见的键盘焦点", () => {
  const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  assert.match(styles, /\.card--link:focus-visible/);
});
