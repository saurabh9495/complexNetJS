export type Category = 'Technology' | 'Sports' | 'Politics' | 'Business' | 'Health';

export type Article = {
  id: string;
  title: string;
  description: string;
  source: string;
  category: Category;
  imageUrl: string;
  date: string;
  imageHint: string;
};

export type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};
