'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function AuthPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const { error } = await signInWithEmail(values.email, values.password);
    if (error) {
      toast({
        title: 'Error logging in',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      router.push('/');
    }
    setIsLoading(false);
  }

  async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    const { error } = await signUpWithEmail(values.email, values.password, values.name);
    if (error) {
      toast({
        title: 'Error creating account',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account created!',
        description: 'Welcome to FlowZone.',
      });
      router.push('/');
    }
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Error with Google sign-in',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      router.push('/');
    }
    setIsGoogleLoading(false);
  }

  return (
    <>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <CardHeader className="p-0 pt-6">
            <CardTitle className="text-2xl font-bold font-headline text-center">Login</CardTitle>
            <CardDescription className="text-center">Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="grid gap-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link href="#" className="ml-auto inline-block text-sm underline">
                          Forgot your password?
                        </Link>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <Input type={showLoginPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowLoginPassword((prev) => !prev)}
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </TabsContent>
        <TabsContent value="signup">
          <CardHeader className="p-0 pt-6">
            <CardTitle className="text-2xl font-bold font-headline text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="grid gap-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                       <div className="relative">
                        <FormControl>
                          <Input type={showSignupPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowSignupPassword((prev) => !prev)}
                        >
                          {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                           <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
        </TabsContent>
      </Tabs>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 106.5 280.2 96 248 96c-88.8 0-160.1 71.1-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"
            ></path>
          </svg>
        )}
        Google
      </Button>
    </>
  );
}

    