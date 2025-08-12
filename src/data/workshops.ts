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
    week: number
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
    slug: 'ai-robotics-beginners',
    title: 'AI and Robotics for Beginners: Building Smart Machines',
    overview:
      'An introductory, hands-on course where high-school students learn core AI concepts (machine learning, computer vision, voice recognition) and apply them to control robots and complete real tasks. The course makes AI accessible and exciting through real builds and simple algorithms.',
    duration: '12 weeks (1 session/week, 2 hours per session)',
    targetAudience:
      'High school students (ages 14–18), no prior AI/robotics required; interest in tech and problem-solving is recommended.',
    highlights: [
      'Hands-on robotics builds with beginner-friendly kits',
      'Intro to AI concepts: ML, computer vision, NLP/voice',
      'Sensors & autonomy: obstacle avoidance, navigation',
      'Team collaboration & final demo/competition',
    ],
    syllabus: [
      { week: 1, title: 'Introduction to AI & Robotics', objective: 'Understand course scope, safety, and what AI/robots are', activities: ['Course overview and safety', 'AI & robotics in the real world', 'Team setup and kit introduction'] },
      { week: 2, title: 'Coding for Robotics', objective: 'Build logic/control using visual programming', activities: ['Blocks/Scratch basics', 'Loops and conditions on robot', 'Test simple movement'] },
      { week: 3, title: 'Sensors & Environment Understanding', objective: 'Read sensors and interpret surroundings', activities: ['Ultrasonic distance demo', 'Camera feed basics', 'Obstacle detection exercise'] },
      { week: 4, title: 'Intro to Machine Learning', objective: 'Grasp training vs. inference via a small project', activities: ['Collect a tiny dataset', 'Train simple pattern classifier', 'Test predictions on robot/sim'] },
      { week: 5, title: 'Computer Vision in Action', objective: 'Use CV to trigger behaviors', activities: ['Color/object detection', 'Follow-the-line or color trigger', 'Evaluate accuracy and latency'] },
      { week: 6, title: 'Voice Recognition & NLP', objective: 'Control robot with voice commands', activities: ['Intro to speech/NLP APIs', 'Map commands to actions', 'Safety and fallback rules'] },
      { week: 7, title: 'Autonomous Robots', objective: 'Combine sensors for autonomous navigation', activities: ['Finite-state behavior', 'Obstacle avoidance challenge', 'Tuning and iteration'] },
      { week: 8, title: 'AI Planning', objective: 'Plan paths and reason about goals', activities: ['Grid/maze path planning', 'Heuristics and constraints', 'Dry-run then on robot'] },
      { week: 9, title: 'Collaborative Robots', objective: 'Coordinate multi-robot teamwork', activities: ['Define comms/hand-off rules', 'Cooperative relay challenge', 'Post-mortem learnings'] },
      { week: 10, title: 'Ethical AI & Robotics', objective: 'Consider ethics, safety, and impact', activities: ['Case studies and debate', 'Project risk assessment', 'Responsible use checklist'] },
      { week: 11, title: 'Final Project Build', objective: 'Design and implement team solution', activities: ['Project sprint', 'Testing and refinement', 'Prepare presentation'] },
      { week: 12, title: 'Presentation & Competition', objective: 'Communicate results and reflect', activities: ['Demo/competition day', 'Peer feedback', 'Reflection and next steps'] },
    ],
    materials: {
      hardware: ['Beginner robot kits (e.g., Lego Mindstorms, VEX, Arduino-based with sensors/motors)'],
      software: ['Blockly', 'Scratch', 'Python (beginner-friendly)'],
      onlineResources: ['Beginner tutorials', 'Coding exercises', 'AI learning references'],
    },
    assessment: [
      { item: 'Hands-on Projects', weight: '60%', criteria: 'Design, functionality, creativity' },
      { item: 'Teamwork & Collaboration', weight: '20%', criteria: 'Contribution, cooperation' },
      { item: 'Final Presentation', weight: '20%', criteria: 'Solution quality; clarity of AI/sensor explanation' },
    ],
    learningOutcomes: [
      'Understand basics of AI (ML, CV, NLP)',
      'Use sensors & simple AI algorithms to control robots',
      'Explain how autonomy emerges from sensing + decision-making',
      'Strengthen problem-solving, critical thinking, collaboration',
      'Gain practical coding & robot design experience',
    ],
    media: {
      video: {
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: 'https://picsum.photos/seed/airbotix-ai-robotics/800/450',
        caption: 'Classroom highlights: hands-on AI & robotics.',
      },
      photos: [
        { src: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop', alt: 'Students building a robot' },
        { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop', alt: 'Obstacle avoidance activity' },
        { src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop', alt: 'Team collaboration' },
      ],
    },
    seo: {
      title: 'AI & Robotics for Beginners Workshop | Airbotix',
      description:
        'A 12-week hands-on workshop introducing high-school students to AI and robotics—covering ML, computer vision, voice control, sensors, and autonomy.',
    },
    source: 'AI and Robotics for Beginners: Building Smart Machines',
  },
  {
    slug: 'robotics-fundamentals',
    title: 'Robotics Fundamentals: Sensors to Autonomy',
    overview:
      'Build a solid foundation in robotics by mastering sensors, actuators, and control. Students learn to read the environment and design reliable autonomous behaviors that solve classroom challenges.',
    duration: '8 weeks (1 session/week, 2 hours)',
    targetAudience: 'Middle to high school students (Grades 7–10); basic coding helpful but not required',
    highlights: [
      'Sensor toolkit: distance, line, IMU basics',
      'Movement control and calibration',
      'Navigation challenges and iteration',
    ],
    syllabus: [
      { week: 1, title: 'Robotics Starter', objective: 'Understand platform and safety', activities: ['Kit overview', 'First drive program'] },
      { week: 2, title: 'Movement Mastery', objective: 'Accurate motion control', activities: ['Turns and straight-line', 'Speed calibration'] },
      { week: 3, title: 'Distance Sensing', objective: 'Avoid obstacles', activities: ['Ultrasonic/IR read', 'Stop/slow behavior'] },
      { week: 4, title: 'Line Following', objective: 'Track lines reliably', activities: ['PID-lite explanation', 'Tune thresholds'] },
      { week: 5, title: 'State Machines', objective: 'Structure robot logic', activities: ['Finite states for tasks', 'Fallback and recovery'] },
      { week: 6, title: 'Localization Lite', objective: 'Estimate position', activities: ['Dead-reckoning idea', 'Waypoint demo'] },
      { week: 7, title: 'Course Challenge', objective: 'Plan route under constraints', activities: ['Scout course', 'Plan and iterate'] },
      { week: 8, title: 'Showcase', objective: 'Demonstrate robustness', activities: ['Timed run', 'Peer review'] },
    ],
    materials: {
      hardware: ['Robotics kit with motors and sensor pack'],
      software: ['Block coding or beginner Python'],
      onlineResources: ['Navigation tips', 'PID basics (intro)'],
    },
    assessment: [
      { item: 'Weekly labs', weight: '50%', criteria: 'Functionality and iteration' },
      { item: 'Final course run', weight: '30%', criteria: 'Accuracy and reliability' },
      { item: 'Reflection', weight: '20%', criteria: 'Design decisions and learning' },
    ],
    learningOutcomes: [
      'Control motion with calibrated parameters',
      'Use sensors to perceive environment',
      'Design robust behaviors using state machines',
    ],
    media: {
      photos: [
        { src: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop', alt: 'Line following practice' },
        { src: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop', alt: 'Obstacle avoidance' },
      ],
    },
    seo: {
      title: 'Robotics Fundamentals Workshop | Airbotix',
      description: 'Sensors, movement control, and autonomy foundations for Grades 7–10.',
    },
    source: 'Airbotix curriculum',
  },
  {
    slug: 'computer-vision-makers',
    title: 'Computer Vision for Young Makers',
    overview:
      'Learn how computers see. Students collect images, label datasets, and build simple vision pipelines to detect colors, shapes, or objects, powering interactive projects and installations.',
    duration: '6 weeks (1 session/week, 2 hours)',
    targetAudience: 'Ages 12–16; creative coding and maker enthusiasts',
    highlights: [
      'Data collection and labeling',
      'Train lightweight classifiers',
      'Interactive projects (art/installation)',
    ],
    syllabus: [
      { week: 1, title: 'Vision Basics', objective: 'Understand images and pixels', activities: ['Color spaces', 'Capture with webcam'] },
      { week: 2, title: 'Data Matters', objective: 'Collect useful datasets', activities: ['Labeling practice', 'Bias and quality'] },
      { week: 3, title: 'Build a Classifier', objective: 'Train and test', activities: ['Split data', 'Evaluate predictions'] },
      { week: 4, title: 'Real-time Detection', objective: 'Make it live', activities: ['Camera inference', 'Trigger events'] },
      { week: 5, title: 'Project Sprint', objective: 'Prototype idea', activities: ['Design interaction', 'Integrate detection'] },
      { week: 6, title: 'Show & Tell', objective: 'Share results', activities: ['Demo day', 'Peer critique'] },
    ],
    materials: {
      hardware: ['Laptop with webcam'],
      software: ['Block/Python toolkit', 'Lightweight vision library'],
      onlineResources: ['Dataset tips', 'Ethical imagery guidelines'],
    },
    assessment: [
      { item: 'Mini projects', weight: '60%', criteria: 'Originality and functionality' },
      { item: 'Participation', weight: '20%', criteria: 'Studio practice and feedback' },
      { item: 'Final demo', weight: '20%', criteria: 'Clarity and polish' },
    ],
    learningOutcomes: [
      'Collect and label image data responsibly',
      'Train and evaluate simple classifiers',
      'Create interactive experiences powered by vision',
    ],
    media: {
      photos: [
        { src: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1200&auto=format&fit=crop', alt: 'Labeling dataset' },
        { src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop', alt: 'Real-time detection' },
      ],
    },
    seo: {
      title: 'Computer Vision for Young Makers | Airbotix',
      description: 'Collect, label, train, and build interactive vision projects in 6 weeks.',
    },
    source: 'Airbotix curriculum',
  },
]

