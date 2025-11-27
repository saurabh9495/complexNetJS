import { Waves } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <Waves className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">
            NewsWave
          </h1>
        </div>
      </div>
    </header>
  );
}
