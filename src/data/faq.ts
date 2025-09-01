export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  name: string
  icon: string
  items: FAQItem[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'courses',
    name: 'Courses',
    icon: '📚',
    items: [
      {
        question: 'Is this course suitable for my child?',
        answer: 'Our workshops are designed for K-12 students with different levels. No prior coding experience is required. We tailor the pace and content based on the students\' background.'
      },
      {
        question: 'Do students need coding experience?',
        answer: 'No. We start from the basics using intuitive tools and beginner-friendly languages. Students learn concepts step-by-step with plenty of hands-on practice.'
      },
      {
        question: 'What will students learn?',
        answer: 'Core topics include AI fundamentals (machine learning, computer vision, speech), robotics control, sensors, and programming logic — all through hands-on projects.'
      },
      {
        question: 'Are there hands-on projects?',
        answer: 'Yes. We emphasize project-based learning. Students build real robots, write AI programs, and complete challenges with a final demo showcase.'
      },
      {
        question: 'Do students need to bring equipment?',
        answer: 'No. We provide all required equipment including robot kits, sensors, and laptops. Students just need curiosity and enthusiasm.'
      },
      {
        question: 'Which programming language is used?',
        answer: 'We primarily use Python for its simplicity and power. For beginners, we also use visual tools to make learning approachable.'
      }
    ]
  },
  {
    id: 'booking',
    name: 'Booking & Payment',
    icon: '📅',
    items: [
      {
        question: 'How do I book a workshop?',
        answer: 'You can book directly on our website by choosing a workshop, time, and location, or contact us for assistance. Our team will help with the entire process.'
      },
      {
        question: 'How far in advance should I book?',
        answer: 'We recommend booking 2–4 weeks in advance. For school programs, please contact us 1–2 months ahead so we can arrange instructors and equipment.'
      },
      {
        question: 'Which payment methods are accepted?',
        answer: 'We accept credit/debit cards and bank transfers. All online payments are handled securely via trusted gateways.'
      },
      {
        question: 'Is payment secure?',
        answer: 'Yes. We use industry-standard encryption and compliant processors. Your payment details are never stored on our servers.'
      },
      {
        question: 'What is the cancellation policy?',
        answer: 'Please contact us at least 48 hours in advance. Full refund >48h, 50% refund within 24–48h, and no refund within 24h.'
      },
      {
        question: 'Do you provide invoices for schools?',
        answer: 'Yes. We provide formal tax invoices and support installment/annual settlement for schools.'
      }
    ]
  },
  {
    id: 'school',
    name: 'School Partnerships',
    icon: '🏫',
    items: [
      {
        question: 'Which schools can partner with you?',
        answer: 'We partner with K-12 schools across Australia, including public, private, and special education schools interested in STEM education.'
      },
      {
        question: 'What is the partnership process?',
        answer: 'Typical process: 1) Consultation 2) Tailored program design 3) Pilot sessions 4) Agreement 5) Ongoing evaluation and improvement.'
      },
      {
        question: 'Can programs be customized?',
        answer: 'Yes. We tailor content to your timetable, student level, and learning goals, including duration, difficulty, and topics.'
      },
      {
        question: 'How are fees calculated?',
        answer: 'Fees depend on program type, number of students, and duration. We offer volume discounts and long-term partnership benefits.'
      },
      {
        question: 'Do you provide equipment?',
        answer: 'Yes. We provide complete equipment including robot kits, sensors, and devices, usually included in the program fees.'
      },
      {
        question: 'Do you offer teacher training?',
        answer: 'Yes. We offer teacher training covering theory and practice to enable teachers to run programs independently.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technology & Equipment',
    icon: '💻',
    items: [
      {
        question: 'Are equipment costs included?',
        answer: 'Yes. All necessary equipment such as robot kits, sensors, and devices are included. No extra purchase is required.'
      },
      {
        question: 'Do we need to install software?',
        answer: 'We provide and guide installation of all necessary software using free/open-source tools where possible.'
      },
      {
        question: 'Which operating systems are supported?',
        answer: 'We support Windows, macOS, and Linux. We optimize specifically for Windows in school environments.'
      },
      {
        question: 'What if we encounter technical issues?',
        answer: 'We provide multiple support channels: in-session help, online support, documentation/videos, and community discussion. We aim to respond within 24 hours.'
      },
      {
        question: 'Are there online learning materials?',
        answer: 'Yes. We provide rich online resources including tutorials, guides, and project examples.'
      },
      {
        question: 'Can we download materials?',
        answer: 'Yes. All course materials (code, docs, guides) are available for download for continued learning.'
      }
    ]
  },
  {
    id: 'results',
    name: 'Learning Outcomes',
    icon: '🎯',
    items: [
      {
        question: 'What skills will students gain?',
        answer: 'Students develop: AI fundamentals, robotics programming/control, sensor usage, data handling, problem-solving, teamwork, and creativity.'
      },
      {
        question: 'Will students receive a certificate?',
        answer: 'Yes. Students receive a certificate upon completion to recognize their skills in AI and robotics.'
      },
      {
        question: 'How do you assess learning outcomes?',
        answer: 'We use diverse assessment methods including projects, skill checks, collaboration, creativity, and reflection, with timely feedback.'
      },
      {
        question: 'How are these skills useful?',
        answer: 'These skills build a strong STEM foundation, improve competitiveness, and nurture 21st-century capabilities and innovation.'
      },
      {
        question: 'Are there advanced programs?',
        answer: 'Yes. We offer multiple levels: beginner → intermediate → advanced → competition training, tailored to students\' interests and levels.'
      },
      {
        question: 'Can students join competitions?',
        answer: 'Absolutely. We provide competition training and support participation in recognized robotics competitions.'
      }
    ]
  }
]

// Get all FAQs
export const getAllFAQData = () => {
  return faqCategories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      category: category.id
    }))
  )
}

// Get FAQs by category
export const getFAQByCategory = (categoryId: string) => {
  const category = faqCategories.find(cat => cat.id === categoryId)
  return category ? category.items : []
}

// Search FAQs
export const searchFAQ = (searchTerm: string) => {
  const allData = getAllFAQData()
  return allData.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
