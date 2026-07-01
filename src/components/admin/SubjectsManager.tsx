'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createSubject, deleteSubject } from '@/app/admin/subjects/actions'

interface Subject {
  id: string
  name: string
  slug: string
  description: string | null
  icon_name: string | null
  order_index: number | null
}

interface SubjectsManagerProps {
  initialSubjects: Subject[]
}

export function SubjectsManager({ initialSubjects }: SubjectsManagerProps) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [iconName, setIconName] = useState('BookOpen')
  const [orderIndex, setOrderIndex] = useState('0')
  const [isPending, setIsPending] = useState(false)

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    )
  }

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return

    setIsPending(true)
    try {
      const res = await createSubject({
        name,
        slug,
        description,
        icon_name: iconName,
        order_index: parseInt(orderIndex) || 0
      })

      if (res.success) {
        toast.success('Subject created successfully!')
        window.location.reload()
      } else {
        toast.error(res.error || 'Failed to create subject.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.')
    } finally {
      setIsPending(false)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? All associated resources will be orphaned or deleted.')) return

    setIsPending(true)
    try {
      const res = await deleteSubject(id)
      if (res.success) {
        toast.success('Subject deleted successfully!')
        setSubjects(subjects.filter((s) => s.id !== id))
      } else {
        toast.error(res.error || 'Failed to delete subject.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create form */}
      <div className="lg:col-span-1 bg-[#EDE8DD] border border-[#DDD7C9] p-6 rounded-[4px]">
        <h2 className="text-[20px] font-heading font-semibold text-[#14171F] mb-6">Add Subject</h2>
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-name" className="text-[13px] font-medium text-[#14171F] font-sans">
              Subject Name
            </label>
            <input 
              id="sub-name" 
              placeholder="e.g. Constitutional Law" 
              value={name} 
              onChange={handleNameChange}
              required 
              disabled={isPending}
              className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-slug" className="text-[13px] font-medium text-[#14171F] font-sans">
              Slug (Auto-generated)
            </label>
            <input 
              id="sub-slug" 
              placeholder="e.g. constitutional-law" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              required 
              disabled={isPending}
              className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="sub-desc" className="text-[13px] font-medium text-[#14171F] font-sans">
              Description
            </label>
            <textarea 
              id="sub-desc" 
              placeholder="Course outline and curriculum scope..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="w-full min-h-[80px] bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sub-icon" className="text-[13px] font-medium text-[#14171F] font-sans">
                Icon Name
              </label>
              <input 
                id="sub-icon" 
                placeholder="Scale, Shield, etc." 
                value={iconName} 
                onChange={(e) => setIconName(e.target.value)}
                disabled={isPending}
                className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sub-order" className="text-[13px] font-medium text-[#14171F] font-sans">
                Order Index
              </label>
              <input 
                id="sub-order" 
                type="number"
                placeholder="0" 
                value={orderIndex} 
                onChange={(e) => setOrderIndex(e.target.value)}
                disabled={isPending}
                className="w-full bg-white border border-[#DDD7C9] rounded-[2px] px-4 py-3 text-[15px] text-[#14171F] font-sans focus:outline-none focus:border-[#B8975A] transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="btn-primary w-full h-11 text-xs uppercase tracking-wider font-semibold"
          >
            Add Subject
          </button>
        </form>
      </div>

      {/* List subjects */}
      <div className="lg:col-span-2 bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] overflow-hidden">
        <div className="p-6 border-b border-[#DDD7C9] bg-[#EDE8DD]">
          <h2 className="text-[20px] font-heading font-semibold text-[#14171F]">Academic Subjects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DDD7C9] bg-[#EDE8DD] text-[11px] font-mono uppercase tracking-[0.06em] text-[#5B6470]">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Slug</th>
                <th className="p-4 font-semibold">Icon / Order</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD7C9] text-[14px] text-[#14171F] font-sans">
              {subjects && subjects.length > 0 ? (
                subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F6F3EC] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-[#14171F]">{sub.name}</div>
                      <div className="text-xs text-[#5B6470] max-w-sm truncate mt-1">{sub.description || 'No description provided.'}</div>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#5B6470]">{sub.slug}</td>
                    <td className="p-4 text-xs font-mono">
                      <span>ICON: {sub.icon_name || 'BookOpen'}</span>
                      <span className="mx-2 text-[#B8975A]">·</span>
                      <span>ORDER: {sub.order_index ?? 0}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteSubject(sub.id)}
                        disabled={isPending}
                        className="text-[13px] font-sans font-semibold text-[#B8975A] hover:underline bg-transparent border-none focus:outline-none disabled:opacity-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#8A949E]">
                    No subjects loaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
