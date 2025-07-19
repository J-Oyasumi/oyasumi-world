import tailwind from "@astrojs/tailwind";
import dayjs from "dayjs";
import fs from "fs";

import { defineConfig } from "astro/config";
import { parse } from "node-html-parser";
import rehypeCustomizeImageSrc from "./rehype-customize-image-src.js";
import { SITE } from "./src/config";

// 数学公式渲染支持
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const DEFAULT_FORMAT = "YYYY/MM/DD";

function formatDate(date) {
  return dayjs(date).format(DEFAULT_FORMAT);
}

function getFileCreateDate(filePath) {
  return formatDate(fs.statSync(filePath).birthtime);
}

function defaultLayoutPlugin() {
  return function (tree, file) {
    const filePath = file.history[0];
    const { frontmatter } = file.data.astro;
    frontmatter.layout = "@layouts/post.astro";

    // 如果没有设置图片，尝试从文章第一行提取
    if (tree.children[0]?.value && !frontmatter.image) {
      const imageElement = parse(tree.children[0].value).querySelector("img");
      if (imageElement) {
        frontmatter.image = imageElement.getAttribute("src");
      }
    }

    // 如果没有设置描述，尝试从文章第二行提取
    if (tree.children[1]?.children[1]?.value && !frontmatter.description) {
      frontmatter.description = tree.children[1].children[1].value;
    }

    // 设置默认值
    frontmatter.description = frontmatter.description || SITE.description;
    frontmatter.image = frontmatter.image || SITE.icon;

    // 如果没有设置日期，使用文件创建时间
    if (!frontmatter.date && !frontmatter.pubDate) {
      frontmatter.date = getFileCreateDate(filePath);
    }
  };
}

export default defineConfig({
  prefetch: true,
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [defaultLayoutPlugin, remarkMath],
    rehypePlugins: [rehypeCustomizeImageSrc, rehypeKatex],
  },
});
