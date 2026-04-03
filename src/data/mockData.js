
const membersData = {
  leads: [
    {
      id: 1,
      name: 'Aakash Kumar',
      role: 'Technical Lead',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 2,
      name: 'Rahul Singh',
      role: 'Management Lead',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 3,
      name: 'Bala Shanmugam',
      role: 'Research Lead',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    }
  ],
  members: [
    {
      id: 4,
      name: 'Priya Sharma',
      role: 'Frontend Developer',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 5,
      name: 'Arjun Patel',
      role: 'Backend Developer',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 6,
      name: 'Zara Khan',
      role: 'Game Developer',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 7,
      name: 'Meera Nair',
      role: 'Data Scientist',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    },
    {
      id: 8,
      name: 'Vivek Reddy',
      role: 'Full Stack Developer',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    }
  ],
  mentors: [
    {
      id: 9,
      name: 'Dr. Amit Singh',
      role: 'Faculty Mentor',
      photo: '',
      linkedin: '#',
      github: '#',
      tenure: '2025-26'
    }
  ]
};

// Export grouped members for interactive filtering
export const members = membersData;

export const projects = [
  {
    id: 1,
    title: 'AI-Powered Code Review Tool',
    description: 'Intelligent system for automated code review using machine learning',
    status: 'ongoing',
    technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    contributors: ['Aakash', 'Priya'],
    github: 'https://github.com/codechef-projects/code-review-ai',
    demo: 'https://code-review-demo.vercel.app',
    tags: ['AI', 'Web']
  },
  {
    id: 2,
    title: 'Real-Time Collaboration Platform',
    description: 'Web-based platform for real-time team collaboration and project management',
    status: 'ongoing',
    technologies: ['Node.js', 'React', 'WebSocket', 'MongoDB'],
    contributors: ['Arjun', 'Priya', 'Rahul'],
    github: 'https://github.com/codechef-projects/collab-platform',
    demo: 'https://collab-platform.vercel.app',
    tags: ['Collaborative', 'Web']
  },
  {
    id: 3,
    title: 'Mobile Game Engine',
    description: 'Custom game engine for developing 2D mobile games',
    status: 'completed',
    technologies: ['C++', 'OpenGL', 'SDL2'],
    contributors: ['Zara', 'Aakash'],
    github: 'https://github.com/codechef-projects/game-engine',
    demo: 'https://game-engine-docs.vercel.app',
    tags: ['GameDev', 'C++']
  },
  {
    id: 4,
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for visualizing complex datasets',
    status: 'completed',
    technologies: ['D3.js', 'React', 'Node.js'],
    contributors: ['Priya', 'Arjun'],
    github: 'https://github.com/codechef-projects/viz-dashboard',
    demo: 'https://viz-dashboard.vercel.app',
    tags: ['Data Viz', 'React']
  }
];

export const research = [
  {
    id: 1,
    title: 'Machine Learning Approaches for Anomaly Detection in Network Traffic',
    abstract: 'A comprehensive study on using ML algorithms to detect network anomalies in real-time.',
    authors: 'Bala Shanmugam, Dr. Amit Singh',
    publication: 'IEEE International Conference on Advanced Computing',
    year: 2024,
    pdf: '#',
    arxiv: '#',
    doi: '10.1109/IAC.2024.001',
    tags: ['ML', 'Network Security']
  },
  {
    id: 2,
    title: 'Optimization Techniques in Distributed Systems',
    abstract: 'Reviewing current state-of-the-art optimization techniques for large scale distributed systems.',
    authors: 'Aakash Kumar, Priya Sharma',
    publication: 'Journal of Computer Systems Research',
    year: 2023,
    pdf: '#',
    arxiv: '#',
    doi: '10.1016/JCSR.2023.042',
    tags: ['Distributed Systems', 'Cloud']
  },
  {
    id: 3,
    title: 'Secure Multi-Party Computation for Privacy-Preserving Analytics',
    abstract: 'Novel approaches to privacy-preserving data analytics using secure multi-party computation protocols.',
    authors: 'Rahul Singh, Meera Nair',
    publication: 'ACM Conference on Computer Security',
    year: 2024,
    pdf: '#',
    arxiv: '#',
    doi: '10.1145/CCS.2024.003',
    tags: ['Security', 'Privacy']
  }
];

export const achievements = {
  awards: [
    {
      id: 1,
      icon: '🏆',
      title: 'Best Project Award',
      year: '2024',
      description: 'Awarded for innovative AI-powered code review system'
    },
    {
      id: 2,
      icon: '🥇',
      title: 'Top Research Paper',
      year: '2024',
      description: 'Best paper at IEEE International Conference on Advanced Computing'
    },
    {
      id: 3,
      icon: '⭐',
      title: 'Community Excellence',
      year: '2023',
      description: 'Recognized for outstanding community engagement and mentorship'
    }
  ],
  milestones: [
    {
      id: 4,
      icon: '🎯',
      title: '50+ Active Members',
      year: '2024',
      description: 'Department growth milestone achieved in Q2 2024'
    },
    {
      id: 5,
      icon: '📦',
      title: '20+ Projects Shipped',
      year: '2023',
      description: 'Successfully deployed over 20 real-world projects'
    }
  ],
  hackathons: [
    {
      id: 6,
      icon: '💻',
      title: 'HackVIT 2024 — 1st Place',
      year: '2024',
      description: 'Won 1st place at HackVIT with AI-powered accessibility tool'
    },
    {
      id: 7,
      icon: '🚀',
      title: 'Smart India Hackathon — Finalist',
      year: '2023',
      description: 'Reached national finals with healthcare data platform'
    }
  ]
};

export const gameDev = {
  members: [
    {
      name: 'Zara Khan',
      photo: ''
    },
    {
      name: 'Vivek Reddy',
      photo: ''
    }
  ],
  projects: [
    {
      title: 'Space Runner 2D',
      description: 'Endless runner game with gravity mechanics',
      tech: ['Unity', 'C#', 'WebGL'],
      link: 'https://github.com/codechef-projects/space-runner'
    },
    {
      title: 'Puzzle Master',
      description: 'Logic puzzle game with 50+ levels',
      tech: ['Godot', 'GDScript'],
      link: 'https://github.com/codechef-projects/puzzle-master'
    },
    {
      title: 'Tower Defense Pro',
      description: 'Strategic tower defense game with 3D assets',
      tech: ['Unreal Engine', 'C++', 'Blueprints'],
      link: 'https://github.com/codechef-projects/tower-defense'
    }
  ],
  tools: ['Unity', 'Godot', 'Unreal Engine', 'Custom C++ Engine'],
  events: [
    {
      title: 'Game Jam 2026',
      date: 'Mar 15, 2026'
    },
    {
      title: 'Indie Game Showcase',
      date: 'Apr 5, 2026'
    }
  ]
};

export const questSystem = {
  leaderboard: [
    { rank: 1, teamName: 'Team Alpha', votes: 45, members: ['Aakash', 'Priya', 'Arjun'], badges: ['🚀 Fast Ship', '🔥 Top Contributor'] },
    { rank: 2, teamName: 'Team Beta', votes: 38, members: ['Rahul', 'Zara', 'Meera'], badges: ['🐛 Bug Hunter'] },
    { rank: 3, teamName: 'Team Gamma', votes: 32, members: ['Vivek', 'Bala'], badges: ['📚 Documentation'] },
    { rank: 4, teamName: 'Team Delta', votes: 27, members: ['Team Delta Members'], badges: [] }
  ],
  contributions: [
    { user: 'Aakash Kumar', contribution: 'Deployed real-time monitoring dashboard', date: 'Feb 1, 2026', points: 150 },
    { user: 'Priya Sharma', contribution: 'Refactored frontend component library', date: 'Jan 25, 2026', points: 120 },
    { user: 'Arjun Patel', contribution: 'Built API gateway microservice', date: 'Jan 20, 2026', points: 130 }
  ],
  winners: [
    { month: 'January 2026', winner: 'Team Alpha', reward: 'Premium GitHub Copilot Access' },
    { month: 'December 2025', winner: 'Team Beta', reward: 'Cloud Credits Package' }
  ]
};

export const events = [
  {
    id: 1,
    title: 'AI & ML Workshop Series',
    date: '2026-02-15',
    time: '10:00 AM',
    type: 'workshop',
    description: 'Learn fundamental concepts of AI and Machine Learning with hands-on projects',
    location: 'Tech Lab, Building A',
    link: '#'
  },
  {
    id: 2,
    title: 'Web Dev Hackathon 2026',
    date: '2026-02-28',
    time: '9:00 AM',
    type: 'hackathon',
    description: '24-hour hackathon focused on innovative web applications',
    location: 'Innovation Center',
    link: '#'
  },
  {
    id: 3,
    title: 'Code Optimization Masterclass',
    date: '2026-03-10',
    time: '2:00 PM',
    type: 'workshop',
    description: 'Expert session on optimizing code for performance and efficiency',
    location: 'Auditorium, Building B',
    link: '#'
  },
  {
    id: 4,
    title: 'Q3 Project Showcase',
    date: '2026-03-20',
    time: '11:00 AM',
    type: 'event',
    description: 'Showcase of all team projects and innovations',
    location: 'Main Hall',
    link: '#'
  },
  {
    id: 5,
    title: 'Game Dev Demo Day',
    date: '2025-12-15',
    time: '3:00 PM',
    type: 'event',
    description: 'Live demos of student-built games from the Game Development Wing',
    location: 'Gaming Lounge'
  },
  {
    id: 6,
    title: 'Open Source Sprint',
    date: '2025-11-20',
    time: '10:00 AM',
    type: 'hackathon',
    description: 'Contribute to popular open source projects over a weekend sprint',
    location: 'Online'
  }
];

// Fallback default export
export default { members, projects, research, gameDev, questSystem, events, achievements };
