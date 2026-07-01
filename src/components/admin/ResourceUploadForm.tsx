'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { createResource, uploadFileAction } from '@/app/admin/resources/actions'

interface ResourceUploadFormProps {
  subjects: { id: string; name: string }[]
}

const RESOURCE_TYPES = [
  { value: 'notes', label: 'Notes' },
  { value: 'bare_act', label: 'Bare Act' },
  { value: 'case_law', label: 'Case Law' },
  { value: 'judgment', label: 'Judgment' },
  { value: 'article', label: 'Article' },
  { value: 'pyq', label: 'PYQ (Previous Year Questions)' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'video', label: 'Video' }
]

export function ResourceUploadForm({ subjects }: ResourceUploadFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('notes')
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const [semester, setSemester] = useState('')
  const [unit, setUnit] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isPublished, setIsPublished] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !subjectId) {
      toast.error('Please enter a title and select a subject.')
      return
    }

    setIsSubmitting(true)
    let finalUrl = url

    try {
      // 1. Handle file upload if PDF type and file is present
      if (type !== 'video' && file) {
        toast.info('Uploading file to storage...')
        const base64 = await getBase64(file)
        const uploadRes = await uploadFileAction(base64, file.name, file.type)
        if (uploadRes.success && uploadRes.url) {
          finalUrl = uploadRes.url
        } else {
          throw new Error(uploadRes.error || 'File upload failed.')
        }
      }

      if (!finalUrl && type === 'video') {
        throw new Error('Please enter a video URL.')
      }

      // 2. Create resource database entry
      toast.info('Creating database record...')
      const res = await createResource({
        title,
        description,
        type,
        subject_id: subjectId,
        semester: semester ? semester : '',
        unit: unit ? unit : '',
        author_or_uploader: author,
        url: finalUrl,
        is_published: isPublished
      })

      if (res.success) {
        toast.success('Resource created successfully!')
        router.push('/admin/resources')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to create resource.')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-xl shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Resource Title</Label>
        <Input 
          id="title" 
          placeholder="e.g. Indian Contract Act Notes Sem 1" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Provide a brief summary of the resource content..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          disabled={isSubmitting}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Resource Type</Label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="semester">Semester (Optional)</Label>
          <Input 
            id="semester" 
            placeholder="e.g. 1" 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)} 
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit (Optional)</Label>
          <Input 
            id="unit" 
            placeholder="e.g. 3" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author / Uploader (Optional)</Label>
          <Input 
            id="author" 
            placeholder="e.g. Prof. Mehta" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            disabled={isSubmitting}
          />
        </div>
      </div>

      {type === 'video' ? (
        <div className="space-y-2">
          <Label htmlFor="url">Video Link (YouTube URL / Iframe src)</Label>
          <Input 
            id="url" 
            placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
            disabled={isSubmitting}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">PDF Document Upload</Label>
            <Input 
              id="file" 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Max file size: 10MB. Uploads directly to Supabase storage.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Or enter document URL directly</Label>
            <Input 
              id="url" 
              placeholder="e.g. https://example.com/notes.pdf" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              disabled={isSubmitting}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 border-t border-border pt-4">
        <Switch 
          id="is-published" 
          checked={isPublished} 
          onCheckedChange={setIsPublished} 
          disabled={isSubmitting}
        />
        <Label htmlFor="is-published">Publish immediately (visible to students)</Label>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-4">
        <Button 
          type="submit" 
          className="bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Uploading & Creating...' : 'Create Resource'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/resources')}
          disabled={isSubmitting}
          className="bg-transparent text-foreground border-zinc-700 hover:bg-zinc-800"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
