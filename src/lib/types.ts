export type Category = 'Technology' | 'Sports' | 'Politics' | 'Business' | 'Health' | 'General';

export type Article = {
  id: string;
  title: string;
  description: string;
  source: string;
  category: Category;
  imageUrl: string;
  imageHint: string;
  publishedAt: string;
  createdAt: string;
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
