export const metadata = {
  title: 'Privacy Policy | LawBench',
  description: 'Privacy policy for LawBench users.',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-8 border-b border-border pb-4">Privacy Policy</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-mono text-[#B8975A] uppercase tracking-wider">
          Effective Date: July 1, 2026
        </p>

        <p>
          At LawBench, we respect your privacy and are committed to protecting the personal data of our students, educators, and users. This Privacy Policy details how we handle user information in compliance with the **Digital Personal Data Protection (DPDP) Act, 2023** (India) and other applicable guidelines.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">1. Data We Collect</h2>
          <p>
            To provide our legal resources and track study progress, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Data:</strong> Name, email address, password, and optional avatar URL when signing up.</li>
            <li><strong>Usage Data:</strong> Bookmarked study resources, comment threads posted, and video/reading progress indicators.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">2. Purpose of Collection</h2>
          <p>
            Your information is processed solely to personalize and support your study flow, specifically to keep track of bookmarks, display comments, save video positions, and manage admin contributions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">3. Consent & Control</h2>
          <p>
            Under DPDP 2023, you have the right to withdraw your consent to data processing, view your stored information, request corrections, or request complete account erasure. You can manage these settings directly in your Student Dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">4. Contact Information</h2>
          <p>
            For any queries or concerns regarding data processing and consent withdrawal, please contact our support team via our <a href="/contact" className="text-[#B8975A] hover:underline">Contact Form</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
