import { SITE } from "@/config";
import rss from "@astrojs/rss";

export async function GET() {
  // 获取所有分类的文章
  const paperPosts = Object.values(import.meta.glob("./posts/papers/*.md", { eager: true }));
  const techPosts = Object.values(import.meta.glob("./posts/tech/*.md", { eager: true }));
  const moviePosts = Object.values(import.meta.glob("./posts/movies/*.md", { eager: true }));
  const bookPosts = Object.values(import.meta.glob("./posts/books/*.md", { eager: true }));
  const miscPosts = Object.values(import.meta.glob("./posts/misc/*.md", { eager: true }));
  const wanderPosts = Object.values(import.meta.glob("./posts/wander/*.md", { eager: true }));

  // 合并所有文章
  let allPosts = [...paperPosts, ...techPosts, ...moviePosts, ...bookPosts, ...miscPosts, ...wanderPosts];

  // 按日期排序（最新的在前）
  allPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || a.frontmatter.pubDate || 0);
    const dateB = new Date(b.frontmatter.date || b.frontmatter.pubDate || 0);
    return dateB - dateA;
  });

  // 只保留最近的12篇文章
  allPosts = allPosts.slice(0, 12);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.homePage,
    items: allPosts.map((post) => ({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      link: post.url,
      pubDate: new Date(post.frontmatter.date || post.frontmatter.pubDate),
    })),
  });
}
