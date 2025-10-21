import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TodayPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Today</h1>
       <Card>
        <CardHeader>
          <CardTitle>Tasks for Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is where you'll see all tasks scheduled for today. Focus and get things done!</p>
        </CardContent>
      </Card>
    </div>
  );
}
