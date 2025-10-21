import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Calendar</h1>
       <Card>
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Visualize your tasks and events in a powerful calendar interface.</p>
        </CardContent>
      </Card>
    </div>
  );
}
