import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AllTasksPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">All Tasks</h1>
       <Card>
        <CardHeader>
          <CardTitle>All Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A complete overview of everything you need to do.</p>
        </CardContent>
      </Card>
    </div>
  );
}
