import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authImage = PlaceHolderImages.find((img) => img.id === 'auth-image');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-headline">FlowZone</h1>
            </Link>
          </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {authImage && (
          <Image
            src={authImage.imageUrl}
            alt={authImage.description}
            width={1200}
            height={800}
            data-ai-hint={authImage.imageHint}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        )}
      </div>
    </div>
  );
}
