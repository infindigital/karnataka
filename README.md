# Karnataka Rakshana Vedike — Website

A modern, fast, fully responsive redesign of the official website for
**Karnataka Rakshana Vedike (KaRaVe)** — a non-political people's movement
for the Kannada language, culture, land and livelihood, founded in 1999.

## ✨ Highlights

- **Authentic brand identity** built around the turmeric-yellow (`#F5B301`)
  and vermilion-red (`#C4161C`) *arishina–kumkuma* Kannada flag colours.
- **Bilingual** content — English with Kannada (ಕನ್ನಡ) throughout.
- **Beautiful, animated UI** — gradient hero, animated flag card, scroll-reveal
  sections, animated impact counters, marquee, and an interactive timeline.
- **Fully responsive** with an accessible mobile navigation.
- **Accessible & performant** — semantic HTML, keyboard-friendly, honours
  `prefers-reduced-motion`, no build step, no framework.

## 📄 Sections

1. **Hero** — mission statement, key stats, and the animated Kannada flag.
2. **About** — the story of the movement and its four core concerns.
3. **Our Cause** — vision, mission and values.
4. **What We Do** — six pillars of action.
5. **Impact** — a movement measured in millions.
6. **Movements** — flagship campaigns and community service.
7. **Journey** — an interactive timeline from 1999 to today.
8. **Join** — a membership sign-up call to action.
9. **Footer** — navigation, contact and social links.

## 🗂 Structure

```
.
├── index.html          # Single-page site markup
├── assets/
│   ├── styles.css      # Design system + all styling
│   └── main.js         # Interactions (reveal, counters, nav, form)
└── README.md
```

## 🚀 Running locally

No build tools required — it's a static site.

```bash
# From the project root, any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply open `index.html` in a browser.

## 🔤 Fonts

Uses Google Fonts (`Plus Jakarta Sans`, `Anek Kannada`, `Noto Sans Kannada`).
The site degrades gracefully to system fonts if fonts fail to load.

---

*ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ · ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ*
