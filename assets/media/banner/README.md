# Hero banners

The hero slider on the homepage uses `banner-2.jpg`, `banner-3.jpg`, and
`banner-4.jpg` from this folder.

## Populate this folder

The website markup already points here first and automatically falls back to a
permanent CDN copy of each banner if a local file is missing, so the site works
either way out of the box. To store the files locally in the repo (recommended
so nothing depends on an external host), run:

```bash
bash assets/media/banner/fetch-banners.sh
```

This downloads the three banner graphics (each 3556×1184) into this folder.
Commit them, and the slider will serve the local copies.

To use your own banners, just drop `banner-2.jpg`, `banner-3.jpg`,
`banner-4.jpg` here (or edit the `src` / `data-remote` paths in `index.html`).
