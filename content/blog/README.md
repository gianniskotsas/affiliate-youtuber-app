# Blog Content

This directory contains all the blog posts for the Veevo blog. Each blog post is written in MDX format, which allows you to use Markdown with React components.

## Creating a New Blog Post

To create a new blog post, follow these steps:

1. Create a new `.mdx` file in this directory with a descriptive name (e.g., `my-new-blog-post.mdx`).
2. Add the required frontmatter at the top of the file:

```mdx
---
title: 'Your Blog Post Title'
description: 'A brief description of your blog post'
date: 'YYYY-MM-DD'
author: 'Your Name'
image: '/blog/your-image.jpg'
tags: ['tag1', 'tag2', 'tag3']
---
```

3. Write your blog post content using Markdown syntax.
4. Add any images to the `/public/blog/` directory.

## Frontmatter Fields

- `title`: The title of your blog post
- `description`: A brief description of your blog post (used for SEO and previews)
- `date`: The publication date in YYYY-MM-DD format
- `author`: The author of the blog post
- `image`: The path to the featured image (relative to the `/public` directory)
- `tags`: An array of tags for categorizing the blog post

## Markdown Features

You can use standard Markdown syntax in your blog posts, including:

- Headers (# for h1, ## for h2, etc.)
- Lists (both ordered and unordered)
- Links
- Images
- Code blocks with syntax highlighting
- Blockquotes
- Tables

## Code Examples

To include code examples with syntax highlighting, use triple backticks with the language specified:

```javascript
// Your code here
const example = "Hello, world!";
console.log(example);
```

## Images

To include images in your blog post, place them in the `/public/blog/` directory and reference them using standard Markdown image syntax:

```markdown
![Alt text](/blog/your-image.jpg)
```

## Need Help?

If you have any questions about creating blog posts, please contact the development team. 