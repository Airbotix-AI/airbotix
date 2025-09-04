import { MediaItem } from '../types'

// Media library for the Media page (images and videos)
export const mediaItems: MediaItem[] = [
  // Local image placeholders (replace with real assets later)
  {
    id: 'img-01',
    type: 'image',
    url: '/media/photos/img-01.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-01.jpg',
    title: 'Workshop – Hands-on Session',
    description: 'Students collaborating on assembling robot parts.',
    date: '2024-10-02',
    tags: ['workshop', 'robotics', 'hands-on'],
  },
  {
    id: 'img-02',
    type: 'image',
    url: '/media/photos/img-02.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-02.jpg',
    title: 'Robot Demo – Obstacle Course',
    description: 'Demonstration of sensor-based navigation.',
    date: '2024-11-15',
    tags: ['event', 'robotics'],
  },
  {
    id: 'img-03',
    type: 'image',
    url: '/media/photos/img-03.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-03.jpg',
    title: 'Coding Lab – Intro to Sensors',
    date: '2025-01-08',
    tags: ['workshop', 'coding'],
  },
  {
    id: 'img-04',
    type: 'image',
    url: '/media/photos/img-04.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-04.jpg',
    title: 'STEM Fair – Airbotix Booth',
    date: '2025-02-20',
    tags: ['event', 'community'],
  },
  {
    id: 'img-05',
    type: 'image',
    url: '/media/photos/img-05.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-05.jpg',
    title: 'Team Collaboration – Final Checks',
    date: '2025-03-18',
    tags: ['workshop', 'teamwork'],
  },
  {
    id: 'img-06',
    type: 'image',
    url: '/media/photos/img-06.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-06.jpg',
    title: 'Electronics – Soldering Basics',
    date: '2025-04-05',
    tags: ['workshop', 'electronics'],
  },

  // Local video placeholders for posters; keep video URLs minimal public samples for now
  {
    id: 'vid-workshop-recap-01',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnailUrl: '/media/photos/thumbs/img-07.jpg',
    title: 'Workshop Recap – Highlights',
    description: 'Short recap from last workshop session.',
    date: '2025-04-10',
    tags: ['video', 'recap', 'workshop'],
  },
  {
    id: 'vid-robot-demo-02',
    type: 'video',
    url: 'https://www.w3schools.com/html/movie.mp4',
    thumbnailUrl: '/media/photos/thumbs/img-08.jpg',
    title: 'Robot Capabilities Demo',
    date: '2025-04-14',
    tags: ['video', 'robotics'],
  },
  {
    id: 'vid-classroom-03',
    type: 'video',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: '/media/photos/thumbs/img-06.jpg',
    title: 'Classroom – Quick Timelapse',
    date: '2025-04-16',
    tags: ['video', 'classroom'],
  },
]

export default mediaItems


