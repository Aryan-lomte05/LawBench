'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { TiptapEditor } from '@/components/admin/TiptapEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function BlogEditor() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  
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

      const { data, error } = await supabase.from('blog_posts').insert({
        title,
        slug,
        excerpt,
        body: content,
        cover_image_url: coverUrl || null,
        author_id: user.id,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      }).select().single()

      if (error) throw error

      toast.success('Blog post saved successfully!')
      router.push('/admin/blog')
      router.refresh()
    } catch (error: any) {
      toast.error('Error saving post: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/blog"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <h2 className="text-2xl font-heading font-bold text-foreground">New Blog Post</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="published" 
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)} 
              className="rounded border-border bg-background"
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="The Future of Legal Tech..." 
            required
            className="text-lg font-medium"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input 
            id="slug" 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)} 
            placeholder="the-future-of-legal-tech" 
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input 
            id="excerpt" 
            value={excerpt} 
            onChange={(e) => setExcerpt(e.target.value)} 
            placeholder="A short summary of the post..." 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cover">Cover Image URL</Label>
          <Input 
            id="cover" 
            value={coverUrl} 
            onChange={(e) => setCoverUrl(e.target.value)} 
            placeholder="https://example.com/image.jpg" 
          />
        </div>

        <div className="space-y-2">
          <Label>Content (Markdown / HTML)</Label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>
    </form>
  )
}
