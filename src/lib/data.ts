import data from './placeholder-images.json';
import type { Article, Ad } from './types';

// The type assertion is safe because we control the JSON structure.
export const allArticles: Article[] = data.articles as Article[];
export const adData: Ad = data.ad as Ad;
