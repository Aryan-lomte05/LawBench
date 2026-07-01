'use client'

import { useState } from 'react'
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
    <button 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-[13px] font-sans font-semibold text-[#B8975A] hover:underline bg-transparent border-none focus:outline-none disabled:opacity-50 cursor-pointer"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
