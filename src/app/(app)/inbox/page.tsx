import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function InboxPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Inbox</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is where your new tasks will appear. Stay organized and productive!</p>
        </CardContent>
      </Card>
    </div>
  );
}
