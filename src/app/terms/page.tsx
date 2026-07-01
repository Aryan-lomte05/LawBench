export const metadata = {
  title: 'Terms of Service | LawBench',
  description: 'Terms of service for LawBench users.',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-8 border-b border-border pb-4">Terms of Service</h1>
      
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p className="text-sm font-mono text-[#B8975A] uppercase tracking-wider">
          Last Updated: July 1, 2026
        </p>

        <p>
          Welcome to LawBench. By accessing or using our website, study guides, video progress tracking, and blog content, you agree to comply with and be bound by the following Terms of Service.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">1. License & Use</h2>
          <p>
            LawBench grants you a limited, non-exclusive, non-transferable license to access our academic resource materials for your personal, non-commercial education. Bulk scraping, unauthorized duplication, or reselling of study notes is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">2. Content Integrity</h2>
          <p>
            We curate resources and landmark summaries for reference purposes. While we strive to maintain high-quality materials, legal codes, court precedents, and syllabus requirements are subject to frequent changes. Users should always cross-reference full official gazettes for critical examinations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">3. User Conduct</h2>
          <p>
            You are fully responsible for the comments and discussions you post. Spamming, posting promotional links, harassing other students, or uploading copyrighted materials without authorization will result in immediate termination of account access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-heading font-bold text-foreground mt-8">4. Intellectual Property</h2>
          <p>
            All original notes, video lectures, visual designs, code, and blog posts are the property of LawBench or its respected contributors. Bare Acts and public court judgments remain within the public domain.
          </p>
        </section>
      </div>
    </div>
  )
}
