/* ============================================================
   Karnataka Rakshana Vedike — Interactions
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Current year ---- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  var toggle = doc.getElementById("navToggle");
  var nav = doc.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Language toggle (KA / EN nav labels) ---- */
  var langBtns = doc.querySelectorAll(".langtoggle__btn");
  var langEls = doc.querySelectorAll("[data-kn][data-en]");
  if (langBtns.length) {
    var setLang = function (lang) {
      langEls.forEach(function (el) {
        var txt = el.getAttribute(lang === "en" ? "data-en" : "data-kn");
        if (txt) el.textContent = txt;
        el.setAttribute("lang", lang === "en" ? "en" : "kn");
      });
      langBtns.forEach(function (b) {
        b.classList.toggle("is-on", b.getAttribute("data-lang") === lang);
      });
    };
    langBtns.forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = doc.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // small stagger for siblings
          var delay = Math.min(i * 60, 240);
          setTimeout(function () { el.classList.add("in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Animated counters ---- */
  function formatCount(value, target) {
    if (target >= 1000000) return (value / 1000000).toFixed(value < target ? 1 : 0).replace(/\.0$/, "");
    if (target >= 1000) {
      // show as e.g. 12,000
      return Math.round(value).toLocaleString("en-IN");
    }
    return Math.round(value).toString();
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = formatCount(target, target) + suffix;
      return;
    }
    var duration = 1500;
    var startTime = null;
    function tick(ts) {
      if (startTime === null) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      // easeOutExpo
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = formatCount(target * eased, target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatCount(target, target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  var counters = doc.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---- Recent struggles carousel arrows ---- */
  var strTrack = doc.getElementById("strugglesTrack");
  if (strTrack) {
    var strScroll = function (dir) {
      var card = strTrack.querySelector(".struggle");
      var step = card ? card.getBoundingClientRect().width + 24 : 360;
      strTrack.scrollBy({ left: dir * step, behavior: "smooth" });
    };
    var strPrev = doc.getElementById("strPrev");
    var strNext = doc.getElementById("strNext");
    if (strPrev) strPrev.addEventListener("click", function () { strScroll(-1); });
    if (strNext) strNext.addEventListener("click", function () { strScroll(1); });
  }

  /* ---- Articles frame: subtle 3D tilt on hover ---- */
  var artFrame = doc.getElementById("articlesFrame");
  if (artFrame && !reduceMotion) {
    artFrame.addEventListener("mousemove", function (e) {
      var r = artFrame.getBoundingClientRect();
      var rx = ((e.clientY - r.top) - r.height / 2) / 55;
      var ry = (r.width / 2 - (e.clientX - r.left)) / 55;
      artFrame.style.transition = "none";
      artFrame.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    });
    artFrame.addEventListener("mouseleave", function () {
      artFrame.style.transition = "transform .5s ease";
      artFrame.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    });
  }

  /* ---- Join form (front-end demo) ---- */
  var form = doc.getElementById("joinForm");
  var note = doc.getElementById("joinNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var city = (data.get("city") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();

      if (!name || !city || !phone) {
        note.style.color = "#FFCB3D";
        note.textContent = "Please fill in all the fields to join.";
        return;
      }
      if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
        note.style.color = "#FFCB3D";
        note.textContent = "Please enter a valid phone number.";
        return;
      }
      note.style.color = "#8BE28B";
      note.textContent = "ಸ್ವಾಗತ, " + name + "! You're now part of the movement. Our team will reach out soon.";
      form.reset();
    });
  }

  /* ---- Hero banner slider ---- */
  var slider = doc.getElementById("heroSlider");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hslide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("#heroDots button"));
    var idx = 0;
    var timer = null;
    var INTERVAL = 5500;

    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
    };
    var next = function () { go(idx + 1); };
    var prev = function () { go(idx - 1); };
    var start = function () {
      if (reduceMotion) return;
      stop();
      timer = setInterval(next, INTERVAL);
    };
    var stop = function () { if (timer) { clearInterval(timer); timer = null; } };

    var nextBtn = doc.getElementById("heroNext");
    var prevBtn = doc.getElementById("heroPrev");
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); start(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); start(); });
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { go(i); start(); });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    // basic swipe support
    var startX = null;
    slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); start(); }
      startX = null;
    });

    go(0);
    start();
  }

  /* ---- Gallery lightbox ---- */
  var lightbox = doc.getElementById("lightbox");
  var lightboxImg = doc.getElementById("lightboxImg");
  var lightboxCap = doc.getElementById("lightboxCap");
  var lightboxClose = doc.getElementById("lightboxClose");
  if (lightbox && lightboxImg) {
    var closeLightbox = function () {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      doc.body.style.overflow = "";
      lightboxImg.src = "";
    };
    doc.querySelectorAll(".shot").forEach(function (shot) {
      shot.addEventListener("click", function () {
        // don't open the lightbox for images that failed to load
        if (shot.classList.contains("shot--fallback")) return;
        var full = shot.getAttribute("data-full");
        var cap = shot.getAttribute("data-cap") || "";
        if (!full) return;
        lightboxImg.src = full;
        lightboxImg.alt = cap;
        lightboxCap.textContent = cap;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        doc.body.style.overflow = "hidden";
      });
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
    });
  }

  /* ---- Video: swap to real player once metadata loads ---- */
  var video = doc.getElementById("flagVideo");
  if (video) {
    video.addEventListener("loadeddata", function () {
      var fb = video.parentNode.querySelector(".video__fallback");
      if (fb) fb.style.display = "none";
    });
  }

  /* ---- Active nav link highlighting ---- */
  var sections = doc.querySelectorAll("section[id]");
  var navLinks = doc.querySelectorAll('.nav a[href^="#"]');
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var linkMap = {};
    navLinks.forEach(function (a) {
      linkMap[a.getAttribute("href").slice(1)] = a;
    });
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkMap[entry.target.id];
        if (link && entry.isIntersecting) {
          navLinks.forEach(function (l) { l.style.color = ""; });
          if (!link.classList.contains("nav__cta")) link.style.color = "var(--red)";
        }
      });
    }, { threshold: 0.55 });
    sections.forEach(function (s) { sio.observe(s); });
  }
})();
