
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Layout, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary p-1.5 rounded-lg">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-primary">TaskFlow Pro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/login">
            Login
          </Link>
          <Button asChild variant="default" size="sm">
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-4 animate-in fade-in slide-in-from-bottom-3">
                <Zap className="mr-2 h-4 w-4" />
                The future of task management is here
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none max-w-3xl">
                Master your day with <span className="text-primary">TaskFlow Pro</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experience a seamless, secure, and incredibly fast way to manage your personal tasks. Built for high-performance productivity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="px-8 text-lg">
                  <Link href="/register">Start for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 text-lg">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure by Design</h3>
                <p className="text-muted-foreground">JWT-based authentication ensures your tasks remain private and protected.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-accent/10 rounded-2xl">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Lightning Fast</h3>
                <p className="text-muted-foreground">Optimized backend for instant CRUD operations and smooth UI transitions.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Perfectly Organized</h3>
                <p className="text-muted-foreground">Search, filter, and track status with an intuitive, clutter-free dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 TaskFlow Pro. All rights reserved.</p>
          <div className="flex gap-6">
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Privacy</Link>
            <Link className="text-sm text-muted-foreground hover:text-primary" href="#">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
