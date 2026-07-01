'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Button } from '@/components/ui/button'
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Heading1, Heading2, Heading3, 
  Quote, Code, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
  Strikethrough, Code2
} from 'lucide-react'
import { toast } from 'sonner'
import { uploadFileAction } from '@/app/admin/resources/actions'

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Enter link URL:', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    toast.info('Uploading image...')
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const res = await uploadFileAction(base64, file.name, file.type)
        if (res.success && res.url) {
          editor.chain().focus().setImage({ src: res.url, alt: file.name }).run()
          toast.success('Image uploaded successfully!')
        } else {
          toast.error(res.error || 'Failed to upload image.')
        }
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      toast.error(err.message || 'Error uploading file.')
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-[#14171F] rounded-t-md">
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="text-[#F6F3EC] hover:bg-[#B8975A]/20"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="text-[#F6F3EC] hover:bg-[#B8975A]/20"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost" size="sm" type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <Code2 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1 self-center" />

      <Button
        variant="ghost" size="sm" type="button"
        onClick={addLink}
        className={editor.isActive('link') ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'text-[#F6F3EC]'}
      >
        <LinkIcon className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost" size="sm" type="button"
        onClick={addImageFromUrl}
        className="text-[#F6F3EC] hover:bg-[#B8975A]/20"
        title="Add Image from URL"
      >
        <ImageIcon className="w-4 h-4" />
      </Button>

      <label className="flex items-center justify-center p-2 rounded-md cursor-pointer text-[#F6F3EC] hover:bg-[#B8975A]/20 hover:text-[#B8975A] transition-colors">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
        />
        <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Upload
        </span>
      </label>
    </div>
  )
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapImage.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto mx-auto border border-border shadow-md my-6'
        }
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#B8975A] underline hover:text-[#B8975A]/80 transition-colors'
        }
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-zinc focus:outline-none min-h-[350px] max-w-none p-5 bg-[#14171F] text-[#F6F3EC]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border border-border rounded-md overflow-hidden bg-[#1A1E29]">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
