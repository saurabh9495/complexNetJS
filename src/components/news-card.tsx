import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Article } from '@/lib/types';
import { cn } from '@/lib/utils';

type NewsCardProps = {
  article: Article;
};

const categoryStyles: { [key in Article['category']]: string } = {
  Technology: 'border-chart-3/40 bg-chart-3/10 text-chart-3',
  Sports: 'border-chart-2/40 bg-chart-2/10 text-chart-2',
  Politics: 'border-chart-1/40 bg-chart-1/10 text-chart-1',
  Business: 'border-chart-4/40 bg-chart-4/10 text-chart-4',
  Health: 'border-chart-5/40 bg-chart-5/10 text-chart-5',
};


export function NewsCard({ article }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:-translate-y-1 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={article.imageHint}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="outline" className={cn("mb-2", categoryStyles[article.category])}>{article.category}</Badge>
        <CardTitle className="text-lg leading-snug font-bold">{article.title}</CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3 mt-2">
          {article.description}
        </p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground justify-between p-4 pt-0">
        <span className="font-medium">{article.source}</span>
        <span>{article.date}</span>
      </CardFooter>
    </Card>
  );
}
