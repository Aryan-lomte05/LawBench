'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { approveUserAction, deleteUserAction } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

interface ApprovalsListProps {
  initialPendingUsers: Profile[]
}

export function ApprovalsList({ initialPendingUsers }: ApprovalsListProps) {
  const [pendingUsers, setPendingUsers] = useState<Profile[]>(initialPendingUsers)
  const [actionId, setActionId] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = async (userId: string) => {
    setActionId(userId)
    try {
      const res = await approveUserAction(userId)
      if (res.success) {
        toast.success('User approved successfully!')
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to approve user.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.')
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject and delete this sign-up request?')) return

    setActionId(userId)
    try {
      const res = await deleteUserAction(userId)
      if (res.success) {
        toast.success('Sign-up request rejected.')
        setPendingUsers(prev => prev.filter(u => u.id !== userId))
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to delete request.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error occurred.')
    } finally {
      setActionId(null)
    }
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="py-12 text-center bg-[#EDE8DD] rounded-[4px] border border-[#DDD7C9] p-8 max-w-xl">
        <h3 className="text-[20px] font-heading font-normal italic text-[#5B6470]">No pending approvals</h3>
        <p className="text-[#8A949E] mt-2 text-[14px]">All signed-up users are verified and active.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#EDE8DD] border border-[#DDD7C9] rounded-[4px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#DDD7C9] bg-[#EDE8DD] text-[11px] font-mono uppercase tracking-[0.06em] text-[#5B6470]">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Registered</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD7C9] text-[14px] text-[#14171F] font-sans">
            {pendingUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[#F6F3EC] transition-colors">
                <td className="p-4 font-semibold">{user.full_name || 'Anonymous User'}</td>
                <td className="p-4 text-[#5B6470]">{user.email}</td>
                <td className="p-4 text-xs font-mono text-[#5B6470]">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleApprove(user.id)}
                      disabled={actionId !== null}
                      className="text-[13px] font-sans font-semibold text-[#1F3A33] hover:underline bg-transparent border-none focus:outline-none disabled:opacity-50 cursor-pointer"
                    >
                      {actionId === user.id ? 'Loading...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      disabled={actionId !== null}
                      className="text-[13px] font-sans font-semibold text-[#C0392B] hover:underline bg-transparent border-none focus:outline-none disabled:opacity-50 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
