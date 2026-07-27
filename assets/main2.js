/* ============================================================
   KaRaVe — index2 interactions (movement broadsheet)
   ============================================================ */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme toggle (persists) ---- */
  try {
    var saved = localStorage.getItem("krv-theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}
  var themeBtn = doc.getElementById("themeBtn");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = root.getAttribute("data-theme");
    if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("krv-theme", next); } catch (e) {}
  });

  /* ---- Year ---- */
  var y = doc.getElementById("yr"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile drawer ---- */
  var tgl = doc.getElementById("navToggle"), drawer = doc.getElementById("drawer");
  if (tgl && drawer) {
    tgl.addEventListener("click", function () { drawer.classList.toggle("open"); });
    drawer.addEventListener("click", function (e) { if (e.target.tagName === "A") drawer.classList.remove("open"); });
  }

  /* ---- Scroll progress ---- */
  var prog = doc.getElementById("prog");
  function onScroll() {
    if (!prog) return;
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    prog.style.setProperty("--p", h > 0 ? (window.scrollY / h) : 0);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Reveal on scroll ---- */
  var rises = doc.querySelectorAll(".rise, .reveal-up");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en, i) {
        if (en.isIntersecting) { var el = en.target; setTimeout(function () { el.classList.add("in"); }, Math.min(i * 55, 240)); io.unobserve(el); }
      });
    }, { threshold: .16, rootMargin: "0px 0px -8% 0px" });
    rises.forEach(function (el) { io.observe(el); });
  } else { rises.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Hero load-in sequence (independent of scroll) ---- */
  var heroUps = doc.querySelectorAll(".hero .reveal-up");
  if (reduce) { heroUps.forEach(function (el) { el.classList.add("in"); }); }
  else { heroUps.forEach(function (el, i) { setTimeout(function () { el.classList.add("in"); }, 180 + i * 130); }); }

  /* ---- Hero parallax (scroll + pointer) ---- */
  var heroBg = doc.getElementById("heroBg"), heroStage = doc.getElementById("heroStage"), heroText = doc.getElementById("heroText");
  var px = 0, py = 0, tx = 0, ty = 0;
  if (heroBg && !reduce) {
    window.addEventListener("scroll", function () {
      var r = heroStage.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      var off = (window.innerHeight - r.top) * 0.08;
      heroBg.style.transform = "translateY(" + off + "px) scale(1.06)";
    }, { passive: true });
    heroStage.addEventListener("pointermove", function (e) {
      var r = heroStage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5);
      ty = ((e.clientY - r.top) / r.height - .5);
    });
    heroStage.addEventListener("pointerleave", function () { tx = 0; ty = 0; });
    (function loop() {
      px += (tx - px) * .06; py += (ty - py) * .06;
      if (heroBg) heroBg.style.marginLeft = (px * -26) + "px";
      if (heroText) heroText.style.transform = "translate(" + (px * 14) + "px," + (py * 10) + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---- 3D pointer tilt (portrait + activity cards) ---- */
  function tilt(el, max) {
    if (reduce) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var rx = (((e.clientY - r.top) / r.height) - .5) * -max;
      var ry = (((e.clientX - r.left) / r.width) - .5) * max;
      el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    el.addEventListener("pointerleave", function () { el.style.transform = ""; });
  }
  var portrait = doc.querySelector(".mani__portrait .frame");
  if (portrait) {
    portrait.addEventListener("pointermove", function (e) {
      var r = portrait.getBoundingClientRect();
      var rx = (((e.clientY - r.top) / r.height) - .5) * -8;
      var ry = (((e.clientX - r.left) / r.width) - .5) * 8;
      portrait.style.transform = "perspective(900px) rotate(-2deg) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    portrait.addEventListener("pointerleave", function () { portrait.style.transform = "rotate(-2deg)"; });
  }
  doc.querySelectorAll(".act").forEach(function (c) { tilt(c, 10); });

  /* ---- Count-up stats ---- */
  function fmt(v, t) { return t >= 1000 ? Math.round(v).toLocaleString("en-IN") : Math.round(v).toString(); }
  function run(el) {
    var t = parseFloat(el.getAttribute("data-n")) || 0, suf = el.getAttribute("data-suf") || "";
    if (reduce) { el.textContent = fmt(t, t) + suf; return; }
    var start = null, dur = 1500;
    (function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.firstChild ? (el.childNodes[0].nodeValue = fmt(t * e, t)) : (el.textContent = fmt(t * e, t));
      el.setAttribute("data-cur", fmt(t * e, t));
      if (p < 1) requestAnimationFrame(tick);
    })();
  }
  var nums = doc.querySelectorAll("[data-n]");
  if ("IntersectionObserver" in window) {
    var nio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { run(en.target); nio.unobserve(en.target); } });
    }, { threshold: .5 });
    nums.forEach(function (el) { nio.observe(el); });
  } else { nums.forEach(run); }

  /* ---- Active section in nav ---- */
  var secs = doc.querySelectorAll("section[id]");
  var links = {};
  doc.querySelectorAll(".mast__nav a[href^='#']").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if (secs.length && "IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        var a = links[en.target.id];
        if (a && en.isIntersecting) { for (var k in links) links[k].style.color = ""; a.style.color = "var(--red)"; }
      });
    }, { threshold: .5 });
    secs.forEach(function (s) { sio.observe(s); });
  }
})();
