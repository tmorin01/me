# tmmorin.com — Jekyll Site

Copy each section into the corresponding file path in your repo.

---

## `_config.yml`

```yaml
title: Thomas Morin
description: Postdoctoral Research Fellow, Cognitive & Computational Neuroscience
url: "https://www.tmmorin.com"
baseurl: ""
author:
  name: Thomas Morin
  email: tmorin@mgh.harvard.edu

markdown: kramdown
plugins:
  - jekyll-feed
  - jekyll-seo-tag

permalink: /writing/:year/:slug/

sass:
  style: compressed
```

---

## `_data/research.yml`

Edit this file to update your research areas section.

```yaml
- title: Functional Network Dynamics
  description: >
    How the brain reorganizes large-scale networks during learning and
    abstract reasoning. Using fMRI and graph-theoretic methods to study
    the frontoparietal control network.
  icon: network

- title: Memory & Cognitive Control
  description: >
    The neural mechanisms linking working memory, rule learning, and
    executive function. How flexible cognition emerges from stable
    neural architecture.
  icon: memory

- title: Neurovascular & Fluid Dynamics
  description: >
    Simultaneous fMRI–EEG approaches to understand how neural, vascular,
    and cerebrospinal fluid dynamics interact — and how sleep deprivation
    disrupts these coupled systems.
  icon: fluid

- title: Computational Methods
  description: >
    Applying machine learning and network science to neuroimaging data.
    Graph theory, dynamic functional connectivity, and multivariate
    pattern analysis.
  icon: compute
```

---

## `_data/publications.yml`

Add new papers at the top. The publications page renders this automatically.

```yaml
- title: "Attentional failures after sleep deprivation are locked to joint neurovascular, pupil and cerebrospinal fluid flow dynamics"
  authors: "Yang et al."
  journal: Nature Neuroscience
  year: 2025
  url: "https://www.nature.com/articles/s41593-025-02098-8"
  tags: [sleep, fMRI, EEG, attention]

- title: "Functional reconfiguration of task-active frontoparietal control network facilitates abstract reasoning"
  authors: "Morin TM, et al."
  journal: Cerebral Cortex
  year: 2022
  url: "https://academic.oup.com/cercor/advance-article/doi/10.1093/cercor/bhac457/6843797"
  tags: [frontoparietal, fMRI, reasoning, networks]

- title: "Dynamic network analysis demonstrates the formation of stable functional networks during rule learning"
  authors: "Morin TM, et al."
  journal: Cerebral Cortex
  year: 2021
  url: "https://academic.oup.com/cercor/advance-article/doi/10.1093/cercor/bhab175/6328819"
  tags: [networks, learning, fMRI]
```

---

## `_data/nav.yml`

```yaml
- label: Research
  url: /research/
- label: Publications
  url: /publications/
- label: Writing
  url: /writing/
- label: CV
  url: /assets/cv.pdf
```

---

## `_includes/head.html`

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{% if page.title %}{{ page.title }} — {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
<meta name="description" content="{{ page.description | default: site.description }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400&display=swap">
<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
{% seo %}
```

---

## `_includes/nav.html`

```html
<header class="site-header">
  <nav class="nav-inner">
    <a href="{{ '/' | relative_url }}" class="nav-brand">T. M. Morin</a>
    <ul class="nav-links">
      {% for item in site.data.nav %}
      <li><a href="{{ item.url | relative_url }}"{% if page.url == item.url %} class="active"{% endif %}>{{ item.label }}</a></li>
      {% endfor %}
    </ul>
    <div class="nav-external">
      <a href="https://scholar.google.com/citations?user=DYfllzQAAAAJ" target="_blank" rel="noopener">Scholar</a>
      <a href="https://github.com/tmorin01" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>
</header>
```

---

## `_includes/footer.html`

```html
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-bio">
      <span class="footer-name">Thomas Morin</span>
      <span class="footer-role">Postdoctoral Research Fellow · MGH &amp; Brandeis University</span>
    </div>
    <div class="footer-links">
      <a href="https://scholar.google.com/citations?user=DYfllzQAAAAJ" target="_blank" rel="noopener">Google Scholar</a>
      <a href="https://twitter.com/ThomasMorin1" target="_blank" rel="noopener">Twitter</a>
      <a href="https://github.com/tmorin01" target="_blank" rel="noopener">GitHub</a>
      <a href="https://www.linkedin.com/in/thomas-morin-phd-23b196b2" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </div>
</footer>
```

---

## `_layouts/default.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  {% include head.html %}
</head>
<body class="{{ page.body_class }}">
  {% include nav.html %}
  <main>
    {{ content }}
  </main>
  {% include footer.html %}
  <script src="{{ '/assets/js/botanical.js' | relative_url }}"></script>
</body>
</html>
```

---

## `_layouts/post.html`

```html
---
layout: default
---
<article class="post-article">
  <header class="post-header">
    <div class="post-meta">{{ page.date | date: "%B %-d, %Y" }}</div>
    <h1 class="post-title">{{ page.title }}</h1>
  </header>
  <div class="post-content">
    {{ content }}
  </div>
  <div class="post-back">
    <a href="{{ '/writing/' | relative_url }}">← All writing</a>
  </div>
</article>
```

---

## `index.html`

```html
---
layout: default
body_class: home
---

<section class="hero">
  <canvas id="botanical-canvas"></canvas>
  <div class="hero-content">
    <p class="hero-label">Postdoctoral Research Fellow</p>
    <h1 class="hero-name">Thomas Morin</h1>
    <p class="hero-affil">Mass. General Hospital &amp; Brandeis University</p>
    <p class="hero-tagline">Cognitive &amp; Computational Neuroscience</p>
    <div class="hero-actions">
      <a href="#research" class="btn-primary">Research</a>
      <a href="{{ '/publications/' | relative_url }}" class="btn-secondary">Publications</a>
    </div>
  </div>
</section>

<section class="about" id="about">
  <div class="section-inner">
    <div class="about-grid">
      <div class="about-text">
        <h2>About</h2>
        <p>
          I am a postdoctoral research fellow at Massachusetts General Hospital and
          Brandeis University, working at the intersection of cognitive and
          computational neuroscience. My research uses fMRI, EEG, and quantitative
          methods to study how the brain's large-scale networks support memory,
          learning, and abstract reasoning.
        </p>
        <p>
          I completed my PhD in Computational Neuroscience at Boston University,
          where I worked in the Cognitive Neuroimaging Lab with Dr. Chantal Stern.
          Before that, I studied Cognitive &amp; Brain Science and Computer Science
          at Tufts, and spent two years working with PET and MRI at the Martinos
          Center for Biomedical Imaging at MGH.
        </p>
        <a href="{{ '/assets/cv.pdf' | relative_url }}" class="text-link">Download CV →</a>
      </div>
      <div class="about-meta">
        <div class="meta-block">
          <span class="meta-label">Current position</span>
          <span class="meta-value">Postdoctoral Fellow<br>MGH / Brandeis</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">PhD</span>
          <span class="meta-value">Computational Neuroscience<br>Boston University</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">BS</span>
          <span class="meta-value">Cognitive &amp; Brain Science,<br>Computer Science · Tufts</span>
        </div>
        <div class="meta-block">
          <span class="meta-label">Contact</span>
          <span class="meta-value">tmorin@mgh.harvard.edu</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="research" id="research">
  <div class="section-inner">
    <h2 class="section-title">Research Areas</h2>
    <p class="section-intro">
      My work spans the neural mechanisms of cognition, computational approaches
      to neuroimaging, and the physiology of sleep and attention.
    </p>
    <div class="research-grid">
      {% for area in site.data.research %}
      <div class="research-card">
        <div class="research-card-icon icon-{{ area.icon }}"></div>
        <h3>{{ area.title }}</h3>
        <p>{{ area.description }}</p>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="recent-pubs" id="recent">
  <div class="section-inner">
    <div class="section-header-row">
      <h2 class="section-title">Recent Publications</h2>
      <a href="{{ '/publications/' | relative_url }}" class="text-link">All publications →</a>
    </div>
    <ul class="pub-list">
      {% for pub in site.data.publications limit:3 %}
      <li class="pub-item">
        <span class="pub-year">{{ pub.year }}</span>
        <div class="pub-body">
          <a href="{{ pub.url }}" class="pub-title" target="_blank" rel="noopener">{{ pub.title }}</a>
          <span class="pub-journal">{{ pub.journal }}</span>
        </div>
      </li>
      {% endfor %}
    </ul>
  </div>
</section>
```

---

## `research.html`

```html
---
layout: default
title: Research
permalink: /research/
---

<div class="page-hero">
  <div class="section-inner">
    <h1 class="page-title">Research</h1>
    <p class="page-intro">
      I study how the human brain supports complex cognition — from abstract
      reasoning and rule learning to the effects of sleep on neural and fluid
      dynamics. My work combines functional neuroimaging, network science,
      and computational modeling.
    </p>
  </div>
</div>

<section class="research-detail">
  <div class="section-inner">
    {% for area in site.data.research %}
    <div class="research-detail-item">
      <div class="research-detail-icon icon-{{ area.icon }}"></div>
      <div class="research-detail-text">
        <h2>{{ area.title }}</h2>
        <p>{{ area.description }}</p>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
```

---

## `publications.html`

```html
---
layout: default
title: Publications
permalink: /publications/
---

<div class="page-hero">
  <div class="section-inner">
    <h1 class="page-title">Publications</h1>
    <p class="page-intro">
      Full list on
      <a href="https://scholar.google.com/citations?user=DYfllzQAAAAJ" target="_blank" rel="noopener" class="inline-link">Google Scholar</a>.
      To add a paper, edit <code>_data/publications.yml</code>.
    </p>
  </div>
</div>

<section class="pub-section">
  <div class="section-inner">
    {% assign pubs_by_year = site.data.publications | group_by: "year" | sort: "name" | reverse %}
    {% for year_group in pubs_by_year %}
    <div class="pub-year-group">
      <h2 class="pub-year-heading">{{ year_group.name }}</h2>
      <ul class="pub-list pub-list--full">
        {% for pub in year_group.items %}
        <li class="pub-item">
          <div class="pub-body">
            <a href="{{ pub.url }}" class="pub-title" target="_blank" rel="noopener">{{ pub.title }}</a>
            <span class="pub-authors">{{ pub.authors }}</span>
            <span class="pub-journal">{{ pub.journal }}, {{ pub.year }}</span>
            {% if pub.tags %}
            <div class="pub-tags">
              {% for tag in pub.tags %}<span class="pub-tag">{{ tag }}</span>{% endfor %}
            </div>
            {% endif %}
          </div>
        </li>
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>
```

---

## `writing.html`

```html
---
layout: default
title: Writing
permalink: /writing/
---

<div class="page-hero">
  <div class="section-inner">
    <h1 class="page-title">Writing</h1>
    <p class="page-intro">
      An archive of past posts — on science, data, and whatever else seemed worth
      writing about at the time.
    </p>
  </div>
</div>

<section class="writing-section">
  <div class="section-inner">
    <ul class="post-list">
      {% for post in site.posts %}
      <li class="post-list-item">
        <span class="post-list-date">{{ post.date | date: "%Y" }}</span>
        <a href="{{ post.url | relative_url }}" class="post-list-title">{{ post.title }}</a>
      </li>
      {% endfor %}
    </ul>
  </div>
</section>
```

---

## `assets/css/main.css`

```css
/* ── Tokens ─────────────────────────────────────────────────── */
:root {
  --bg:      #07100a;
  --bg2:     #0f1c12;
  --bg3:     #182619;
  --surface: #1e2e20;
  --border:  rgba(100, 160, 110, 0.14);
  --border2: rgba(100, 160, 110, 0.28);
  --green:   #4a8c58;
  --green2:  #6aad7a;
  --gold:    #c8a462;
  --gold2:   #ddbf80;
  --text:    #cfc4a0;
  --text2:   #8da890;
  --text3:   #4f6b52;
  --mono:    'Space Mono', monospace;
  --serif:   'EB Garamond', Georgia, serif;
  --display: 'Cormorant', Georgia, serif;
}

/* ── Reset ───────────────────────────────────────────────────── */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--serif);
  font-size: 18px;
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: var(--green2); text-decoration: none; transition: color .2s; }
a:hover { color: var(--gold2); }
code {
  font-family: var(--mono);
  font-size: .78em;
  color: var(--text2);
  background: var(--bg3);
  padding: .1em .35em;
  border-radius: 3px;
}

/* ── Navigation ──────────────────────────────────────────────── */
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(7,16,10,.97) 0%, transparent 100%);
  padding: .9rem 2rem;
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.nav-brand {
  font-family: var(--mono);
  font-size: .72rem;
  letter-spacing: .2em;
  color: var(--text2);
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}
.nav-brand:hover { color: var(--gold); }
.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  flex: 1;
}
.nav-links a {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--text3);
  transition: color .2s;
}
.nav-links a:hover,
.nav-links a.active { color: var(--text); }
.nav-external {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
}
.nav-external a {
  font-family: var(--mono);
  font-size: .65rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text3);
}
.nav-external a:hover { color: var(--green2); }

/* ── Hero ────────────────────────────────────────────────────── */
.hero {
  position: relative;
  height: 100vh;
  min-height: 580px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}
#botanical-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: .65;
}
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 80% at 20% 50%, transparent 40%, rgba(7,16,10,.8) 100%);
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 clamp(2rem, 8vw, 8rem);
  max-width: 640px;
}
.hero-label {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .35em;
  text-transform: uppercase;
  color: var(--green);
  margin-bottom: .75rem;
}
.hero-name {
  font-family: var(--display);
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 500;
  color: var(--gold2);
  line-height: 1.08;
  letter-spacing: .02em;
  margin-bottom: .5rem;
}
.hero-affil {
  font-family: var(--mono);
  font-size: .7rem;
  letter-spacing: .12em;
  color: var(--text3);
  text-transform: uppercase;
  margin-bottom: .3rem;
}
.hero-tagline {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--text2);
  margin-bottom: 2rem;
}
.hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.btn-primary {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--bg);
  background: var(--green);
  padding: .65rem 1.6rem;
  border: 1px solid var(--green);
  transition: background .2s, border-color .2s;
}
.btn-primary:hover {
  background: var(--green2);
  border-color: var(--green2);
  color: var(--bg);
}
.btn-secondary {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--text2);
  background: transparent;
  padding: .65rem 1.6rem;
  border: 1px solid var(--border2);
  transition: border-color .2s, color .2s;
}
.btn-secondary:hover { border-color: var(--green); color: var(--green2); }

/* ── Sections ────────────────────────────────────────────────── */
.section-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
}
.about, .research, .recent-pubs {
  padding: 5rem 0;
  border-top: 1px solid var(--border);
}
.section-title {
  font-family: var(--display);
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  font-weight: 500;
  color: var(--gold);
  margin-bottom: .5rem;
  letter-spacing: .02em;
}
.section-intro {
  color: var(--text2);
  font-style: italic;
  max-width: 560px;
  margin-bottom: 2.5rem;
  line-height: 1.8;
}
.section-header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: .5rem;
}
.text-link {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text3);
  border-bottom: 1px solid var(--border2);
  padding-bottom: 1px;
  transition: color .2s, border-color .2s;
}
.text-link:hover { color: var(--green2); border-color: var(--green2); }

/* ── About ───────────────────────────────────────────────────── */
.about-grid {
  display: grid;
  grid-template-columns: 1fr minmax(0, 260px);
  gap: 4rem;
  align-items: start;
}
.about-text h2 {
  font-family: var(--display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: 1rem;
}
.about-text p { color: var(--text2); margin-bottom: 1rem; font-size: 1rem; }
.about-text p:last-of-type { margin-bottom: 1.25rem; }
.about-meta { display: flex; flex-direction: column; gap: 1.25rem; }
.meta-block { border-left: 2px solid var(--border2); padding-left: 1rem; }
.meta-label {
  display: block;
  font-family: var(--mono);
  font-size: .6rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--text3);
  margin-bottom: .25rem;
}
.meta-value { display: block; font-size: .9rem; color: var(--text2); line-height: 1.5; }

/* ── Research cards ──────────────────────────────────────────── */
.research-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}
.research-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 1.75rem 1.5rem;
  transition: border-color .25s;
}
.research-card:hover { border-color: var(--border2); }
.research-card h3 {
  font-family: var(--display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: .6rem;
}
.research-card p { font-size: .9rem; color: var(--text2); line-height: 1.7; }
.research-card-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 1rem;
  opacity: .7;
  background-size: contain;
  background-repeat: no-repeat;
}
/* Inline SVG icons via CSS masks — simple botanical/scientific symbols */
.icon-network  { background-color: var(--green); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='19' cy='5' r='2'/%3E%3Ccircle cx='19' cy='19' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cline x1='7' y1='12' x2='10' y2='12'/%3E%3Cline x1='14' y1='12' x2='17' y2='6'/%3E%3Cline x1='14' y1='12' x2='17' y2='18'/%3E%3C/svg%3E") center / contain no-repeat; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='19' cy='5' r='2'/%3E%3Ccircle cx='19' cy='19' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cline x1='7' y1='12' x2='10' y2='12'/%3E%3Cline x1='14' y1='12' x2='17' y2='6'/%3E%3Cline x1='14' y1='12' x2='17' y2='18'/%3E%3C/svg%3E") center / contain no-repeat; }
.icon-memory   { background-color: var(--green); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Cpath d='M12 2C8 2 5 5 5 8c0 2 1 3.5 2 4.5V18h10v-5.5c1-1 2-2.5 2-4.5 0-3-3-6-7-6z'/%3E%3Cline x1='9' y1='18' x2='9' y2='21'/%3E%3Cline x1='15' y1='18' x2='15' y2='21'/%3E%3Cline x1='9' y1='21' x2='15' y2='21'/%3E%3C/svg%3E") center / contain no-repeat; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Cpath d='M12 2C8 2 5 5 5 8c0 2 1 3.5 2 4.5V18h10v-5.5c1-1 2-2.5 2-4.5 0-3-3-6-7-6z'/%3E%3Cline x1='9' y1='18' x2='9' y2='21'/%3E%3Cline x1='15' y1='18' x2='15' y2='21'/%3E%3Cline x1='9' y1='21' x2='15' y2='21'/%3E%3C/svg%3E") center / contain no-repeat; }
.icon-fluid    { background-color: var(--green); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Cpath d='M12 2 Q17 8 17 13a5 5 0 0 1-10 0Q7 8 12 2z'/%3E%3C/svg%3E") center / contain no-repeat; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Cpath d='M12 2 Q17 8 17 13a5 5 0 0 1-10 0Q7 8 12 2z'/%3E%3C/svg%3E") center / contain no-repeat; }
.icon-compute  { background-color: var(--green); -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Crect x='3' y='5' width='18' height='14' rx='1'/%3E%3Cline x1='7' y1='9' x2='7' y2='15'/%3E%3Cline x1='11' y1='7' x2='11' y2='15'/%3E%3Cline x1='15' y1='10' x2='15' y2='15'/%3E%3C/svg%3E") center / contain no-repeat; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.5'%3E%3Crect x='3' y='5' width='18' height='14' rx='1'/%3E%3Cline x1='7' y1='9' x2='7' y2='15'/%3E%3Cline x1='11' y1='7' x2='11' y2='15'/%3E%3Cline x1='15' y1='10' x2='15' y2='15'/%3E%3C/svg%3E") center / contain no-repeat; }

/* ── Publications ────────────────────────────────────────────── */
.pub-list { list-style: none; }
.pub-item {
  display: flex;
  gap: 1.75rem;
  padding: 1.1rem 0;
  border-bottom: 1px solid var(--border);
  align-items: baseline;
}
.pub-item:first-child { border-top: 1px solid var(--border); }
.pub-year {
  font-family: var(--mono);
  font-size: .65rem;
  color: var(--text3);
  letter-spacing: .1em;
  flex-shrink: 0;
  padding-top: .15rem;
}
.pub-body { display: flex; flex-direction: column; gap: .25rem; }
.pub-title {
  font-family: var(--serif);
  font-size: .98rem;
  color: var(--text);
  line-height: 1.5;
}
.pub-title:hover { color: var(--gold2); }
.pub-authors { font-size: .85rem; color: var(--text3); font-style: italic; }
.pub-journal {
  font-family: var(--mono);
  font-size: .65rem;
  letter-spacing: .08em;
  color: var(--green);
  text-transform: uppercase;
}
.pub-tags { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .25rem; }
.pub-tag {
  font-family: var(--mono);
  font-size: .58rem;
  letter-spacing: .1em;
  color: var(--text3);
  background: var(--bg3);
  border: 1px solid var(--border);
  padding: .15rem .5rem;
  text-transform: uppercase;
}
.pub-year-group { margin-bottom: 2.5rem; }
.pub-year-heading {
  font-family: var(--display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: .25rem;
}

/* ── Page hero (inner pages) ─────────────────────────────────── */
.page-hero {
  padding: 8rem 0 3rem;
  border-bottom: 1px solid var(--border);
}
.page-title {
  font-family: var(--display);
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 500;
  color: var(--gold);
  margin-bottom: .75rem;
}
.page-intro {
  font-size: 1rem;
  color: var(--text2);
  font-style: italic;
  max-width: 580px;
  line-height: 1.8;
}
.inline-link { color: var(--green2); border-bottom: 1px solid var(--border2); }
.inline-link:hover { color: var(--gold2); border-color: var(--gold2); }

/* ── Research detail ─────────────────────────────────────────── */
.research-detail { padding: 4rem 0; }
.research-detail-item {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
}
.research-detail-item:first-child { border-top: 1px solid var(--border); }
.research-detail-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-top: .2rem;
  opacity: .65;
  background-size: contain;
  background-repeat: no-repeat;
}
.research-detail-text h2 {
  font-family: var(--display);
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: .5rem;
}
.research-detail-text p { font-size: .95rem; color: var(--text2); line-height: 1.75; }

/* ── Writing / posts ─────────────────────────────────────────── */
.writing-section { padding: 3rem 0 5rem; }
.post-list { list-style: none; }
.post-list-item {
  display: flex;
  gap: 1.75rem;
  align-items: baseline;
  padding: .85rem 0;
  border-bottom: 1px solid var(--border);
}
.post-list-date {
  font-family: var(--mono);
  font-size: .65rem;
  color: var(--text3);
  letter-spacing: .1em;
  flex-shrink: 0;
}
.post-list-title { font-size: .95rem; color: var(--text2); }
.post-list-title:hover { color: var(--gold2); }

/* ── Post article ────────────────────────────────────────────── */
.post-article {
  max-width: 680px;
  margin: 0 auto;
  padding: 8rem clamp(1.5rem, 5vw, 3rem) 5rem;
}
.post-header { margin-bottom: 2.5rem; }
.post-meta {
  font-family: var(--mono);
  font-size: .65rem;
  letter-spacing: .15em;
  color: var(--text3);
  text-transform: uppercase;
  margin-bottom: .75rem;
}
.post-title {
  font-family: var(--display);
  font-size: 2.2rem;
  font-weight: 500;
  color: var(--gold);
  line-height: 1.2;
}
.post-content p { margin-bottom: 1.25rem; color: var(--text2); font-size: 1rem; }
.post-content h2 { font-family: var(--display); font-size: 1.5rem; color: var(--gold); margin: 2rem 0 .75rem; }
.post-content img { margin: 1.5rem 0; border: 1px solid var(--border); }
.post-back {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .12em;
  text-transform: uppercase;
}

/* ── Footer ──────────────────────────────────────────────────── */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 2.5rem 0;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 5vw, 4rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-bio { display: flex; flex-direction: column; gap: .25rem; }
.footer-name {
  font-family: var(--mono);
  font-size: .68rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--text2);
}
.footer-role {
  font-family: var(--mono);
  font-size: .6rem;
  letter-spacing: .12em;
  color: var(--text3);
}
.footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.footer-links a {
  font-family: var(--mono);
  font-size: .62rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text3);
}
.footer-links a:hover { color: var(--green2); }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 760px) {
  .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .nav-external { display: none; }
  .nav-links { gap: 1.2rem; }
  .research-detail-item { flex-direction: column; gap: .75rem; }
}
@media (max-width: 500px) {
  .nav-links li:nth-child(n+3) { display: none; }
  .hero-actions { flex-direction: column; }
}
```

---

## `assets/js/botanical.js`

This draws the organic branching animation in the hero. It only runs on the homepage.

```javascript
(function () {
  const canvas = document.getElementById('botanical-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, branches = [], frame = 0;

  const PALETTE = [
    'rgba(74,140,88,',
    'rgba(90,170,100,',
    'rgba(200,164,98,',
    'rgba(60,110,70,',
  ];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    branches = [];
    seed();
  }

  // A branch is a slowly-growing bezier segment
  function Branch(x, y, angle, len, depth, colorIdx) {
    this.x = x; this.y = y;
    this.angle = angle;
    this.len = len;
    this.depth = depth;
    this.colorIdx = colorIdx;
    this.progress = 0;
    this.speed = 0.004 + Math.random() * 0.003;
    this.children = [];
    this.spawned = false;
    const wobble = (Math.random() - 0.5) * 0.6;
    const ax = x + Math.cos(angle + wobble) * len * 0.45;
    const ay = y + Math.sin(angle + wobble) * len * 0.45;
    this.cp = { x: ax, y: ay };
    this.ex = x + Math.cos(angle) * len;
    this.ey = y + Math.sin(angle) * len;
  }

  Branch.prototype.tip = function (t) {
    const it = 1 - t;
    return {
      x: it * it * this.x + 2 * it * t * this.cp.x + t * t * this.ex,
      y: it * it * this.y + 2 * it * t * this.cp.y + t * t * this.ey,
    };
  };

  Branch.prototype.update = function () {
    if (this.progress < 1) {
      this.progress = Math.min(1, this.progress + this.speed);
    }
    if (this.progress > 0.85 && !this.spawned && this.depth > 0) {
      this.spawned = true;
      const tip = this.tip(1);
      const spread = this.depth > 2 ? 0.4 : 0.6;
      const nLen = this.len * (0.6 + Math.random() * 0.15);
      if (Math.random() > 0.25) {
        branches.push(new Branch(tip.x, tip.y, this.angle - spread * (0.5 + Math.random() * 0.5), nLen, this.depth - 1, (this.colorIdx + 1) % PALETTE.length));
      }
      if (Math.random() > 0.25) {
        branches.push(new Branch(tip.x, tip.y, this.angle + spread * (0.5 + Math.random() * 0.5), nLen, this.depth - 1, this.colorIdx));
      }
      // Occasionally keep going straight
      if (Math.random() > 0.55) {
        branches.push(new Branch(tip.x, tip.y, this.angle + (Math.random() - 0.5) * 0.2, nLen * 0.85, this.depth - 1, this.colorIdx));
      }
    }
    for (const c of this.children) c.update();
  };

  Branch.prototype.draw = function () {
    const alpha = 0.12 + (1 - this.depth / 6) * 0.22;
    const w = 0.4 + this.depth * 0.35;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    const steps = 18;
    for (let i = 1; i <= steps; i++) {
      const t = (i / steps) * this.progress;
      const p = this.tip(t);
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = PALETTE[this.colorIdx] + alpha + ')';
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.stroke();
    // small node dots at joints
    if (this.progress >= 1) {
      const tip = this.tip(1);
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, w * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE[this.colorIdx] + (alpha + 0.15) + ')';
      ctx.fill();
    }
  };

  function seed() {
    // Plant 4-6 root branches along the right side of the canvas
    const count = 5 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const x = W * (0.35 + Math.random() * 0.55);
      const y = H * (0.2 + Math.random() * 0.7);
      const angle = -Math.PI * (0.25 + Math.random() * 0.6);
      const len = Math.min(W, H) * (0.12 + Math.random() * 0.1);
      branches.push(new Branch(x, y, angle, len, 5 + Math.floor(Math.random() * 2), i % PALETTE.length));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const b of branches) {
      b.update();
      b.draw();
    }
    // Periodically re-seed a new root so the canvas stays alive
    frame++;
    if (frame % 420 === 0 && branches.length < 160) {
      const x = W * (0.4 + Math.random() * 0.5);
      const y = H * (0.1 + Math.random() * 0.85);
      const angle = -Math.PI * (0.2 + Math.random() * 0.65);
      const len = Math.min(W, H) * (0.1 + Math.random() * 0.1);
      branches.push(new Branch(x, y, angle, len, 4 + Math.floor(Math.random() * 3), Math.floor(Math.random() * PALETTE.length)));
    }
    // Prune very old fully-drawn deep branches to avoid memory creep
    if (branches.length > 220) branches.splice(0, 20);
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();
```

---

## Setup notes

**Gemfile** (for local preview):
```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-seo-tag"
```

**Run locally:**
```bash
bundle install
bundle exec jekyll serve
```

**To add a publication:** edit `_data/publications.yml`, add an entry at the top, push to GitHub.

**To add a research area:** edit `_data/research.yml`.

**To add a blog post:** create `_posts/YYYY-MM-DD-title.md` with front matter:
```yaml
---
layout: post
title: "Your title"
date: 2025-03-15
---
```
