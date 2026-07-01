'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2 } from 'lucide-react'
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
  const [iconName, setIconName] = useState('Scale')
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
        // Simply reload page to fetch fresh data, or add to local state
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
      <div className="lg:col-span-1 bg-card border border-border p-6 rounded-xl shadow-sm h-fit">
        <h2 className="text-xl font-heading font-bold mb-4">Add Subject</h2>
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sub-name">Subject Name</Label>
            <Input 
              id="sub-name" 
              placeholder="e.g. Constitutional Law" 
              value={name} 
              onChange={handleNameChange}
              required 
              disabled={isPending}
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="sub-slug">Slug (Auto-generated)</Label>
            <Input 
              id="sub-slug" 
              placeholder="e.g. constitutional-law" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)}
              required 
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sub-desc">Description</Label>
            <Textarea 
              id="sub-desc" 
              placeholder="Course outline and curriculum scope..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sub-icon">Icon Name</Label>
              <Input 
                id="sub-icon" 
                placeholder="Scale, Shield, etc." 
                value={iconName} 
                onChange={(e) => setIconName(e.target.value)}
                disabled={isPending}
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="sub-order">Order Index</Label>
              <Input 
                id="sub-order" 
                type="number"
                placeholder="0" 
                value={orderIndex} 
                onChange={(e) => setOrderIndex(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#B8975A] hover:bg-[#B8975A]/90 text-[#14171F] font-bold"
            disabled={isPending}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </form>
      </div>

      {/* List subjects */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold">Academic Subjects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Icon / Order</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {subjects && subjects.length > 0 ? (
                subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/10">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{sub.name}</div>
                      <div className="text-xs text-muted-foreground max-w-sm truncate mt-1">{sub.description || 'No description provided.'}</div>
                    </td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{sub.slug}</td>
                    <td className="p-4 text-xs font-mono">
                      <span>ICON: {sub.icon_name || 'Scale'}</span>
                      <span className="mx-2 text-[#B8975A]">·</span>
                      <span>ORDER: {sub.order_index ?? 0}</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteSubject(sub.id)}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
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
