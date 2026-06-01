# vyshnevsky.com — Portfolio

Personal portfolio of **Oleksandr Vyshnevskyi**, Front-End Developer.

Live site: [vyshnevsky.com](https://vyshnevsky.com)

## Stack

HTML · CSS · JavaScript · GSAP · Formspree

## Structure

```
/
├── index.html              # Main page (Hero, About, Skills, Projects, Reviews, Contact)
├── projects.html           # All projects grid
├── project-detail.html     # Single project page (JS-driven, ?id=N)
├── 404.html                # Custom error page
├── CNAME                   # Custom domain for GitHub Pages
├── sitemap.xml
├── robots.txt
├── styles/
│   ├── style.css
│   ├── projects.css
│   └── project-detail.css
├── script/
│   ├── script.js           # Main animations & interactions
│   ├── projects.js         # Projects grid logic
│   ├── project-detail.js   # Single project page logic
│   ├── projects-data.js    # All project data (single source of truth)
│   └── transition.js       # Page transitions
├── images/                 # WebP images, videos, favicons
└── cv/
    └── cv.pdf
```

## Local development

No build step required. Open `index.html` directly in a browser, or use any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deployment

Hosted on **GitHub Pages** with a custom domain.

DNS records at the registrar:
| Type  | Name | Value                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| CNAME | www  | oleksandr549.github.io  |

> Replace `oleksandr549` with your actual GitHub username.

GitHub Pages settings: **Source → Deploy from branch → main → / (root)**  
Enable **"Enforce HTTPS"** after the domain propagates (~10–30 min).

## Contact form

Powered by [Formspree](https://formspree.io) — no backend required.
