export const detectLanguage = (path: string): 'zh' | 'en' => {
  return path.startsWith('/en/') ? 'en' : 'zh';
};

export const getLocalizedContent = (frontmatter: any, lang: 'zh' | 'en') => {
  if (lang === 'en') {
    return {
      title: frontmatter.titleEn || frontmatter.title_en || frontmatter.title,
      description: frontmatter.descriptionEn || frontmatter.description_en || frontmatter.description,
      tags: frontmatter.tagsEn || frontmatter.tags_en || frontmatter.tags,
    };
  }
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    tags: frontmatter.tags,
  };
};

export const i18n = {
  zh: {
    sections: {
      papers: '论文',
      tech: '技术',
      movies: '电影',
      books: '读书',
      misc: '杂谈',
      wander: '漫游'
    },
    labels: {
      publishDate: '发布日期',
      nextPost: '下一篇',
      prevPost: '上一篇',
      goHome: '去首页',
      edit: 'Edit'
    }
  },
  en: {
    sections: {
      papers: 'Papers',
      tech: 'Tech',
      movies: 'Movies',
      books: 'Books',
      misc: 'Misc',
      wander: 'Wander'
    },
    labels: {
      publishDate: 'Published',
      nextPost: 'Next',
      prevPost: 'Previous', 
      goHome: 'Home',
      edit: 'Edit'
    }
  }
};

export const t = (key: string, lang: 'zh' | 'en') => {
  const keys = key.split('.');
  let value: any = i18n[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};
