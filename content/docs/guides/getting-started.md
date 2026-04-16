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
