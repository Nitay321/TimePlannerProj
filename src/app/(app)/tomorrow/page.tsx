import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TomorrowPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Tomorrow</h1>
       <Card>
        <CardHeader>
          <CardTitle>Tasks for Tomorrow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Plan ahead! Here are the tasks for tomorrow.</p>
        </CardContent>
      </Card>
    </div>
  );
}
