'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createResource, uploadFileAction, updateResource } from '@/app/admin/resources/actions'

interface ResourceUploadFormProps {
  subjects: { id: string; name: string }[]
  initialResource?: any
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

export function ResourceUploadForm({ subjects, initialResource }: ResourceUploadFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialResource?.title || '')
  const [description, setDescription] = useState(initialResource?.description || '')
  const [type, setType] = useState(initialResource?.type || 'notes')
  const [subjectId, setSubjectId] = useState(initialResource?.subject_id || subjects[0]?.id || '')
  const [semester, setSemester] = useState(initialResource?.semester || '')
  const [unit, setUnit] = useState(initialResource?.unit || '')
  const [author, setAuthor] = useState(initialResource?.author_or_uploader || '')
  const [url, setUrl] = useState(initialResource?.file_url || initialResource?.video_url || '')
  const [file, setFile] = useState<File | null>(null)
  const [isPublished, setIsPublished] = useState(initialResource ? initialResource.is_published : true)
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

      // 2. Create or update resource database entry
      toast.info(initialResource ? 'Updating database record...' : 'Creating database record...')
      const payload = {
        title,
        description,
        type,
        subject_id: subjectId,
        semester: semester ? semester : '',
        unit: unit ? unit : '',
        author_or_uploader: author,
        url: finalUrl,
        is_published: isPublished
      }

      const res = initialResource
        ? await updateResource(initialResource.id, payload)
        : await createResource(payload)

      if (res.success) {
        toast.success(initialResource ? 'Resource updated successfully!' : 'Resource created successfully!')
        router.push('/admin/resources')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to save resource.')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
  const labelClass = "text-[13px] font-medium text-[#14171F] font-sans block mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-[#EDE8DD] border border-[#DDD7C9] p-8 rounded-[4px]">
      <div className="flex flex-col">
        <label htmlFor="title" className={labelClass}>Resource Title</label>
        <input 
          id="title" 
          placeholder="e.g. Indian Contract Act Notes Sem 1" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          disabled={isSubmitting}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea 
          id="description" 
          placeholder="Provide a brief summary of the resource content..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          disabled={isSubmitting}
          className={`${inputClass} min-h-[100px]`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="type" className={labelClass}>Resource Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="subject" className={labelClass}>Subject</label>
          <select
            id="subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={isSubmitting}
            className={inputClass}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="semester" className={labelClass}>Semester (Optional)</label>
          <input 
            id="semester" 
            placeholder="e.g. 1" 
            value={semester} 
            onChange={(e) => setSemester(e.target.value)} 
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="unit" className={labelClass}>Unit (Optional)</label>
          <input 
            id="unit" 
            placeholder="e.g. 3" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="author" className={labelClass}>Author / Uploader (Optional)</label>
          <input 
            id="author" 
            placeholder="e.g. Prof. Mehta" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>
      </div>

      {type === 'video' ? (
        <div className="flex flex-col">
          <label htmlFor="url" className={labelClass}>Video Link (YouTube URL / Iframe src)</label>
          <input 
            id="url" 
            placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="file" className={labelClass}>PDF Document Upload</label>
            <input 
              id="file" 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              disabled={isSubmitting}
              className={`${inputClass} bg-white file:bg-[#B8975A] file:border-none file:px-3 file:py-1 file:rounded-[2px] file:text-[#14171F] file:font-semibold file:mr-4`}
            />
            <p className="text-xs text-[#5B6470] mt-1.5 font-mono">Max file size: 10MB. Uploads directly to Supabase storage.</p>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="url" className={labelClass}>Or enter document URL directly</label>
            <input 
              id="url" 
              placeholder="e.g. https://example.com/notes.pdf" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 border-t border-[#DDD7C9] pt-6">
        <input 
          id="is-published" 
          type="checkbox"
          checked={isPublished} 
          onChange={(e) => setIsPublished(e.target.checked)} 
          disabled={isSubmitting}
          className="h-4 w-4 rounded-[2px] border-[#DDD7C9] text-[#B8975A] focus:ring-[#B8975A] accent-[#B8975A]"
        />
        <label htmlFor="is-published" className="text-[13px] font-medium text-[#14171F] font-sans">
          Publish immediately (visible to students)
        </label>
      </div>

      <div className="flex items-center gap-4 border-t border-[#DDD7C9] pt-6">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary h-11 px-6 text-xs uppercase tracking-wider font-semibold"
        >
          {isSubmitting ? 'Uploading & Creating...' : 'Create Resource'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/admin/resources')}
          disabled={isSubmitting}
          className="btn-secondary h-11 px-6 text-xs uppercase tracking-wider font-semibold border-[#DDD7C9] text-[#14171F] hover:text-[#B8975A]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
