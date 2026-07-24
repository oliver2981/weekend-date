/* ==================== 配置区（想改就改这里） ==================== */
const CONFIG = {
  herName: "Dammy",
  // Server酱 SendKey：去 https://sct.ftqq.com 微信扫码登录后复制，填在引号里
  sendKey: "SCT379974TPRHFJfd9n5fpMuo9ULazKJy6",
  loveNote: "遇见你之后，每个周末都变得值得期待。这次也请多多指教啦 💗",
  activities: [
    { ico: "🎹", txt: "一起弹钢琴" },
    { ico: "🎬", txt: "看一场电影" },
    { ico: "🍰", txt: "一起做蛋糕" },
    { ico: "✂️", txt: "做手工" },
    { ico: "📸", txt: "当Oli摄影师的专属模特" },
    { ico: "🧗", txt: "攀岩 / 健身房" },
    { ico: "🐱", txt: "猫咖撸猫" },
    { ico: "🐶", txt: "狗咖吸狗" },
    { ico: "🍜", txt: "吃好吃的" },
    { ico: "🧺", txt: "公园野餐" },
    { ico: "🎨", txt: "看展 / 美术馆" },
    { ico: "🎲", txt: "桌游 / 密室逃脱" },
    { ico: "🌃", txt: "夜市散步" },
    { ico: "🎤", txt: "KTV 唱歌" },
    { ico: "🎲", txt: "由你决定" }
  ],
  slots: [
    { key: "上午", hour: 10, hint: "阳光正好的早晨 ☀️" },
    { key: "下午", hour: 14, hint: "慵懒惬意的午后 🌤" },
    { key: "晚上", hour: 19, hint: "浪漫温柔的夜晚 🌙" }
  ]
};
/* ================================================================ */

const state = { day: null, slot: null, acts: [] };

document.getElementById("q1").textContent =
  CONFIG.herName + "，这周末愿意和我去约会吗？";

/* ---------- 飘落爱心背景 ---------- */
const HEARTS = ["💗","💕","🌸","💖","✨","🩷"];
function dropHeart() {
  const el = document.createElement("div");
  el.className = "heart-drop";
  el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = 14 + Math.random() * 20 + "px";
  el.style.animationDuration = 5 + Math.random() * 6 + "s";
  document.getElementById("hearts-bg").appendChild(el);
  setTimeout(() => el.remove(), 12000);
}
setInterval(dropHeart, 500);
for (let i = 0; i < 10; i++) setTimeout(dropHeart, i * 200);

/* ---------- 页面切换 ---------- */
function goto(n) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("s" + n).classList.add("active");
  document.querySelectorAll("#dots span").forEach((d, i) =>
    d.classList.toggle("on", i < n));
}

document.querySelectorAll(".back-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const n = parseInt(document.querySelector(".screen.active").id.slice(1));
    if (n > 1) goto(n - 1);
  });
});

/* ---------- 第 1 步：逃跑按钮 ---------- */
const btnNo = document.getElementById("btn-no");
const NO_TEXTS = ["让我想想", "别跑呀", "点不到点不到", "嘿嘿 就不", "放弃吧~", "某位Dammy的爱慕者会伤心的 🥺"];
let noCount = 0;
function flee() {
  btnNo.classList.add("fleeing");
  const pad = 20;
  const w = btnNo.offsetWidth, h = btnNo.offsetHeight;
  btnNo.style.left = pad + Math.random() * (innerWidth - w - pad * 2) + "px";
  btnNo.style.top = pad + Math.random() * (innerHeight - h - pad * 2) + "px";
  noCount++;
  btnNo.textContent = NO_TEXTS[Math.min(noCount, NO_TEXTS.length - 1)];
}
btnNo.addEventListener("mouseover", flee);
btnNo.addEventListener("touchstart", e => { e.preventDefault(); flee(); }, { passive: false });
btnNo.addEventListener("click", flee);

document.getElementById("btn-yes").addEventListener("click", () => {
  btnNo.remove();
  goto(2);
});

/* ---------- 第 2 步：选时间 ---------- */
function weekendDates() {
  const now = new Date();
  const res = [];
  for (const dow of [6, 0]) {          // 周六、周日
    const d = new Date(now);
    let diff = (dow - now.getDay() + 7) % 7;
    if (dow === 0 && diff === 0) diff = 7;   // 今天周日，跳到下周日
    d.setDate(now.getDate() + diff);
    res.push({
      label: dow === 6 ? "周六" : "周日",
      date: d,
      text: (d.getMonth() + 1) + "月" + d.getDate() + "日"
    });
  }
  return res;
}
const days = weekendDates();
const dayBox = document.getElementById("day-opts");
days.forEach((d, i) => {
  const el = document.createElement("div");
  el.className = "opt";
  el.innerHTML = d.label + " · " + d.text;
  el.onclick = () => {
    state.day = d;
    dayBox.querySelectorAll(".opt").forEach(o => o.classList.remove("sel"));
    el.classList.add("sel");
    checkTime();
  };
  dayBox.appendChild(el);
});
const slotBox = document.getElementById("slot-opts");
CONFIG.slots.forEach(s => {
  const el = document.createElement("div");
  el.className = "opt";
  el.innerHTML = s.key + "<small>" + s.hint + "</small>";
  el.onclick = () => {
    state.slot = s;
    slotBox.querySelectorAll(".opt").forEach(o => o.classList.remove("sel"));
    el.classList.add("sel");
    checkTime();
  };
  slotBox.appendChild(el);
});
function checkTime() {
  document.getElementById("btn-time").disabled = !(state.day && state.slot);
}
document.getElementById("btn-time").addEventListener("click", () => goto(3));

/* ---------- 第 3 步：选项目 ---------- */
const grid = document.getElementById("act-grid");
function addActCard(a, preselect) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = '<span class="ico">' + a.ico + '</span><span class="txt"></span>';
  el.querySelector(".txt").textContent = a.txt;
  const name = a.ico + " " + a.txt;
  el.onclick = () => {
    el.classList.toggle("sel");
    const i = state.acts.indexOf(name);
    i >= 0 ? state.acts.splice(i, 1) : state.acts.push(name);
    document.getElementById("btn-act").disabled = state.acts.length === 0;
  };
  grid.insertBefore(el, addCard);
  if (preselect) el.onclick();
}
// 「自己写一个」卡片 + 输入框
const addCard = document.createElement("div");
addCard.className = "card add-card";
addCard.innerHTML = '<span class="ico">✏️</span><span class="txt">自己写一个</span>';
addCard.onclick = () => {
  document.getElementById("custom-add").classList.add("show");
  document.getElementById("custom-input").focus();
};
grid.appendChild(addCard);
CONFIG.activities.forEach(a => addActCard(a, false));

document.getElementById("custom-ok").addEventListener("click", () => {
  const input = document.getElementById("custom-input");
  const txt = input.value.trim();
  if (!txt) return;
  addActCard({ ico: "💡", txt: txt }, true);
  input.value = "";
  document.getElementById("custom-add").classList.remove("show");
  addCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
document.getElementById("btn-act").addEventListener("click", () => {
  document.getElementById("r-name").textContent = CONFIG.herName + " 小姐 💝";
  document.getElementById("r-time").textContent =
    state.day.label + " " + state.day.text + " " + state.slot.key;
  document.getElementById("r-acts").textContent = state.acts.join("、");
  document.getElementById("r-note").textContent = CONFIG.loveNote;
  goto(4);
});

/* ---------- 第 4 步：确认 + 烟花 + 倒计时 + 推送 ---------- */
document.getElementById("btn-final").addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("final-msg").style.display = "block";
  startFireworks();
  startCountdown();
  sendNotify();
});

function sendNotify() {
  if (!CONFIG.sendKey) return;
  // 本地打开或带 ?test 参数时不真实推送，避免消耗 Server酱 免费次数
  if (location.protocol === "file:" || new URLSearchParams(location.search).has("test")) return;
  const title = CONFIG.herName + " 答应和你约会啦！🎉";
  const desp = "时间：" + state.day.label + " " + state.day.text + " " + state.slot.key +
    "\n\n项目：" + state.acts.join("、");
  const url = "https://sctapi.ftqq.com/" + CONFIG.sendKey + ".send?title=" +
    encodeURIComponent(title) + "&desp=" + encodeURIComponent(desp);
  fetch(url, { mode: "no-cors" }).catch(() => { new Image().src = url; });
}

function startCountdown() {
  const t = new Date(state.day.date);
  t.setHours(state.slot.hour, 0, 0, 0);
  document.getElementById("cd-title").style.display = "block";
  document.getElementById("countdown").style.display = "flex";
  function tick() {
    let ms = t - Date.now();
    if (ms < 0) ms = 0;
    const s = Math.floor(ms / 1000);
    document.getElementById("cd-d").textContent = Math.floor(s / 86400);
    document.getElementById("cd-h").textContent = Math.floor(s % 86400 / 3600);
    document.getElementById("cd-m").textContent = Math.floor(s % 3600 / 60);
    document.getElementById("cd-s").textContent = s % 60;
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- 烟花 & 爱心爆炸 ---------- */
function startFireworks() {
  const cv = document.getElementById("fireworks");
  cv.style.display = "block";
  cv.width = innerWidth; cv.height = innerHeight;
  const ctx = cv.getContext("2d");
  const parts = [];
  const COLORS = ["#ff5c8a", "#ffd166", "#ff8fab", "#c77dff", "#7bdff2", "#fff"];

  function boom(x, y) {
    const n = 36 + Math.random() * 24;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 2 + Math.random() * 5;
      parts.push({
        x, y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        heart: Math.random() < 0.3,
        size: 3 + Math.random() * 3
      });
    }
  }

  let booms = 0;
  const boomTimer = setInterval(() => {
    boom(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.12 + Math.random() * 0.5));
    if (++booms > 14) clearInterval(boomTimer);
  }, 420);
  boom(innerWidth / 2, innerHeight / 3);

  function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.05;
      p.life -= 0.012;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      if (p.heart) {
        ctx.font = p.size * 4 + "px serif";
        ctx.fillText("💗", p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.length || booms <= 14) requestAnimationFrame(draw);
    else cv.style.display = "none";
  }
  draw();
}
