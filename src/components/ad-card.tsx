import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adData } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export function AdCard() {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg">
      <CardHeader className="p-3 text-center border-b border-dashed border-primary/30">
        <span className="text-xs font-semibold text-primary/80">Advertisement</span>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow p-6 text-center">
         <div className="relative w-24 h-24 mb-4">
          <Image
            src={adData.imageUrl}
            alt={adData.title}
            fill
            className="object-cover rounded-full"
            data-ai-hint={adData.imageHint}
            sizes="96px"
          />
        </div>
        <h3 className="font-bold text-lg text-primary">{adData.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{adData.description}</p>
        <Button size="sm">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
