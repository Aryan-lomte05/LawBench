import { ContactForm } from '@/components/contact/ContactForm'

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
        <ContactForm />
      </div>
    </div>
  )
}
