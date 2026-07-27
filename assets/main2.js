/* ============================================================
   KaRaVe — index2 (cinematic) interactions
   ============================================================ */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = window.requestAnimationFrame.bind(window);

  var yr = doc.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Nav state + progress ---- */
  var nav = doc.getElementById("nav"), bar = doc.getElementById("bar");
  function onScroll() {
    var sy = window.scrollY;
    if (nav) nav.classList.toggle("is-solid", sy > 40);
    if (bar) { var h = doc.documentElement.scrollHeight - window.innerHeight; bar.style.setProperty("--p", h > 0 ? sy / h : 0); }
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Mobile sheet ---- */
  var burger = doc.getElementById("burger"), sheet = doc.getElementById("sheet");
  if (burger && sheet) {
    var toggle = function (open) { burger.classList.toggle("open", open); sheet.classList.toggle("open", open); doc.body.style.overflow = open ? "hidden" : ""; };
    burger.addEventListener("click", function () { toggle(!sheet.classList.contains("open")); });
    sheet.addEventListener("click", function (e) { if (e.target.tagName === "A") toggle(false); });
  }

  /* ---- Reveal on scroll (staggered) ---- */
  var reveals = doc.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var rio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target, d = parseInt(el.getAttribute("data-delay") || "0", 10);
          setTimeout(function () { el.classList.add("in"); }, d);
          rio.unobserve(el);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { rio.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Hero 3D parallax (mouse) + scroll drift ---- */
  var hero = doc.getElementById("hero"), hl = doc.getElementById("heroLayer"), hc = doc.getElementById("heroContent");
  var mx = 0, my = 0, cx = 0, cy = 0;
  if (hero && !reduce) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5;
      my = (e.clientY - r.top) / r.height - .5;
    });
    hero.addEventListener("pointerleave", function () { mx = 0; my = 0; });
    (function loop() {
      cx += (mx - cx) * .05; cy += (my - cy) * .05;
      if (hl) hl.style.transform = "translate3d(" + (cx * -34) + "px," + (cy * -22) + "px,0) scale(1.12) rotateX(" + (cy * 3) + "deg) rotateY(" + (cx * -4) + "deg)";
      if (hc) hc.style.transform = "translate3d(" + (cx * 16) + "px," + (cy * 10) + "px,0)";
      raf(loop);
    })();
  }

  /* ---- Scroll parallax for [data-para] ---- */
  var paras = [].slice.call(doc.querySelectorAll("[data-para]"));
  if (paras.length && !reduce) {
    var tick = function () {
      var vh = window.innerHeight;
      paras.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute("data-para")) || .12;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translateY(" + (mid * -speed) + "px)";
      });
      raf(tick);
    };
    raf(tick);
  }

  /* ---- Count-up ---- */
  function fmt(v, t) { return t >= 1000 ? Math.round(v).toLocaleString("en-IN") : Math.round(v).toString(); }
  function run(el) {
    var t = parseFloat(el.getAttribute("data-n")) || 0;
    if (reduce) { el.childNodes[0].nodeValue = fmt(t, t); return; }
    var s = null, dur = 1700;
    (function tk(ts) {
      if (s === null) s = ts;
      var p = Math.min((ts - s) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.childNodes[0].nodeValue = fmt(t * e, t);
      if (p < 1) raf(tk);
    })();
  }
  var nums = doc.querySelectorAll("[data-n]");
  if ("IntersectionObserver" in window) {
    var nio = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { run(en.target); nio.unobserve(en.target); } }); }, { threshold: .6 });
    nums.forEach(function (el) { nio.observe(el); });
  } else nums.forEach(run);

  /* ---- 3D cover-flow carousel ---- */
  var stage = doc.getElementById("flowStage");
  if (stage) {
    var cards = [].slice.call(stage.querySelectorAll(".card3d"));
    var dotsWrap = doc.getElementById("flowDots");
    var n = cards.length, active = 0, timer = null;
    var dots = cards.map(function (_, i) {
      var b = doc.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { go(i); rearm(); });
      if (dotsWrap) dotsWrap.appendChild(b); return b;
    });
    function layout() {
      cards.forEach(function (c, i) {
        var off = i - active;
        // wrap to shortest direction for a continuous feel
        if (off > n / 2) off -= n; if (off < -n / 2) off += n;
        var abs = Math.abs(off), sign = off < 0 ? -1 : 1;
        var vis = abs <= 3;
        c.style.transform = "translateX(" + (off * 46) + "%) translateZ(" + (-abs * 180) + "px) rotateY(" + (-sign * Math.min(abs, 3) * 34) + "deg) scale(" + (1 - Math.min(abs, 3) * .06) + ")";
        c.style.opacity = vis ? (1 - abs * .12) : 0;
        c.style.zIndex = 200 - abs;
        c.style.pointerEvents = abs > 3 ? "none" : "auto";
        c.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (d, i) { d.classList.toggle("on", i === active); });
    }
    function go(i) { active = (i + n) % n; layout(); }
    function next() { go(active + 1); } function prev() { go(active - 1); }
    cards.forEach(function (c, i) { c.addEventListener("click", function () { if (i !== active) { go(i); rearm(); } }); });
    var pv = doc.getElementById("flowPrev"), nx = doc.getElementById("flowNext");
    if (pv) pv.addEventListener("click", function () { prev(); rearm(); });
    if (nx) nx.addEventListener("click", function () { next(); rearm(); });
    // drag / swipe
    var sx = null;
    stage.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    window.addEventListener("pointerup", function (e) { if (sx === null) return; var dx = e.clientX - sx; if (Math.abs(dx) > 46) { dx < 0 ? next() : prev(); rearm(); } sx = null; });
    function start() { if (reduce) return; timer = setInterval(next, 4200); }
    function rearm() { if (timer) clearInterval(timer); start(); }
    stage.addEventListener("pointerenter", function () { if (timer) clearInterval(timer); });
    stage.addEventListener("pointerleave", start);
    layout(); start();
  }

  /* ---- Active nav link ---- */
  var secs = doc.querySelectorAll("section[id]"), map = {};
  doc.querySelectorAll(".nav__links a[href^='#']").forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  if (secs.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { var a = map[en.target.id]; if (a && en.isIntersecting) { for (var k in map) map[k].style.color = ""; a.style.color = "var(--gold)"; } });
    }, { threshold: .5 });
    secs.forEach(function (s) { sio.observe(s); });
  }
})();
