import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const metadata = {
  title: 'Contact | LawBench',
  description: 'Get in touch with the LawBench team.',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-2xl shadow-sm">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Jane Doe" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="jane@example.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="How can we help you?" 
              className="min-h-[150px] resize-y"
              required 
            />
          </div>
          
          <Button type="submit" className="w-full h-12 text-lg font-medium shadow-md">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
