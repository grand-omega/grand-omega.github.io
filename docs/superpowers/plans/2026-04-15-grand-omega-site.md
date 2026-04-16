# Grand Omega Zola Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a wiki + blog static site for Grand Omega using Zola, with custom theme, search, tags, and GitHub Actions deployment.

**Architecture:** Zola static site generator with a custom theme built from scratch. Four Tera templates (`base.html`, `index.html`, `page.html`, `section.html`) styled with plain Sass. Content organized as `docs/` (wiki) and `blog/` sections with shared tags taxonomy. Deployed via GitHub Actions to GitHub Pages.

**Tech Stack:** Zola 0.22+, Tera templates, Sass, GitHub Actions (`shalzz/zola-deploy-action`)

---

## File Map

### New files to create:

| File | Responsibility |
|------|---------------|
| `config.toml` | Zola site configuration (base URL, title, taxonomies, search, syntax highlighting) |
| `sass/style.scss` | All styles: reset, typography, layout, header/footer, light/dark theme, TOC, code blocks, search |
| `templates/base.html` | Shared HTML shell: head, header nav, search bar, dark mode toggle, footer, JS |
| `templates/index.html` | Homepage: intro text, recent blog posts, recent wiki pages |
| `templates/page.html` | Single page: title, date, tags, TOC sidebar, content body |
| `templates/section.html` | Listing page: sorted page list with title, date, description, tags |
| `templates/tags/single.html` | Single tag page: list of all content with that tag |
| `templates/tags/list.html` | All tags page: list of every tag with count |
| `content/_index.md` | Homepage content/frontmatter |
| `content/blog/_index.md` | Blog section frontmatter |
| `content/blog/2026-04-15-hello-world.md` | Example blog post (for testing) |
| `content/docs/_index.md` | Docs section frontmatter |
| `content/docs/guides/_index.md` | Guides subsection frontmatter |
| `content/docs/guides/getting-started.md` | Example wiki page (for testing) |
| `static/search.js` | Client-side search logic for elasticlunr index |
| `.github/workflows/deploy.yml` | GitHub Actions workflow for Pages deployment |

---

### Task 1: Zola project scaffolding and config

**Files:**
- Create: `config.toml`
- Create: `content/_index.md`
- Create: `content/blog/_index.md`
- Create: `content/docs/_index.md`
- Create: `content/docs/guides/_index.md`

- [ ] **Step 1: Create `config.toml`**

```toml
base_url = "https://grand-omega.github.io"
title = "Grand Omega"
description = "Knowledge base and blog for Grand Omega"
compile_sass = true
build_search_index = true
generate_feeds = false

[markdown]
highlight_code = true
highlight_theme = "inspired-github"

[search]
include_title = true
include_description = true
include_path = true
include_content = true

[taxonomies]
name = "tags"
feed = false

[extra]
```

- [ ] **Step 2: Create `content/_index.md`**

```markdown
+++
title = "Grand Omega"
sort_by = "date"
+++

Welcome to **Grand Omega** — our knowledge base and blog.

Browse the [documentation](/docs/) or read the [blog](/blog/).
```

- [ ] **Step 3: Create `content/blog/_index.md`**

```markdown
+++
title = "Blog"
sort_by = "date"
template = "section.html"
page_template = "page.html"
+++
```

- [ ] **Step 4: Create `content/docs/_index.md`**

```markdown
+++
title = "Documentation"
sort_by = "title"
template = "section.html"
page_template = "page.html"
+++
```

- [ ] **Step 5: Create `content/docs/guides/_index.md`**

```markdown
+++
title = "Guides"
sort_by = "title"
template = "section.html"
page_template = "page.html"
+++
```

- [ ] **Step 6: Verify Zola recognizes the project**

Run: `zola check`
Expected: No errors (warnings about missing templates are OK at this stage)

- [ ] **Step 7: Commit**

```bash
git add config.toml content/
git commit -m "feat: add Zola config and content structure"
```

---

### Task 2: Base template and header/footer

**Files:**
- Create: `templates/base.html`

- [ ] **Step 1: Create `templates/base.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{% block title %}{{ config.title }}{% endblock title %}</title>
    <meta name="description" content="{% block description %}{{ config.description }}{% endblock description %}">
    <link rel="stylesheet" href="{{ get_url(path='style.css') }}">
</head>
<body>
    <header class="site-header">
        <nav class="nav-container">
            <a href="{{ get_url(path='/') }}" class="site-title">{{ config.title }}</a>
            <ul class="nav-links">
                <li><a href="{{ get_url(path='docs') }}">Docs</a></li>
                <li><a href="{{ get_url(path='blog') }}">Blog</a></li>
                <li><a href="{{ get_url(path='tags') }}">Tags</a></li>
            </ul>
            <div class="nav-right">
                <div class="search-wrapper">
                    <input type="search" id="search-input" placeholder="Search..." aria-label="Search">
                    <div id="search-results" class="search-results" hidden></div>
                </div>
                <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
                    <span class="theme-icon-light">☀</span>
                    <span class="theme-icon-dark">☾</span>
                </button>
            </div>
        </nav>
    </header>

    <main class="main-container">
        {% block content %}{% endblock content %}
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <p>&copy; {{ now() | date(format="%Y") }} Grand Omega</p>
        </div>
    </footer>

    {% if config.build_search_index %}
    <script src="{{ get_url(path='elasticlunr.min.js') }}"></script>
    <script src="{{ get_url(path='search_index.en.js') }}"></script>
    <script src="{{ get_url(path='search.js') }}"></script>
    {% endif %}
    <script>
        (function() {
            var theme = localStorage.getItem('theme');
            if (!theme) {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.setAttribute('data-theme', theme);

            document.getElementById('theme-toggle').addEventListener('click', function() {
                var current = document.documentElement.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            });
        })();
    </script>
</body>
</html>
```

- [ ] **Step 2: Verify Zola builds with the template**

Run: `zola build`
Expected: Build succeeds (may warn about missing section template)

- [ ] **Step 3: Commit**

```bash
git add templates/base.html
git commit -m "feat: add base template with nav, search, dark mode toggle"
```

---

### Task 3: Sass stylesheet

**Files:**
- Create: `sass/style.scss`

- [ ] **Step 1: Create `sass/style.scss`**

```scss
// === Reset ===
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

// === Variables (light theme) ===
:root {
    --color-text: #24292f;
    --color-bg: #ffffff;
    --color-link: #0969da;
    --color-border: #d0d7de;
    --color-bg-secondary: #f6f8fa;
    --color-text-muted: #656d76;
    --font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    --content-width: 800px;
    --toc-width: 220px;
}

// === Dark theme ===
[data-theme="dark"] {
    --color-text: #e6edf3;
    --color-bg: #0d1117;
    --color-link: #58a6ff;
    --color-border: #30363d;
    --color-bg-secondary: #161b22;
    --color-text-muted: #8b949e;
}

// === Base ===
html {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text);
    background-color: var(--color-bg);
    -webkit-font-smoothing: antialiased;
}

a {
    color: var(--color-link);
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
}

code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    padding: 0.2em 0.4em;
    background-color: var(--color-bg-secondary);
    border-radius: 3px;
}

pre {
    padding: 1rem;
    overflow-x: auto;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-bg-secondary);
    code {
        padding: 0;
        background: none;
        border-radius: 0;
    }
}

// === Header ===
.site-header {
    border-bottom: 1px solid var(--color-border);
    padding: 0.75rem 1rem;
}

.nav-container {
    max-width: calc(var(--content-width) + var(--toc-width) + 2rem);
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.site-title {
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--color-text);
    white-space: nowrap;
    &:hover {
        text-decoration: none;
    }
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    a {
        color: var(--color-text);
        font-size: 0.875rem;
        &:hover {
            color: var(--color-link);
            text-decoration: none;
        }
    }
}

.nav-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

// === Search ===
.search-wrapper {
    position: relative;
}

#search-input {
    font-family: var(--font-body);
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    background-color: var(--color-bg);
    color: var(--color-text);
    width: 200px;
    &:focus {
        outline: none;
        border-color: var(--color-link);
        box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.3);
    }
}

.search-results {
    position: absolute;
    top: 100%;
    right: 0;
    width: 400px;
    max-height: 400px;
    overflow-y: auto;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    margin-top: 0.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
}

.search-result-item {
    display: block;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: var(--color-bg-secondary);
    }
    .search-result-title {
        font-weight: 600;
        font-size: 0.875rem;
    }
    .search-result-body {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin-top: 0.125rem;
    }
}

// === Theme Toggle ===
.theme-toggle {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    padding: 0.375rem 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1;
    color: var(--color-text);
}

[data-theme="dark"] .theme-icon-light { display: none; }
[data-theme="light"] .theme-icon-dark,
:root:not([data-theme]) .theme-icon-dark { display: none; }

// === Main Content ===
.main-container {
    max-width: calc(var(--content-width) + var(--toc-width) + 2rem);
    margin: 0 auto;
    padding: 2rem 1rem;
}

// === Page Layout (with TOC sidebar) ===
.page-wrapper {
    display: flex;
    gap: 2rem;
}

.page-content {
    flex: 1;
    min-width: 0;

    h1 { font-size: 2rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; margin-top: 2rem; margin-bottom: 0.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.25rem; }
    h3 { font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
    h4 { font-size: 1rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
    p { margin-bottom: 1rem; }
    ul, ol { margin-bottom: 1rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    blockquote {
        padding: 0.5rem 1rem;
        border-left: 4px solid var(--color-border);
        color: var(--color-text-muted);
        margin-bottom: 1rem;
    }
    img { max-width: 100%; height: auto; }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
        th, td {
            border: 1px solid var(--color-border);
            padding: 0.5rem 0.75rem;
            text-align: left;
        }
        th { background-color: var(--color-bg-secondary); font-weight: 600; }
    }
}

.page-meta {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-bottom: 1.5rem;
}

.page-tags {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
}

.tag {
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 2em;
    color: var(--color-link);
    margin-right: 0.25rem;
    &:hover {
        text-decoration: none;
        background-color: var(--color-border);
    }
}

// === TOC Sidebar ===
.toc-sidebar {
    width: var(--toc-width);
    flex-shrink: 0;
    font-size: 0.8125rem;
    position: sticky;
    top: 1rem;
    align-self: flex-start;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;

    .toc-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        font-size: 0.6875rem;
        letter-spacing: 0.05em;
    }
    ul {
        list-style: none;
        padding-left: 0;
        ul { padding-left: 0.75rem; }
    }
    li { margin-bottom: 0.25rem; }
    a {
        color: var(--color-text-muted);
        &:hover { color: var(--color-link); text-decoration: none; }
    }
}

@media (max-width: 1024px) {
    .toc-sidebar { display: none; }
    .page-wrapper { display: block; }
}

// === Section / Listing Pages ===
.section-list {
    list-style: none;
}

.section-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    &:first-child { border-top: 1px solid var(--color-border); }
}

.section-item-title {
    font-size: 1.125rem;
    font-weight: 600;
}

.section-item-meta {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin-top: 0.125rem;
}

.section-item-description {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 0.25rem;
}

// === Tags List Page ===
.tags-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tags-list-item a {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: 2em;
    font-size: 0.875rem;
    color: var(--color-link);
    &:hover {
        text-decoration: none;
        background-color: var(--color-border);
    }
    .tag-count {
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }
}

// === Homepage ===
.home-section {
    margin-bottom: 2rem;
    h2 {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 0.25rem;
    }
}

// === Footer ===
.site-footer {
    border-top: 1px solid var(--color-border);
    padding: 1rem;
    font-size: 0.8125rem;
    color: var(--color-text-muted);
}

.footer-container {
    max-width: calc(var(--content-width) + var(--toc-width) + 2rem);
    margin: 0 auto;
}
```

- [ ] **Step 2: Verify Zola builds with styles**

Run: `zola build`
Expected: Build succeeds, `public/style.css` is generated

- [ ] **Step 3: Commit**

```bash
git add sass/style.scss
git commit -m "feat: add Sass stylesheet with light/dark theme"
```

---

### Task 4: Page template (single content page)

**Files:**
- Create: `templates/page.html`

- [ ] **Step 1: Create `templates/page.html`**

```html
{% extends "base.html" %}

{% block title %}{{ page.title }} | {{ config.title }}{% endblock title %}
{% block description %}{{ page.description | default(value=config.description) }}{% endblock description %}

{% block content %}
<div class="page-wrapper">
    <article class="page-content">
        <h1>{{ page.title }}</h1>
        <div class="page-meta">
            {% if page.date %}
                <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
            {% endif %}
        </div>

        {{ page.content | safe }}

        {% if page.taxonomies.tags is defined %}
        <div class="page-tags">
            {% for tag in page.taxonomies.tags %}
                <a href="{{ get_taxonomy_url(kind='tags', name=tag) }}" class="tag">{{ tag }}</a>
            {% endfor %}
        </div>
        {% endif %}
    </article>

    {% if page.toc %}
    <aside class="toc-sidebar">
        <div class="toc-title">On this page</div>
        <ul>
        {% for h1 in page.toc %}
            <li>
                <a href="{{ h1.permalink }}">{{ h1.title }}</a>
                {% if h1.children %}
                <ul>
                    {% for h2 in h1.children %}
                    <li><a href="{{ h2.permalink }}">{{ h2.title }}</a></li>
                    {% endfor %}
                </ul>
                {% endif %}
            </li>
        {% endfor %}
        </ul>
    </aside>
    {% endif %}
</div>
{% endblock content %}
```

- [ ] **Step 2: Commit**

```bash
git add templates/page.html
git commit -m "feat: add page template with TOC sidebar"
```

---

### Task 5: Section template (listing pages)

**Files:**
- Create: `templates/section.html`

- [ ] **Step 1: Create `templates/section.html`**

```html
{% extends "base.html" %}

{% block title %}{{ section.title }} | {{ config.title }}{% endblock title %}
{% block description %}{{ section.description | default(value=config.description) }}{% endblock description %}

{% block content %}
<div class="page-content">
    <h1>{{ section.title }}</h1>

    {% if section.content %}
    <div class="section-intro">
        {{ section.content | safe }}
    </div>
    {% endif %}

    {% if section.subsections %}
    {% for subsection_path in section.subsections %}
        {% set subsection = get_section(path=subsection_path) %}
        <h2><a href="{{ subsection.permalink }}">{{ subsection.title }}</a></h2>
        <ul class="section-list">
        {% for page in subsection.pages %}
            <li class="section-item">
                <a href="{{ page.permalink }}" class="section-item-title">{{ page.title }}</a>
                <div class="section-item-meta">
                    {% if page.date %}
                        <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
                    {% endif %}
                    {% if page.taxonomies.tags is defined %}
                        {% for tag in page.taxonomies.tags %}
                            <a href="{{ get_taxonomy_url(kind='tags', name=tag) }}" class="tag">{{ tag }}</a>
                        {% endfor %}
                    {% endif %}
                </div>
                {% if page.description %}
                <div class="section-item-description">{{ page.description }}</div>
                {% endif %}
            </li>
        {% endfor %}
        </ul>
    {% endfor %}
    {% endif %}

    {% if section.pages %}
    <ul class="section-list">
    {% for page in section.pages %}
        <li class="section-item">
            <a href="{{ page.permalink }}" class="section-item-title">{{ page.title }}</a>
            <div class="section-item-meta">
                {% if page.date %}
                    <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
                {% endif %}
                {% if page.taxonomies.tags is defined %}
                    {% for tag in page.taxonomies.tags %}
                        <a href="{{ get_taxonomy_url(kind='tags', name=tag) }}" class="tag">{{ tag }}</a>
                    {% endfor %}
                {% endif %}
            </div>
            {% if page.description %}
            <div class="section-item-description">{{ page.description }}</div>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
    {% endif %}
</div>
{% endblock content %}
```

- [ ] **Step 2: Commit**

```bash
git add templates/section.html
git commit -m "feat: add section template for listing pages"
```

---

### Task 6: Index (homepage) template

**Files:**
- Create: `templates/index.html`

- [ ] **Step 1: Create `templates/index.html`**

```html
{% extends "base.html" %}

{% block content %}
<div class="page-content">
    <div class="home-section">
        {{ section.content | safe }}
    </div>

    {% set blog = get_section(path="blog/_index.md") %}
    <div class="home-section">
        <h2>Recent Posts</h2>
        {% if blog.pages %}
        <ul class="section-list">
        {% for page in blog.pages | slice(end=5) %}
            <li class="section-item">
                <a href="{{ page.permalink }}" class="section-item-title">{{ page.title }}</a>
                <div class="section-item-meta">
                    <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
                </div>
                {% if page.description %}
                <div class="section-item-description">{{ page.description }}</div>
                {% endif %}
            </li>
        {% endfor %}
        </ul>
        {% else %}
        <p>No posts yet.</p>
        {% endif %}
    </div>

    {% set docs = get_section(path="docs/_index.md") %}
    <div class="home-section">
        <h2>Recent Documentation</h2>
        {% set all_doc_pages = [] %}
        {% for page in docs.pages %}
            {% set_global all_doc_pages = all_doc_pages | concat(with=[page]) %}
        {% endfor %}
        {% for subsection_path in docs.subsections %}
            {% set subsection = get_section(path=subsection_path) %}
            {% for page in subsection.pages %}
                {% set_global all_doc_pages = all_doc_pages | concat(with=[page]) %}
            {% endfor %}
        {% endfor %}
        {% if all_doc_pages %}
        <ul class="section-list">
        {% for page in all_doc_pages | sort(attribute="date") | reverse | slice(end=5) %}
            <li class="section-item">
                <a href="{{ page.permalink }}" class="section-item-title">{{ page.title }}</a>
                <div class="section-item-meta">
                    {% if page.date %}
                    <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
                    {% endif %}
                </div>
                {% if page.description %}
                <div class="section-item-description">{{ page.description }}</div>
                {% endif %}
            </li>
        {% endfor %}
        </ul>
        {% else %}
        <p>No documentation yet.</p>
        {% endif %}
    </div>
</div>
{% endblock content %}
```

- [ ] **Step 2: Commit**

```bash
git add templates/index.html
git commit -m "feat: add homepage template with recent posts and docs"
```

---

### Task 7: Tag templates

**Files:**
- Create: `templates/tags/list.html`
- Create: `templates/tags/single.html`

- [ ] **Step 1: Create `templates/tags/list.html`**

```html
{% extends "base.html" %}

{% block title %}Tags | {{ config.title }}{% endblock title %}

{% block content %}
<div class="page-content">
    <h1>Tags</h1>
    <ul class="tags-list">
    {% for term in terms %}
        <li class="tags-list-item">
            <a href="{{ term.permalink }}">
                {{ term.name }}
                <span class="tag-count">({{ term.pages | length }})</span>
            </a>
        </li>
    {% endfor %}
    </ul>
</div>
{% endblock content %}
```

- [ ] **Step 2: Create `templates/tags/single.html`**

```html
{% extends "base.html" %}

{% block title %}{{ term.name }} | {{ config.title }}{% endblock title %}

{% block content %}
<div class="page-content">
    <h1>Tagged: {{ term.name }}</h1>
    <ul class="section-list">
    {% for page in term.pages %}
        <li class="section-item">
            <a href="{{ page.permalink }}" class="section-item-title">{{ page.title }}</a>
            <div class="section-item-meta">
                {% if page.date %}
                    <time datetime="{{ page.date }}">{{ page.date | date(format="%B %e, %Y") }}</time>
                {% endif %}
            </div>
            {% if page.description %}
            <div class="section-item-description">{{ page.description }}</div>
            {% endif %}
        </li>
    {% endfor %}
    </ul>
</div>
{% endblock content %}
```

- [ ] **Step 3: Commit**

```bash
git add templates/tags/
git commit -m "feat: add tag list and single tag templates"
```

---

### Task 8: Search functionality

**Files:**
- Create: `static/search.js`

- [ ] **Step 1: Create `static/search.js`**

```javascript
(function() {
    var input = document.getElementById('search-input');
    var resultsContainer = document.getElementById('search-results');
    if (!input || !resultsContainer) return;

    var index = null;

    function initIndex() {
        if (index) return;
        if (typeof elasticlunr === 'undefined' || typeof searchIndex === 'undefined') return;
        index = elasticlunr.Index.load(searchIndex);
    }

    function doSearch(query) {
        initIndex();
        if (!index) return [];
        return index.search(query, { expand: true }).slice(0, 10);
    }

    function renderResults(results) {
        if (results.length === 0) {
            resultsContainer.hidden = true;
            return;
        }

        var html = '';
        results.forEach(function(result) {
            var doc = result.doc;
            var body = doc.body || '';
            if (body.length > 150) body = body.substring(0, 150) + '...';
            html += '<a class="search-result-item" href="' + doc.id + '">';
            html += '<div class="search-result-title">' + (doc.title || 'Untitled') + '</div>';
            html += '<div class="search-result-body">' + body + '</div>';
            html += '</a>';
        });
        resultsContainer.innerHTML = html;
        resultsContainer.hidden = false;
    }

    var debounceTimer;
    input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        var query = input.value.trim();
        if (query.length < 2) {
            resultsContainer.hidden = true;
            return;
        }
        debounceTimer = setTimeout(function() {
            renderResults(doSearch(query));
        }, 200);
    });

    document.addEventListener('click', function(e) {
        if (!resultsContainer.contains(e.target) && e.target !== input) {
            resultsContainer.hidden = true;
        }
    });

    input.addEventListener('focus', function() {
        if (input.value.trim().length >= 2) {
            renderResults(doSearch(input.value.trim()));
        }
    });
})();
```

- [ ] **Step 2: Commit**

```bash
git add static/search.js
git commit -m "feat: add client-side search with elasticlunr"
```

---

### Task 9: Sample content for testing

**Files:**
- Create: `content/blog/2026-04-15-hello-world.md`
- Create: `content/docs/guides/getting-started.md`

- [ ] **Step 1: Create `content/blog/2026-04-15-hello-world.md`**

```markdown
+++
title = "Hello World"
date = 2026-04-15
description = "Welcome to the Grand Omega blog."

[taxonomies]
tags = ["announcement"]
+++

Welcome to the Grand Omega blog. This is our first post.

## What is Grand Omega?

Grand Omega is a collaborative organization focused on building and sharing knowledge.

## What to expect

We will be publishing:

- Technical guides and tutorials
- Project updates
- Knowledge base articles

Stay tuned for more content.
```

- [ ] **Step 2: Create `content/docs/guides/getting-started.md`**

```markdown
+++
title = "Getting Started"
date = 2026-04-15
description = "How to get started contributing to Grand Omega."

[taxonomies]
tags = ["guides", "onboarding"]
+++

This guide covers how to get started with Grand Omega's knowledge base.

## Prerequisites

- Git installed on your machine
- A text editor (VS Code, Neovim, etc.)
- [Zola](https://www.getzola.org/documentation/getting-started/installation/) installed locally

## Clone the repository

```bash
git clone git@github.com:grand-omega/grand-omega.github.io.git
cd grand-omega.github.io
```

## Local development

Start the Zola dev server:

```bash
zola serve
```

The site will be available at `http://127.0.0.1:1111`.

## Adding content

### Blog posts

Create a new file in `content/blog/` with the naming convention `YYYY-MM-DD-slug.md`:

```markdown
+++
title = "Your Post Title"
date = 2026-04-15
description = "A short summary."

[taxonomies]
tags = ["tag1", "tag2"]
+++

Your content here.
```

### Documentation pages

Create a new file in the appropriate folder under `content/docs/`:

```markdown
+++
title = "Page Title"
date = 2026-04-15
description = "What this page covers."

[taxonomies]
tags = ["topic"]
+++

Your documentation here.
```
```

- [ ] **Step 3: Verify the full site builds and serves**

Run: `zola serve`
Expected: Site builds, accessible at `http://127.0.0.1:1111`, homepage shows recent posts and docs, navigation works, search works, light/dark toggle works, tags pages render.

- [ ] **Step 4: Commit**

```bash
git add content/blog/ content/docs/guides/getting-started.md
git commit -m "feat: add sample blog post and getting-started guide"
```

---

### Task 10: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build and deploy
        uses: shalzz/zola-deploy-action@v0.19.2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for Pages deployment"
```

---

### Task 11: Final verification and cleanup

- [ ] **Step 1: Run full build check**

Run: `zola check`
Expected: No errors

- [ ] **Step 2: Run `zola build` and inspect output**

Run: `zola build && ls public/`
Expected: `index.html`, `style.css`, `blog/`, `docs/`, `tags/`, `search_index.en.js`, `elasticlunr.min.js`, `search.js`

- [ ] **Step 3: Serve and manually verify**

Run: `zola serve`
Verify:
- Homepage loads with intro, recent posts, recent docs
- `/blog/` lists the hello-world post
- `/docs/` lists subsections and pages
- `/docs/guides/getting-started/` renders with TOC sidebar
- `/tags/` shows all tags with counts
- `/tags/announcement/` lists the hello-world post
- Search finds content when typing
- Light/dark toggle works and persists on reload
- Mobile layout hides TOC sidebar

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```
