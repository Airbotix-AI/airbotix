// Data layer for workshops

export type Workshop = {
  slug: string
  title: string
  subtitle?: string
  overview: string
  duration: string
  targetAudience: string
  highlights?: string[]
  syllabus: Array<{
    day: number
    title: string
    objective: string
    activities: string[]
  }>
  materials: {
    hardware: string[]
    software: string[]
    onlineResources: string[]
  }
  assessment: Array<{
    item: string
    weight: string
    criteria?: string
  }>
  learningOutcomes: string[]
  media?: {
    video?: { src: string; poster?: string; caption?: string }
    photos?: Array<{ src: string; alt?: string }>
  }
  seo?: {
    title?: string
    description?: string
  }
  source?: string
}

export const workshops: Workshop[] = [
  {
    slug: 'two-day-ai-robotics',
    title: 'Two-Day AI & Robotics Workshop',
    overview:
      'A two-day Robotics workshop combining AI creativity and hands-on robot programming, guiding students from basic concepts to competitive challenges while fostering teamwork and problem-solving skills.',
    duration: '2 days (9:30–12:00, 13:30–16:00 each day)',
    targetAudience:
      'Middle to high school students; no prior AI/robotics required. Ideal for ages 12–18.',
    highlights: [
      'Hands-on robotics experience combining AI and physical programming',
      'Progressive skill development: single-sensor → dual-sensor → state machines',
      'Team-based projects fostering collaboration and problem-solving',
      'Competitive challenges to apply coding logic and optimization under pressure',
      'Creative integration of AI projects (PartyRock) with robotics tasks',
    ],
    syllabus: [
      {
        day: 1,
        title: 'AI + Robotics Foundations',
        objective:
          'Introduce students to AI and basic robotics concepts while fostering teamwork and hands-on problem-solving skills.',
        activities: [
          'Introductory talk on AI and group formation',
          'Generative AI demo and PartyRock logo project',
          'Task 1: Generate team logos with PartyRock',
          'Introductory talk on robotics and mBot overview',
          'Task 2: Rocket Launch — program robot to move and stop precisely',
          'Task 3: Line tracking with one sensor, coding and mini challenges',
          'Conclusion: recap, team sharing, and awards'
        ],
      },
      {
        day: 2,
        title: 'Robotics + Competition',
        objective:
          'Advance students’ robotics skills with dual-sensor programming, state machines, and competitive challenges to reinforce coding logic, precision, and teamwork.',
        activities: [
          'Introductory talk on Scratch coding logic: loops and conditional statements',
          'Demo: Line tracking with 2 sensors',
          'Task 4: Line tracking with 2 sensors on narrow line',
          'Talk on logic tables and simple state machines',
          'Task 5: Line tracking with 2 sensors on wide line',
          'Task 6: Competition on Space Map',
          'Conclusion: recap, team sharing, and awards'
        ],
      },
    ],
    materials: {
        hardware: [
            'mBot robots',
            'IR sensors',
            'Ultrasonic sensors',
            'Obstacle course / maps',
            'Computers for programming'
        ],
        software: [
            'Scratch (for robot programming)',
            'PartyRock apps (for generative AI projects)'
        ],
        onlineResources: [
            'PartyRock tutorials and demos',
            'Competition maps / coding examples'
        ]
    },
    assessment: [
      { item: 'Hands-on Tasks', weight: '60%', criteria: 'Functionality, iteration, teamwork' },
      { item: 'Competition Performance', weight: '20%', criteria: 'Accuracy, speed, optimization' },
      { item: 'Presentation/Reflection', weight: '20%', criteria: 'Clarity of logic and learning' },
    ],
    learningOutcomes: [
      'Understand basic AI concepts and their applications in daily life',
      'Develop foundational robotics skills, including motion control and sensor usage',
      'Practice coding logic and problem-solving through hands-on tasks',
      'Apply dual-sensor tracking and simple state machines for improved robot navigation',
      'Enhance teamwork, collaboration, and iterative design skills',
      'Experience competitive scenarios to reinforce coding precision, optimization, and creative thinking'
    ],
    media: {
      photos: [
        { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop', alt: 'Team robotics activity' },
        { src: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop', alt: 'AI generative demo' },
      ],
    },
    seo: {
      title: 'Two-Day AI & Robotics Workshop | Airbotix',
      description:
        'Intensive two-day AI + robotics program: generative AI, mBot basics, 1→2 sensor line tracking, logic tables, state machines, and team competition.',
    },
    source: 'Two-Day AI & Robotics Workshop (Program Outline)',
  },
  {
    slug: 'study-tour-3-day-mia',
    title: '3 Day Workshop Package – Study Tour (MIA)',
    overview:
      'A 3-day study tour program bridging university-led AI exploration, hands-on robotics challenges, and AI assistant creation. Participants connect academic insights with industry practice and build real prototypes in teams.',
    duration: '3 days (morning + afternoon sessions each day)',
    targetAudience:
      'Study tour participants (ages 14–18) interested in AI, data, and robotics. No prior experience required.',
    highlights: [
      'University and industry-led AI exploration with real case studies',
      'Robotics challenge day: teamwork and problem-solving under constraints',
      'AI assistant creation: hardware + LLM integration and voice interaction',
      'Team presentations and project showcase with recognitions',
    ],
    syllabus: [
      {
        day: 1,
        title: 'The Age of Intelligence: AI Exploration Camp',
        objective:
          'Understand cutting-edge AI tools (LLMs, generative AI, automation, analytics) and their real-world impact; form teams and initiate an AI product challenge with academic/industry mentorship.',
        activities: [
          'Lectures by university researchers and industry engineers on LLMs, generative AI, automation, analytics',
          'Case studies across education, healthcare, finance, and creative industries',
          'Team formation (4–5 students) and AI project brief selection',
          'Mentored ideation: intelligent TA, BI tools, or social-good AI concepts',
          'Project planning and initial prototype design',
        ],
      },
      {
        day: 2,
        title: 'Shaping the Future: Robotics Challenge Camp',
        objective:
          'Gain foundational robotics knowledge (mechanics, algorithms, control) and apply it in a competitive team challenge to experience hands-on problem-solving and collaboration.',
        activities: [
          'Lecture: robotics overview – mechanical design, intelligent algorithms, automation control',
          'Hands-on practice: robot setup, sensing, and basic control tasks',
          'Team robotics challenge with real-time contests and scoring',
          'Reflection on teamwork, iteration, and learning-by-doing',
        ],
      },
      {
        day: 3,
        title: 'Smart Companions: AI Creation Camp',
        objective:
          'Learn AI hardware and assistant architectures; build and customize an AI assistant with sensors and voice/command control; present projects and receive certifications and recognition.',
        activities: [
          'Morning lecture: AI chips/sensors; LLM integration for voice and perception; assistant design principles',
          'Case studies: architectures and future trends of AI assistants',
          'Afternoon build: assemble sensors/voice modules/compute; integrate AI models',
          'Customization: voice style, responses, and interactive scenarios',
          'Team presentations and closing showcase with certificates and awards',
        ],
      },
    ],
    materials: {
      hardware: [
        'Robotics kits with sensors and actuators',
        'AI assistant components: microphones, speakers, sensor modules',
        'Edge compute units (e.g., microcontrollers or SBCs)',
      ],
      software: [
        'Block/Scratch or Python environment for robotics',
        'LLM/voice integration tools for AI assistants',
      ],
      onlineResources: [
        'Case studies and slides (AI topics and assistant architecture)',
        'Robotics challenge maps and starter examples',
      ],
    },
    assessment: [
      { item: 'Team Projects', weight: '50%', criteria: 'Functionality, design clarity, impact' },
      { item: 'Robotics Challenge', weight: '30%', criteria: 'Performance, iteration, teamwork' },
      { item: 'Presentation/Showcase', weight: '20%', criteria: 'Communication, reflection, polish' },
    ],
    learningOutcomes: [
      'Explain modern AI domains and real-world applications using case studies',
      'Apply robotics concepts through team challenges and iterative problem-solving',
      'Design and build an AI assistant integrating sensors and LLM-driven interaction',
      'Collaborate in teams and present technical work effectively',
    ],
    media: {
      photos: [
        { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop', alt: 'Team robotics challenge' },
        { src: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop', alt: 'AI lecture and exploration' },
      ],
    },
    seo: {
      title: '3 Day Study Tour Workshop (MIA) | Airbotix',
      description:
        'University + industry AI exploration, robotics challenge, and AI assistant creation across 3 days. Team projects with showcase and certifications.',
    },
    source: '3 Day Workshop Package – For Study Tour (MIA)',
  },
]

