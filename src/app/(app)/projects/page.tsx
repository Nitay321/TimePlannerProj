import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Projects</h1>
       <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Organize your tasks into projects to keep track of larger goals.</p>
        </CardContent>
      </Card>
    </div>
  );
}
