'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { toast } from 'sonner'
import Link from 'next/link'

interface BlogEditorProps {
  initialPost?: any
}

export function BlogEditor({ initialPost }: BlogEditorProps) {
  const [title, setTitle] = useState(initialPost?.title || '')
  const [slug, setSlug] = useState(initialPost?.slug || '')
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '')
  const [content, setContent] = useState(initialPost?.body || '')
  const [coverUrl, setCoverUrl] = useState(initialPost?.cover_image_url || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(initialPost ? initialPost.is_published : true)
  
  const router = useRouter()
  const supabase = createClient()

  // Generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (!slug) {
      setSlug(newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let res
      if (initialPost) {
        res = await supabase.from('blog_posts').update({
          title,
          slug,
          excerpt,
          body: content,
          cover_image_url: coverUrl || null,
          is_published: isPublished,
          published_at: isPublished ? (initialPost.published_at || new Date().toISOString()) : null,
        }).eq('id', initialPost.id)
      } else {
        res = await supabase.from('blog_posts').insert({
          title,
          slug,
          excerpt,
          body: content,
          cover_image_url: coverUrl || null,
          author_id: user.id,
          is_published: isPublished,
          published_at: isPublished ? new Date().toISOString() : null,
        })
      }

      if (res.error) throw res.error

      toast.success('Blog post saved successfully!')
      router.push('/admin/blog')
      router.refresh()
    } catch (error: any) {
      toast.error('Error saving post: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
  const labelClass = "text-[13px] font-medium text-[#14171F] font-sans block mb-1.5"

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl bg-[#EDE8DD] border border-[#DDD7C9] p-8 rounded-[4px]">
      <div className="flex items-center justify-between pb-6 border-b border-[#DDD7C9]">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blog" 
            className="text-xs font-mono text-[#5B6470] hover:text-[#14171F] uppercase tracking-wider"
          >
            ← Back
          </Link>
          <h2 className="text-[22px] font-heading font-semibold text-[#14171F]">
            {initialPost ? 'Edit Blog Post' : 'New Blog Post'}
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="published" 
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="h-4 w-4 rounded-[2px] border-[#DDD7C9] text-[#B8975A] focus:ring-[#B8975A] accent-[#B8975A]"
            />
            <label htmlFor="published" className="text-[13px] font-medium text-[#14171F] font-sans">Published</label>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary h-10 px-6 text-xs uppercase tracking-wider font-semibold">
            {isSubmitting ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4">
        <div className="flex flex-col">
          <label htmlFor="title" className={labelClass}>Title</label>
          <input 
            id="title" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="The Future of Legal Tech..." 
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="slug" className={labelClass}>URL Slug</label>
          <input 
            id="slug" 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)} 
            placeholder="the-future-of-legal-tech" 
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
          <input 
            id="excerpt" 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)} 
            placeholder="A short summary of the post..." 
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="cover" className={labelClass}>Cover Image URL</label>
          <input 
            id="cover" 
            value={coverUrl} 
            onChange={(e) => setCoverUrl(e.target.value)} 
            placeholder="https://example.com/image.jpg" 
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClass}>Content (Markdown / HTML)</label>
          <div className="bg-white border border-[#DDD7C9] rounded-[2px] p-2">
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </form>
  )
}
