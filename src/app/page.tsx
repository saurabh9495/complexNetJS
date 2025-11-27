"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { SiteHeader } from '@/components/site-header';
import { NewsCard } from '@/components/news-card';
import { AdCard } from '@/components/ad-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Article } from '@/lib/types';
import { Search } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const categories = ["All", "General", "Technology", "Sports", "Politics", "Business", "Health"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [articles, setArticles] = useState<Article[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const firestore = useFirestore();

  const initialQuery = useMemo(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'articles'), orderBy('publishedAt', 'desc'), limit(12));
    if (selectedCategory !== 'All') {
      q = query(q, where('category', '==', selectedCategory));
    }
    return q;
  }, [firestore, selectedCategory]);

  const { data: initialArticles, loading: initialLoading } = useCollection(initialQuery, {
    idField: 'id',
    listen: false,
  });

  useEffect(() => {
    if (initialArticles) {
      setArticles(initialArticles as Article[]);
      if (initialArticles.length > 0) {
        // This is a bit of a hack, we need the document snapshot
        getDocs(initialQuery!).then(docSnaps => {
            setLastVisible(docSnaps.docs[docSnaps.docs.length - 1]);
        });
      }
      setHasMore(initialArticles.length === 12);
    }
  }, [initialArticles, initialQuery]);
  
  const loadMore = useCallback(async () => {
    if (!firestore || !lastVisible || loading || !hasMore) return;
    setLoading(true);

    let q = query(collection(firestore, 'articles'), orderBy('publishedAt', 'desc'), startAfter(lastVisible), limit(8));
    if (selectedCategory !== 'All') {
        q = query(q, where('category', '==', selectedCategory));
    }

    try {
        const documentSnapshots = await getDocs(q);
        const newArticles = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[];

        setArticles(prev => [...prev, ...newArticles]);
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1]);
        setHasMore(newArticles.length === 8);
    } catch(e) {
        console.error("Error loading more articles:", e);
        setHasMore(false);
    } finally {
        setLoading(false);
    }
  }, [firestore, lastVisible, loading, hasMore, selectedCategory]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 300 || loading) {
        return;
      }
      loadMore();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, loading]);


  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [articles, searchTerm]);
  
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
  
  const displayItems = searchTerm ? itemsWithAds.filter(item => 'title' in item) : itemsWithAds;

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
                onClick={() => {
                  setSelectedCategory(category);
                  setArticles([]);
                  setLastVisible(null);
                  setHasMore(true);
                }}
                className="rounded-full px-6"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {(initialLoading && articles.length === 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-4 rounded-lg">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2 px-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    </div>
                ))}
            </div>
        ) : filteredArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayItems.map((item) => 
                'type' in item && item.type === 'ad' ? (
                  <AdCard key={item.id} />
                ) : (
                  <NewsCard key={(item as Article).id} article={item as Article} />
                )
              )}
            </div>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col space-y-4 rounded-lg">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                    <div className="space-y-2 px-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!hasMore && (
              <p className="text-center text-muted-foreground mt-8">You've reached the end.</p>
            )}
          </>
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
