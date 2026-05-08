# ✍️ Contributing to Technical Creators Club

Thanks for wanting to write for Technical Creators Club! Posts are plain Markdown files — no special tools required.

## How to Add a Post

### 1. Fork & Branch

```bash
git clone https://github.com/Technical-Creators-Club/Technical-Creators-Club.github.io.git
git checkout -b post/your-post-title
```

### 2. Create Your Post File

Add a file in the `_posts/` directory using this naming convention:

```
_posts/YYYY-MM-DD-your-post-slug.md
```

**Example:** `_posts/2026-05-15-understanding-docker-networking.md`

### 3. Use the Post Template

Start your post with this front matter block, then the content:

```markdown
---
layout: post
title: "Your Post Title Here"
date: YYYY-MM-DD
categories: [tag1, tag2]
author: Your Name
excerpt: "One sentence summary of the post."
---

# 🔖 Your Post Title Here

> **Author:** [@yourhandle](https://github.com/yourhandle) · **Tags:** `tag1` `tag2` · **Reading time:** ~X min

---

Your content here...

---

[← Back to homepage](../index.md)
```

### 4. Writing Guidelines

- **Be direct.** Start with the useful content — skip filler intros.
- **Use code blocks** for any commands or code snippets.
- **Keep it practical.** Readers should be able to apply something after reading.
- **Aim for 300–2000 words.** Short is fine; long is fine if it earns the length.
- **One topic per post.** Don't try to cover everything in one article.

### 5. Update the README Index

Add your post to the **Latest Posts** table in `README.md`:

```markdown
| N | [📝 Your Post Title](posts/YYYY-MM-DD-your-slug.md) | YYYY-MM-DD | `tag1` `tag2` | X min |
```

Add it at the top (highest number) and renumber the others.

### 6. Open a Pull Request

Push your branch and open a PR with:
- **Title:** the post title
- **Description:** 1–2 sentences on what the post covers

---

## Post Naming Convention

| Part | Format | Example |
|------|--------|---------|
| Directory | `_posts/` | — |
| Date | `YYYY-MM-DD` | `2026-05-15` |
| Separator | `-` | — |
| Slug | lowercase, hyphens | `docker-networking-explained` |
| Extension | `.md` | — |

**Full example:** `2026-05-15-docker-networking-explained.md`

---

## Tag Suggestions

Use short, lowercase tags. Common ones:

`git` `tools` `dx` `productivity` `architecture` `security` `cloud` `devops` `web` `ai` `open-source` `meta`

---

## Questions?

Open an issue or start a discussion in the repo.
