# Grand Ωmega GitHub Pages Site — Design Spec

## Overview

A static content site for the Grand Ωmega organization, built with Zola and deployed via GitHub Actions to `grand-omega.github.io`. The site serves two purposes: a wiki-style knowledge base (internal guides + per-project documentation) and a chronological blog. The visual design is minimal and content-first, inspired by the Arch Wiki and GitHub's documentation style.

## Site Structure

```
grand-omega.github.io/
├── config.toml
├── content/
│   ├── _index.md            # Homepage
│   ├── blog/
│   │   ├── _index.md        # Blog listing
│   │   └── *.md             # Blog posts
│   └── docs/
│       ├── _index.md        # Docs landing (all wiki pages)
│       ├── project-alpha/   # Example project section
│       │   ├── _index.md
│       │   └── *.md
│       └── guides/          # Knowledge base articles
│           ├── _index.md
│           └── *.md
├── static/                  # Static assets
├── templates/               # Tera templates
├── sass/                    # Sass stylesheets
└── .github/workflows/
    └── deploy.yml           # GitHub Actions workflow
```

### Content organization

- `docs/` is the wiki. Pages are organized in loose category folders (per-project folders, `guides/`, etc.) but every page is a peer — flat, wiki-style navigation.
- `blog/` is chronological. Posts are date-prefixed in frontmatter.
- Tags are shared across both sections via Zola's taxonomy system. A tag page lists all tagged content regardless of section.

## Templates

Four core templates:

### `base.html`
Shared shell for all pages:
- Header with site title and navigation: `Docs | Blog | Tags`
- Search bar (Zola elasticlunr)
- Light/dark mode toggle
- Footer with organization info

### `index.html`
Homepage extending `base.html`:
- Brief organization intro
- Recent blog posts (last 5)
- Recently updated wiki pages (last 5)

### `page.html`
Single content page (wiki article or blog post):
- Title, date, tags
- Auto-generated table of contents sidebar (from headings)
- Content body
- Tags displayed as links at the bottom

### `section.html`
Listing page (blog index, docs index, tag listing):
- List of pages sorted by date
- Each entry shows: title, date, summary/description, tags

## Styling

### Approach
Plain Sass compiled by Zola — no CSS framework.

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
- Monospace for code: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`

### Layout
- Max content width: ~800px, centered
- TOC sidebar on wide screens (>1024px), hidden on narrow
- Responsive — content reflows cleanly on mobile

### Color palette
- Light mode: near-black text (#24292f), white background (#ffffff), blue links (#0969da), grey borders (#d0d7de)
- Dark mode: light text (#e6edf3), dark background (#0d1117), blue links (#58a6ff), grey borders (#30363d)
- Mode detection via `prefers-color-scheme` with JS toggle, persisted in `localStorage`

### Code blocks
- Zola built-in syntax highlighting
- Highlight theme: `inspired-github` (light) / a dark variant

## Features

### Search
- Zola's built-in elasticlunr search index
- Search bar in the header, results displayed inline
- Client-side, no external dependencies
- Enabled via `build_search_index = true` in `config.toml`

### Tags
- Zola taxonomy: `taxonomies = [{name = "tags"}]`
- Shared across blog and docs
- `/tags/` page lists all tags
- `/tags/<tag>/` page lists all content with that tag

### Table of Contents
- Auto-generated from page headings via Zola's `page.toc`
- Displayed as a sidebar on wide screens
- Sticky positioning so it scrolls with content

## Deployment

### GitHub Actions workflow
- Trigger: push to `main` branch
- Action: `shalzz/zola-deploy-action`
- Deploys built site to `gh-pages` branch
- GitHub Pages configured to serve from `gh-pages`

### Workflow file (`.github/workflows/deploy.yml`)
- Uses latest Zola version
- Runs on `ubuntu-latest`
- Single job: checkout → build → deploy

## Content authoring

- All content is Markdown with Zola frontmatter (TOML `+++` blocks)
- Single contributor workflow: write markdown, push via git
- No CMS or external editing tools

## Out of scope (for now)

- Multi-language / i18n
- RSS feed
- Custom domain
- Comments
- Analytics
