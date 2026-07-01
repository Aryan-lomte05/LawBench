'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteResource } from '@/app/admin/resources/actions'

export function DeleteResourceButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    setIsDeleting(true)
    try {
      const res = await deleteResource(id)
      if (res.success) {
        toast.success('Resource deleted successfully!')
      } else {
        toast.error(res.error || 'Failed to delete resource.')
      }
    } catch (e: any) {
      toast.error(e.message || 'Error occurred.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}
