export const metadata = {
  title: 'About | LawBench',
  description: 'Learn more about LawBench and our mission to revolutionize legal education.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-bold text-foreground mb-6">About LawBench</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          LawBench was founded with a singular mission: to make legal education clear, accessible, and beautiful.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert mx-auto">
        <p>
          As law students, we spent countless hours sifting through chaotic PDFs, disjointed syllabus notes, and archaic case law websites. The material was there, but the experience of learning it was incredibly frustrating.
        </p>
        <p>
          We built LawBench to solve this. By combining modern pedagogy with stunning, distraction-free design, we've created a platform that actually helps you learn, rather than fighting against you.
        </p>
        <h2>Our Core Philosophy</h2>
        <ul>
          <li><strong>Structure is everything:</strong> We align our resources directly to your university syllabus, broken down by semester and unit.</li>
          <li><strong>Clarity over complexity:</strong> The law is complex enough; your study tools shouldn't be. Our notes and videos are designed for immediate comprehension.</li>
          <li><strong>Design matters:</strong> A beautiful, focused environment reduces cognitive load and makes studying (almost) enjoyable.</li>
        </ul>
        <p>
          Welcome to the new standard for legal education.
        </p>
      </div>
    </div>
  )
}
