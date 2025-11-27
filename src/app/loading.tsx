import { SiteHeader } from '@/components/site-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-12 space-y-6">
          <Skeleton className="h-12 max-w-2xl mx-auto" />
          <div className="flex justify-center flex-wrap gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>

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
      </main>
       <footer className="py-6 text-center text-sm text-muted-foreground">
        <Skeleton className="h-4 w-48 mx-auto" />
      </footer>
    </div>
  );
}
