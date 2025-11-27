"use client";

import { useState, useMemo } from 'react';
import { SiteHeader } from '@/components/site-header';
import { NewsCard } from '@/components/news-card';
import { AdCard } from '@/components/ad-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { allArticles } from '@/lib/data';
import type { Article } from '@/lib/types';
import { Search } from 'lucide-react';

const categories = ["All", "Technology", "Sports", "Politics", "Business", "Health"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            article.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const itemsWithAds = useMemo(() => {
      const items: (Article | { type: 'ad'; id: string })[] = [];
      for (let i = 0; i < filteredArticles.length; i++) {
          items.push(filteredArticles[i]);
          if ((i + 1) % 5 === 0) {
              items.push({ type: 'ad', id: `ad-${i}` });
          }
      }
      return items;
  }, [filteredArticles]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-12 space-y-6">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search articles by keyword..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          <div className="flex justify-center flex-wrap gap-3">
            {categories.map(category => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {itemsWithAds.map((item) => 
              'type' in item && item.type === 'ad' ? (
                <AdCard key={item.id} />
              ) : (
                <NewsCard key={(item as Article).id} article={item as Article} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">No Articles Found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filter settings.</p>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NewsWave. All Rights Reserved.
      </footer>
    </div>
  );
}
