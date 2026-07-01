'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3, 
  Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Code
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

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

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

  const btnClass = "p-2 text-[#5B6470] hover:text-[#14171F] hover:bg-[#DDD7C9]/40 rounded-[2px] transition-colors"
  const activeBtnClass = "p-2 bg-[#B8975A]/20 text-[#B8975A] rounded-[2px] transition-colors"

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-[#DDD7C9] bg-[#EDE8DD] text-[12px] font-mono uppercase tracking-wider">
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className={btnClass}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className={btnClass}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#DDD7C9] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? activeBtnClass : btnClass}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? activeBtnClass : btnClass}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? activeBtnClass : btnClass}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#DDD7C9] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? activeBtnClass : btnClass}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? activeBtnClass : btnClass}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#DDD7C9] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? activeBtnClass : btnClass}
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? activeBtnClass : btnClass}
        title="Inline Code / Case Citation"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-[#DDD7C9] mx-1 self-center" />

      <button
        type="button"
        onClick={addLink}
        className={editor.isActive('link') ? activeBtnClass : btnClass}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={addImageFromUrl}
        className={btnClass}
        title="Add Image URL"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      <label className="flex items-center justify-center p-2 rounded-[2px] cursor-pointer text-[#5B6470] hover:text-[#14171F] hover:bg-[#DDD7C9]/40 transition-colors" title="Upload Image">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
        />
        <ImageIcon className="w-4 h-4" />
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
          class: 'rounded-[2px] max-w-full h-auto mx-auto border border-[#DDD7C9] my-6'
        }
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#B8975A] underline hover:underline transition-all'
        }
      })
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-stone focus:outline-none min-h-[350px] max-w-none p-6 bg-[#F6F3EC] text-[#14171F] font-sans leading-[1.75] text-[17px] prose-headings:font-heading prose-headings:text-[#14171F] prose-a:text-[#B8975A] prose-blockquote:border-l-3 prose-blockquote:border-[#B8975A] prose-blockquote:pl-5 prose-blockquote:italic',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border border-[#DDD7C9] rounded-[4px] overflow-hidden bg-[#F6F3EC] max-w-[740px] mx-auto">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
