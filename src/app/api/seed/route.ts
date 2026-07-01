import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  try {
    // 1. Seed admin account if not exists
    // Note: We use signUp. If it already exists, it might return an error or succeed.
    // In Supabase, if email confirmation is enabled, they might need to confirm,
    // but in local/testing environment, it might auto-confirm.
    const adminEmail = 'admin@lawbench.com'
    const studentEmail = 'student@lawbench.com'
    const defaultPassword = 'Password123!'

    const { data: adminSignUp, error: adminError } = await supabase.auth.signUp({
      email: adminEmail,
      password: defaultPassword,
      options: {
        data: {
          full_name: 'Administrator',
        }
      }
    })

    const { data: studentSignUp, error: studentError } = await supabase.auth.signUp({
      email: studentEmail,
      password: defaultPassword,
      options: {
        data: {
          full_name: 'Jane Doe (Student)',
        }
      }
    })

    // Update the admin's role to 'admin' in the profiles table
    // The profile is automatically created via the trigger on user signup
    if (adminSignUp?.user) {
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', adminSignUp.user.id)
    } else {
      // In case they were already signed up, find the profile by email and make it admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', adminEmail)
        .single()
      
      if (profile) {
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', profile.id)
      }
    }

    // 1.5. Sign in as admin so subsequent requests have 'admin' claim under RLS
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: defaultPassword
    })

    if (signInError) {
      console.warn("Could not sign in as admin for seeding:", signInError.message)
    }

    // 2. Seed Subjects
    const subjectsToSeed = [
      {
        name: 'Constitutional Law',
        slug: 'constitutional-law',
        description: 'Study of the fundamental principles, structure, and powers of the government, and the protection of individual rights under the Constitution of India.',
        icon_name: 'Scale',
        order_index: 1,
      },
      {
        name: 'Criminal Law (IPC)',
        slug: 'criminal-law',
        description: 'Analysis of crimes, punishments, and liabilities under the Indian Penal Code and Code of Criminal Procedure.',
        icon_name: 'ShieldAlert',
        order_index: 2,
      },
      {
        name: 'Law of Contracts',
        slug: 'contracts',
        description: 'Principles governing agreements, contract formation, performance, breach, and remedies under the Indian Contract Act.',
        icon_name: 'FileSignature',
        order_index: 3,
      },
      {
        name: 'Cyber Law',
        slug: 'cyber-law',
        description: 'Legal framework addressing internet safety, intellectual property, privacy, and crimes under the Information Technology Act.',
        icon_name: 'Globe',
        order_index: 4,
      }
    ]

    const seededSubjects = []

    for (const sub of subjectsToSeed) {
      // Insert if not exists
      const { data: existing } = await supabase
        .from('subjects')
        .select('*')
        .eq('slug', sub.slug)
        .single()

      if (existing) {
        seededSubjects.push(existing)
      } else {
        const { data: inserted, error: insError } = await supabase
          .from('subjects')
          .insert(sub)
          .select()
          .single()
        if (inserted) seededSubjects.push(inserted)
      }
    }

    // 3. Seed Resources under the subjects
    const constLaw = seededSubjects.find(s => s.slug === 'constitutional-law')
    const crimLaw = seededSubjects.find(s => s.slug === 'criminal-law')
    const contractLaw = seededSubjects.find(s => s.slug === 'contracts')

    // Delete existing resources to allow URL updates
    if (constLaw || crimLaw || contractLaw) {
      await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }

    const resourcesToSeed: any[] = []

    if (constLaw) {
      resourcesToSeed.push(
        {
          subject_id: constLaw.id,
          semester: 'Semester 1',
          unit: 'Unit I: Introduction',
          title: 'The Constitution of India (Bare Act)',
          description: 'Full text access to the Preamble, Parts, Articles, and Schedules of the Indian Constitution.',
          type: 'bare_act',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          is_published: true,
          author_or_uploader: 'Legislative Department'
        },
        {
          subject_id: constLaw.id,
          semester: 'Semester 1',
          unit: 'Unit II: Fundamental Rights',
          title: 'Kesavananda Bharati v. State of Kerala (Landmark Case Summary)',
          description: 'Detailed analysis of the Basic Structure Doctrine and key judgments of the 13-judge bench.',
          type: 'case_law',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          is_published: true,
          author_or_uploader: 'Supreme Court Reports'
        },
        {
          subject_id: constLaw.id,
          semester: 'Semester 1',
          unit: 'Unit III: Directive Principles',
          title: 'Understanding DPSP vs Fundamental Rights',
          description: 'A comprehensive video lecture explaining the relationship and conflicts between Part III and Part IV of the Constitution.',
          type: 'video',
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder
          is_published: true,
          author_or_uploader: 'Prof. Sharma'
        }
      )
    }

    if (crimLaw) {
      resourcesToSeed.push(
        {
          subject_id: crimLaw.id,
          semester: 'Semester 2',
          unit: 'Unit I: General Principles',
          title: 'Mens Rea and Actus Reus Lecture Notes',
          description: 'Core concepts of criminal liability, guilty mind, and criminal acts with relevant illustrations.',
          type: 'note',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          is_published: true,
          author_or_uploader: 'Dr. Verma'
        },
        {
          subject_id: crimLaw.id,
          semester: 'Semester 2',
          unit: 'Unit II: Offences against Body',
          title: 'K.M. Nanavati v. State of Maharashtra (Case Brief)',
          description: 'The historic case that led to the abolition of jury trials in India. Examines grave and sudden provocation.',
          type: 'case_law',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          is_published: true,
          author_or_uploader: 'Lawbench Team'
        }
      )
    }

    if (contractLaw) {
      resourcesToSeed.push(
        {
          subject_id: contractLaw.id,
          semester: 'Semester 1',
          unit: 'Unit I: Offer and Acceptance',
          title: 'The Indian Contract Act, 1872 (Bare Act)',
          description: 'Bare Act provisions of Sections 1 to 75 governing the general principles of contracts.',
          type: 'bare_act',
          file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          is_published: true,
          author_or_uploader: 'Govt of India'
        }
      )
    }

    for (const res of resourcesToSeed) {
      // Check if resource already exists
      const { data: existing } = await supabase
        .from('resources')
        .select('*')
        .eq('title', res.title)
        .single()

      if (!existing) {
        await supabase.from('resources').insert(res)
      }
    }

    // 4. Seed some blog posts
    const { data: author } = await supabase.from('profiles').select('id').eq('email', adminEmail).single()
    
    if (author) {
      const blogPostsToSeed = [
        {
          slug: 'evolution-of-basic-structure-kesavananda',
          title: 'The Evolution of Basic Structure: Kesavananda Bharati at 50',
          excerpt: 'An in-depth editorial tracing the historical trajectory of the Basic Structure doctrine, analyzing how Article 368 has been interpreted through landmark decisions.',
          body: 'The doctrine of the **"Basic Structure"** of the Constitution of India represents one of the most significant judicial innovations in the common law world. Evolving as a shield against unchecked parliamentary amendments, it limits the amending power under `Article 368`.\n\n## I. Historical Precedents & The Tussle\n\nThe debate over the absolute nature of parliamentary amendments began with the First Amendment of 1951, challenged in *Shankari Prasad v. Union of India* `AIR 1951 SC 458`. The Supreme Court initially held that the power to amend under `Article 368` included the power to amend Fundamental Rights. This was later reaffirmed in *Sajjan Singh v. State of Rajasthan* `AIR 1965 SC 845`.\n\nHowever, the tide turned dramatically in *Golaknath v. State of Punjab* `AIR 1967 SC 1643`, where an eleven-judge bench ruled that Parliament could not curtail Fundamental Rights, declaring that amendment acts fell within the meaning of "law" under `Article 13(2)`.\n\n## II. The Great Constitutional Compromise\n\nThis judicial blockade set the stage for the historic decision in *Kesavananda Bharati v. State of Kerala* `AIR 1973 SC 1461`. Over 68 days of arguments, the 13-judge bench wrestled with the absolute limits of sovereignty. By a slim 7-6 majority, the Court held that while Parliament could amend any part of the Constitution, it could not alter or destroy its **"Basic Structure"**.\n\n> "Every provision of the Constitution can be amended provided in the result the Constitution remains the same Constitution as it was before and its basic structure is not damaged."\n\n## III. Subsequent Interpretations & Solidification\n\nThe Basic Structure doctrine was quickly put to the test in *Indira Nehru Gandhi v. Raj Narain* `AIR 1975 SC 2299`, where the Court struck down the 39th Amendment Act that attempted to insulate prime ministerial election disputes from judicial review.\n\nLater, in *Minerva Mills Ltd. v. Union of India* `AIR 1980 SC 1789`, the Court struck down sections of the 42nd Amendment, reinforcing that judicial review and the harmony between Fundamental Rights and Directive Principles are fundamental pillars of this basic structure.\n\n## IV. The Modern Register\n\nToday, the doctrine continues to define Indian constitutionalism. It is not a fixed text, but an evolving concept. As noted in *L. Chandra Kumar v. Union of India* `AIR 1997 SC 1125`, the jurisdiction of the High Courts under `Article 226` and the Supreme Court under `Article 32` is a part of this unamendable core.',
          cover_image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
          category: 'Constitutional',
          author_id: author.id,
          is_published: true,
          published_at: new Date().toISOString()
        },
        {
          slug: 'how-to-study-constitutional-law',
          title: 'How to Study Constitutional Law for Semester Exams',
          excerpt: 'Mastering the Indian Constitution requires a structured approach. Learn how to organize articles, landmark judgments, and key amendments.',
          body: 'Studying Constitutional Law can feel overwhelming due to the sheer volume of articles, amendments, and case laws. Here is a 3-step strategy to ace your exams:\n\n1. **Focus on the Structure**: Understand the distribution of powers between the Union and States.\n2. **Memorize Key Landmark Cases**: Cases like *Kesavananda Bharati*, *Maneka Gandhi*, and *D.K. Basu* are essential.\n3. **Practice Answer Writing**: Structure your answers with the legal provision, case law application, and conclusion.',
          cover_image_url: 'https://images.unsplash.com/photo-1505664194779-8bebcb95df84?auto=format&fit=crop&q=80&w=1200',
          category: 'Academic',
          author_id: author.id,
          is_published: true,
          published_at: new Date().toISOString()
        },
        {
          slug: 'mens-rea-concept-in-criminal-law',
          title: 'Mens Rea: The Core Principle of Criminal Liability',
          excerpt: 'Exploring the vital concept of "guilty mind" in criminal law with case illustrations and exceptions under the IPC.',
          body: 'The maxim *actus non facit reum nisi mens sit rea* implies that an act itself does not make a man guilty unless his intention were so. In this post, we break down:\n\n- The definition of Mens Rea.\n- Its application in the Indian Penal Code (IPC).\n- Statutory offences where Mens Rea is excluded (strict liability).',
          cover_image_url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=1200',
          category: 'Criminal',
          author_id: author.id,
          is_published: true,
          published_at: new Date().toISOString()
        }
      ]

      for (const post of blogPostsToSeed) {
        const { data: existing } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', post.slug)
          .single()

        if (existing) {
          // Update it to seed the new elaborate content
          await supabase.from('blog_posts').update(post).eq('id', existing.id)
        } else {
          await supabase.from('blog_posts').insert(post)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      credentials: {
        admin: { email: adminEmail, password: defaultPassword, role: 'admin' },
        student: { email: studentEmail, password: defaultPassword, role: 'student' }
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
