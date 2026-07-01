import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowRight, BookOpen, Video, ShieldCheck, Zap } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import dynamic from 'next/dynamic'
import { GradualBlur } from '@/components/ui/GradualBlur'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Magnetism } from '@/components/ui/Magnetism'

import { Lightfall } from '@/components/ui/LightfallWrapper'

export const metadata = {
  title: 'LawBench | Premium Legal Education',
  description: 'Master the law with structured, comprehensive, and beautiful study resources.',
}

export default async function Home() {
  const supabase = await createClient()

  // Fetch some featured subjects
  const { data: featuredSubjects } = await supabase
    .from('subjects')
    .select('name, slug, description')
    .limit(3)

  // Fetch latest blog posts
  const { data: latestPosts } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(2)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Lightfall Hero Section */}
      <section className="relative overflow-hidden bg-[#14171F] pt-24 pb-32 md:pt-32 md:pb-48 lg:pt-40 lg:pb-56 flex items-center justify-center border-b border-border/10">
        {/* Lightfall Canvas */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <Lightfall
            dpr={2}
            colors={['#B8975A', '#F6F3EC', '#1F3A33']}
            backgroundColor="#14171F"
            speed={0.35}
            streakCount={4}
            streakWidth={0.8}
            streakLength={1.4}
            glow={0.7}
            density={0.4}
            twinkle={0.4}
            zoom={2.5}
            backgroundGlow={0.5}
            opacity={0.85}
            mouseInteraction={true}
            mouseStrength={0.3}
            mouseRadius={0.5}
            mouseDampening={0.25}
          />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#B8975A]/10 via-[#1F3A33]/20 to-[#14171F] blur-[150px] rounded-full pointer-events-none z-0" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_75%,transparent_100%)] pointer-events-none z-0" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8975A]/10 text-[#B8975A] text-sm font-medium mb-8 border border-[#B8975A]/20">
            <Zap className="w-4 h-4" /> 
            <span>Welcome to the new era of legal education</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-medium tracking-tight text-[#F6F3EC] mb-8 leading-[1.15]">
            Master the Law with <span className="italic font-serif text-[#B8975A]">LawBench</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The premium study platform designed exclusively for law students. Structured notes, landmark cases, and expert video lectures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetism strength={0.12}>
              <Link 
                href="/auth/signup" 
                className={buttonVariants({ 
                  size: "lg", 
                  className: "h-14 px-8 text-lg w-full sm:w-auto bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold shadow-[0_0_40px_-10px_rgba(184,151,90,0.3)] transition-all" 
                })}
              >
                Start Learning Free <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Link>
            </Magnetism>
            <Link 
              href="/subjects" 
              className={buttonVariants({ 
                size: "lg", 
                variant: "outline", 
                className: "h-14 px-8 text-lg w-full sm:w-auto border-zinc-700 text-[#F6F3EC] hover:bg-zinc-800 bg-transparent" 
              })}
            >
              Browse Library
            </Link>
          </div>
        </div>

        {/* Gradual Blur Hero -> Content transition overlay */}
        <GradualBlur
          position="bottom"
          height="8rem"
          strength={3}
          divCount={6}
          exponential={true}
        />
      </section>

      {/* Stats Strip */}
      <section className="py-12 bg-background border-b border-border/50 relative overflow-hidden z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <ScrollReveal baseOpacity={0} blurStrength={4} textClassName="text-4xl md:text-5xl font-extrabold text-[#B8975A] font-heading">
                10K+
              </ScrollReveal>
              <p className="text-sm text-zinc-400 font-medium uppercase mt-2 tracking-wider">Bookmarked Notes</p>
            </div>
            <div className="flex flex-col items-center">
              <ScrollReveal baseOpacity={0} blurStrength={4} textClassName="text-4xl md:text-5xl font-extrabold text-[#B8975A] font-heading">
                500+
              </ScrollReveal>
              <p className="text-sm text-zinc-400 font-medium uppercase mt-2 tracking-wider">Lecture Videos</p>
            </div>
            <div className="flex flex-col items-center">
              <ScrollReveal baseOpacity={0} blurStrength={4} textClassName="text-4xl md:text-5xl font-extrabold text-[#B8975A] font-heading">
                150+
              </ScrollReveal>
              <p className="text-sm text-zinc-400 font-medium uppercase mt-2 tracking-wider">Landmark Cases</p>
            </div>
            <div className="flex flex-col items-center">
              <ScrollReveal baseOpacity={0} blurStrength={4} textClassName="text-4xl md:text-5xl font-extrabold text-[#B8975A] font-heading">
                98%
              </ScrollReveal>
              <p className="text-sm text-zinc-400 font-medium uppercase mt-2 tracking-wider">Pass Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <ScrollReveal
              baseOpacity={0.1}
              enableBlur={true}
              baseRotation={3}
              blurStrength={6}
              containerClassName="text-center"
              textClassName="text-3xl md:text-4xl font-heading font-bold text-foreground"
            >
              Why choose LawBench?
            </ScrollReveal>
            <p className="text-muted-foreground mt-4 text-lg">Built from the ground up to solve the chaos of legal study.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Structured Notes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stop hunting for scattered PDFs. Our curriculum is perfectly aligned with your university syllabus, broken down by semester and unit.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:border-secondary/30 transition-colors group">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Expert Video Lectures</h3>
              <p className="text-muted-foreground leading-relaxed">
                Complex legal concepts explained simply. High-quality video lectures integrated directly into your study flow with progress tracking.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-background border border-border shadow-sm hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">Landmark Case Laws</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access curated summaries and full judgments of the most critical cases. Searchable, highlighted, and ready for your exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subjects */}
      <section className="py-24 bg-background border-b border-border relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={3}
                blurStrength={6}
                textClassName="text-3xl md:text-4xl font-heading font-bold text-foreground"
              >
                Explore Subjects
              </ScrollReveal>
              <p className="text-muted-foreground mt-4 text-lg">Dive into our comprehensive subject library.</p>
            </div>
            <Link 
              href="/subjects" 
              className={buttonVariants({ variant: "outline" })}
            >
              View All Subjects <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSubjects?.map(subject => (
              <Link key={subject.slug} href={`/subjects/${subject.slug}`} className="group block h-full">
                <div className="p-6 rounded-xl border border-border bg-card h-full flex flex-col hover:border-primary/50 hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">{subject.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">{subject.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-primary">
                    Start Learning <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <ScrollReveal
                baseOpacity={0.1}
                enableBlur={true}
                baseRotation={3}
                blurStrength={6}
                textClassName="text-3xl md:text-4xl font-heading font-bold text-foreground"
              >
                Latest Insights
              </ScrollReveal>
              <p className="text-muted-foreground mt-4 text-lg">Study tips, legal news, and platform updates.</p>
            </div>
            <Link 
              href="/blog" 
              className={buttonVariants({ variant: "ghost", className: "text-primary hover:text-primary/80" })}
            >
              Read the Blog <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestPosts?.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="p-8 rounded-2xl bg-background border border-border hover:border-secondary/50 transition-colors h-full flex flex-col">
                  <span className="text-xs font-mono uppercase tracking-wider text-secondary mb-3 inline-block">
                    {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-6">
            Ready to elevate your legal studies?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Join thousands of law students using LawBench to master their syllabus.
          </p>
          <Magnetism strength={0.12}>
            <Link 
              href="/auth/signup" 
              className={buttonVariants({ size: "lg", variant: "secondary", className: "h-14 px-10 text-lg shadow-xl bg-[#F6F3EC] hover:bg-[#F6F3EC]/90 text-[#14171F] font-bold" })}
            >
              Create Your Free Account
            </Link>
          </Magnetism>
        </div>
      </section>
    </div>
  )
}
