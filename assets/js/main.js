/* 平行时空影业 · 地图制作组 */

// ------------------------------------------------------------------
// 报名表配置
// 报名数据要保存到哪里，在这里设置。留空时表单显示「即将开放」并禁止提交。
// ------------------------------------------------------------------
var APPLY_CONFIG = {
  endpoint: "", // 接收报名数据的地址（POST JSON），例如数据库服务提供的接口
  headers: {}   // 该服务需要的请求头（如公开的 API Key）
};

// 招募的岗位：成员卡片和报名表的「想负责的方向」都从这里生成
var ROLES = [
  { name: "制片 / 组长", en: "Producer" },
  { name: "关卡设计", en: "Level Design" },
  { name: "场景美术", en: "Environment Art" },
  { name: "脚本程序", en: "Scripting" },
  { name: "剧情编剧", en: "Story" },
  { name: "音效配乐", en: "Sound & Music" }
];

(function () {
  "use strict";

  // 导航：滚动后加背景，手机端折叠菜单
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // 成员卡片与岗位选项
  var avatarSvg =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>';
  var members = document.getElementById("members");
  var chips = document.getElementById("roleChips");

  ROLES.forEach(function (role, i) {
    var card = document.createElement("article");
    card.className = "member reveal";
    card.innerHTML =
      '<div class="avatar">' + avatarSvg + "</div>" +
      "<div><h3></h3><div class=\"role-en\"></div><span class=\"badge\">虚位以待</span></div>";
    card.querySelector("h3").textContent = role.name;
    card.querySelector(".role-en").textContent = role.en;
    members.appendChild(card);

    var label = document.createElement("label");
    label.className = "chip";
    label.innerHTML = '<input type="checkbox" name="roles"><span></span>';
    label.querySelector("input").value = role.name;
    label.querySelector("input").id = "role-" + i;
    label.querySelector("span").textContent = role.name;
    chips.appendChild(label);
  });
  var other = document.createElement("label");
  other.className = "chip";
  other.innerHTML = '<input type="checkbox" name="roles" value="还没想好"><span>还没想好</span>';
  chips.appendChild(other);

  // 滚动渐入
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  // 报名表
  var form = document.getElementById("applyForm");
  var msg = document.getElementById("formMsg");
  var btn = document.getElementById("submitBtn");
  var enabled = Boolean(APPLY_CONFIG.endpoint);

  if (!enabled) {
    document.getElementById("formNotice").hidden = false;
    btn.disabled = true;
    btn.textContent = "报名通道即将开放";
  }

  function show(text, kind) {
    msg.textContent = text;
    msg.className = "form-msg" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!enabled) return;

    var f = form.elements;
    var data = {
      name: f.namedItem("name").value.trim(),
      contact: f.namedItem("contact").value.trim(),
      roles: Array.prototype.map.call(form.querySelectorAll('input[name="roles"]:checked'), function (el) {
        return el.value;
      }),
      experience: f.namedItem("experience").value,
      link: f.namedItem("link").value.trim(),
      intro: f.namedItem("intro").value.trim()
    };

    if (!data.name || !data.contact) {
      show("请填写称呼和联系方式。", "err");
      return;
    }
    if (data.roles.length === 0) {
      show("请至少选择一个想负责的方向。", "err");
      return;
    }

    btn.disabled = true;
    show("提交中……");

    var headers = { "Content-Type": "application/json" };
    Object.keys(APPLY_CONFIG.headers).forEach(function (k) {
      headers[k] = APPLY_CONFIG.headers[k];
    });

    fetch(APPLY_CONFIG.endpoint, { method: "POST", headers: headers, body: JSON.stringify(data) })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        show("报名成功！欢迎来到平行时空，我们会尽快联系你。", "ok");
      })
      .catch(function () {
        show("提交失败，请检查网络后重试。", "err");
      })
      .then(function () {
        btn.disabled = false;
      });
  });
})();
