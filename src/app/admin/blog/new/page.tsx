import { BlogEditor } from '@/components/admin/BlogEditor'

export const metadata = {
  title: 'New Blog Post | Admin | LawBench',
}

export default function NewBlogPostPage() {
  return (
    <div className="w-full">
      <BlogEditor />
    </div>
  )
}
