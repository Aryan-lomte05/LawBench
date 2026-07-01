import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, BookOpen, Video, ShieldCheck, Zap } from 'lucide-react'
import { Lightfall } from '@/components/ui/LightfallWrapper'
import { StatsStrip } from '@/components/home/StatsStrip'

export const metadata = {
  title: 'LawBench | Premium Legal Education',
  description: 'Master the law with structured, comprehensive, and beautiful study resources.',
}

export default async function Home() {
  const supabase = await createClient()

  // Parallel database queries
  const [
    { count: subjectsCount },
    { count: resourcesCount },
    { count: profilesCount },
    { data: featuredSubjects },
    { data: latestPosts }
  ] = await Promise.all([
    supabase.from('subjects').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('name, slug, description').limit(3),
    supabase.from('blog_posts')
      .select('title, slug, excerpt, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(2)
  ])

  return (
    <div className="flex flex-col min-h-screen bg-[#14171F]">
      {/* Lightfall Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center border-b border-[#2A2E3A] px-4">
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

        {/* Scrim Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#14171F]/15 via-[#14171F]/55 to-[#14171F] pointer-events-none" />

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-[820px] text-center pt-24 pb-16 mx-auto">
          {/* Eyebrow */}
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.12em] text-[#B8975A] mb-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
            INDIA'S PREMIER LEGAL KNOWLEDGE PLATFORM
          </div>
          
          {/* Headline */}
          <h1 className="text-[48px] md:text-[64px] lg:text-[80px] font-heading font-bold text-[#F9F8F5] leading-[1.08] tracking-[-0.025em] max-w-[14ch] mx-auto mb-6 animate-fade-up" style={{ animationDelay: '500ms' }}>
            Study Law.<br />Think Deeper.
          </h1>

          {/* Subhead */}
          <p className="text-[19px] font-sans font-normal text-[#8A949E] max-w-[52ch] mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '750ms' }}>
            The library of a serious lawyer. Structured study resources, landmark case summaries, and expert video lectures.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '950ms' }}>
            <Link href="/auth/signup" className="btn-primary w-full sm:w-auto h-12 text-[15px] font-semibold text-[#14171F]">
              Start Learning Free
            </Link>
            <Link href="/subjects" className="btn-secondary w-full sm:w-auto h-12 text-[15px] font-medium text-[#F9F8F5]">
              Browse Library
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <StatsStrip 
        subjects={subjectsCount || 0} 
        resources={resourcesCount || 0} 
        learners={profilesCount || 0} 
      />

      {/* Value Props Section */}
      <section className="py-24 bg-[#1C2029] border-b border-[#2A2E3A]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#F9F8F5] leading-tight">
              Why choose LawBench?
            </h2>
            <p className="text-[#8A949E] mt-3 text-[15px] max-w-[52ch] mx-auto">
              Built from the ground up to solve the chaos of legal studies and academic research.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-[4px] bg-[#14171F] border border-[#2A2E3A] transition-colors hover:border-[#B8975A] duration-150">
              <div className="w-10 h-10 flex items-center justify-center text-[#B8975A] mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-[19px] font-semibold font-heading text-[#F9F8F5] mb-3">Structured Notes</h3>
              <p className="text-[#8A949E] text-[14px] leading-relaxed">
                Perfectly aligned with your university curriculum. Hand-crafted notes broken down strictly by semester and unit segments.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-[4px] bg-[#14171F] border border-[#2A2E3A] transition-colors hover:border-[#B8975A] duration-150">
              <div className="w-10 h-10 flex items-center justify-center text-[#B8975A] mb-6">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-[19px] font-semibold font-heading text-[#F9F8F5] mb-3">Expert Video Lectures</h3>
              <p className="text-[#8A949E] text-[14px] leading-relaxed">
                Complex statutes and constitutional principles explained cleanly, complete with resume progress logging.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-[4px] bg-[#14171F] border border-[#2A2E3A] transition-colors hover:border-[#B8975A] duration-150">
              <div className="w-10 h-10 flex items-center justify-center text-[#B8975A] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-[19px] font-semibold font-heading text-[#F9F8F5] mb-3">Landmark Case Laws</h3>
              <p className="text-[#8A949E] text-[14px] leading-relaxed">
                Explore curated brief summaries and complete court judgments, categorized and cited correctly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Subjects */}
      <section className="py-24 bg-[#14171F] border-b border-[#2A2E3A]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#F9F8F5]">
                Curated Subjects
              </h2>
              <p className="text-[#8A949E] mt-2 text-[15px]">Select a branch to begin learning.</p>
            </div>
            <Link 
              href="/subjects" 
              className="text-xs font-mono uppercase tracking-widest text-[#B8975A] hover:text-[#B8975A]/85 transition-colors flex items-center gap-1.5"
            >
              <span>View All Subjects</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSubjects?.map(subject => (
              <Link key={subject.slug} href={`/subjects/${subject.slug}`} className="group block">
                <div className="p-6 rounded-[4px] border border-[#2A2E3A] bg-[#1C2029] flex flex-col hover:border-[#B8975A] transition-colors h-full">
                  <h3 className="text-[19px] font-semibold font-heading text-[#F9F8F5] mb-3 group-hover:text-[#B8975A] transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-[#8A949E] text-[14px] line-clamp-3 mb-6 leading-relaxed">
                    {subject.description}
                  </p>
                  <div className="mt-auto flex items-center text-xs font-mono uppercase tracking-widest text-[#B8975A]">
                    <span>Enter Subject</span> <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-[#1C2029]">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#F9F8F5]">
                Latest Insights
              </h2>
              <p className="text-[#8A949E] mt-2 text-[15px]">Editorial updates, legal analyses, and study columns.</p>
            </div>
            <Link 
              href="/blog" 
              className="text-xs font-mono uppercase tracking-widest text-[#B8975A] hover:text-[#B8975A]/85 transition-colors flex items-center gap-1.5"
            >
              <span>Read The Blog</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestPosts?.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="p-8 rounded-[4px] bg-[#14171F] border border-[#2A2E3A] hover:border-[#B8975A] transition-colors h-full flex flex-col">
                  <span className="text-[11px] font-mono uppercase tracking-[0.06em] text-[#8A949E] mb-3">
                    {formatDistanceToNow(new Date(post.published_at || ''), { addSuffix: true })}
                  </span>
                  <h3 className="text-[22px] font-semibold font-heading text-[#F9F8F5] mb-4 group-hover:text-[#B8975A] transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-[#8A949E] text-[14px] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="py-24 bg-[#14171F] border-t border-[#2A2E3A] relative overflow-hidden">
        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <h2 className="text-[28px] md:text-[36px] font-heading font-semibold text-[#F9F8F5] mb-4">
            Ready to elevate your legal studies?
          </h2>
          <p className="text-[15px] text-[#8A949E] mb-8 leading-relaxed">
            Join thousands of law students using LawBench to access structured library resources.
          </p>
          <Link href="/auth/signup" className="btn-primary h-12 text-[15px] font-semibold text-[#14171F]">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  )
}
