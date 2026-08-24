/* ============================================================
   GG-Bond 个人主页 — 交互脚本
   （个性内容在 index.html 顶部的 window.SITE 里配置）
   ============================================================ */
(function () {
  "use strict";

  const S = window.SITE || {};
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ---------- 填充个性化文本 ---------- */
  function hydrate() {
    const setText = (sel, val) => { $$(sel).forEach((el) => { el.textContent = val; }); };
    setText("[data-name]", S.name || "刘昶");
    setText("[data-nameen]", S.nameEn || "");
    setText("[data-title]", S.title || "AI Product Manager");
    setText("[data-email]", S.email || "");
    setText("[data-year]", new Date().getFullYear());

    const mail = $("[data-mail]");
    if (mail) mail.href = "mailto:" + (S.email || "");
  }

  /* ---------- 渲染精选项目 ---------- */
  function renderProjects() {
    const wrap = $("#projectsList");
    if (!wrap) return;
    wrap.innerHTML = (S.projects || []).map((p) => {
      const tag = p.url ? "a" : "article";
      const linkClass = p.url ? " card--link" : "";
      const linkAttrs = p.url
        ? ` href="${p.url}" target="_blank" rel="noopener noreferrer"`
        : "";
      const action = p.url
        ? '<span class="card__arrow">去查看 <span aria-hidden="true">→</span></span>'
        : "";

      return `
        <${tag} class="card${linkClass} reveal"${linkAttrs}>
          <span class="card__tag">${p.tag || "项目"}</span>
          <h3 class="card__title">${p.title || "未命名"}</h3>
          <p class="card__desc">${p.description || ""}</p>
          <div class="card__stack">${(p.stack || []).map((s) => `<span>${s}</span>`).join("")}</div>
          ${action}
        </${tag}>
      `;
    }).join("");
  }

  /* ---------- 渲染「我在做什么」 ---------- */
  function renderWhatIDo() {
    const wrap = $("#whatIDo");
    if (!wrap) return;
    wrap.innerHTML = (S.whatIDo || []).map((w, i) => `
      <div class="do-item reveal">
        <span class="do-item__num">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <h3 class="do-item__title">${w.title || ""}</h3>
          <p class="do-item__desc">${w.desc || ""}</p>
        </div>
      </div>
    `).join("");
  }

  /* ---------- 平台图标（内联 SVG） ---------- */
  const ICONS = {
    wechat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8c-1.3 0-2.5-.3-3.5-.8L4.5 21l1.6-4.3A8 8 0 1 1 21 12Z"/><circle cx="8.8" cy="12" r="0.9" fill="currentColor" stroke="none"/><circle cx="13" cy="12" r="0.9" fill="currentColor" stroke="none"/><circle cx="17.2" cy="12" r="0.9" fill="currentColor" stroke="none"/></svg>',
    article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  /* ---------- 渲染平台入口（公众号 / 小红书） ---------- */
  function renderPlatforms() {
    const wrap = $("#platformsList");
    if (!wrap) return;
    wrap.innerHTML = (S.platforms || []).map((p) => {
      let action = "";
      if ("qr" in p) {
        action = p.qr
          ? `<img class="platform__qr" src="${p.qr}" alt="${p.name} 二维码" />`
          : `<div class="platform__qr platform__qr--empty">放你的<br />公众号二维码</div>`;
      } else if (p.url) {
        action = `<a class="btn btn--primary btn--sm platform__btn" href="${p.url}" target="_blank" rel="noopener noreferrer">去看看 →</a>`;
      }
      return `
        <div class="platform reveal">
          <div class="platform__top">
            <span class="platform__icon">${ICONS[p.icon] || ICONS.article}</span>
            <span class="platform__name">${p.name}</span>
          </div>
          <p class="platform__desc">${p.desc || ""}</p>
          ${action}
        </div>
      `;
    }).join("");
  }

  /* ---------- 渲染社交链接 ---------- */
  function renderSocials() {
    const wrap = $("[data-socials]");
    if (!wrap) return;
    wrap.innerHTML = (S.socials || []).map((s) =>
      `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
    ).join("");
  }

  /* ---------- 顶部滚动进度条 ---------- */
  function initScrollProgress() {
    const bar = $("#scrollProgress");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- 导航滚动状态 + 移动端菜单 ---------- */
  function initNav() {
    const nav = $("#nav");
    const toggle = $("#navToggle");
    const links = $("#navLinks");

    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      $$(".nav__link", links).forEach((a) =>
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    // 滚动时高亮当前区块
    const sections = $$("section[id]");
    const navLinks = $$(".nav__link");
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((a) =>
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- 滚动出现动画 ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- 启动 ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    hydrate();
    renderProjects();
    renderWhatIDo();
    renderPlatforms();
    renderSocials();
    initScrollProgress();
    initNav();
    initReveal();
  });
})();
