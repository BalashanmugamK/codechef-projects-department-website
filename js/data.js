// ============================================
// APPLICATION DATA
// ============================================

const appData = {
  members: {
    leads: [
      {
        id: 1,
        name: 'Aakash Kumar',
        role: 'Technical Lead',
        photo: 'https://via.placeholder.com/140/FF6B35/ffffff?text=AK',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      },
      {
        id: 2,
        name: 'Rahul Singh',
        role: 'Management Lead',
        photo: 'https://via.placeholder.com/140/FF8C42/ffffff?text=RS',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      },
      {
        id: 3,
        name: 'Bala Shanmugam',
        role: 'Research Lead',
        photo: 'https://via.placeholder.com/140/667EEA/ffffff?text=BS',
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
        photo: 'https://via.placeholder.com/140/F4A261/ffffff?text=PS',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      },
      {
        id: 5,
        name: 'Arjun Patel',
        role: 'Backend Developer',
        photo: 'https://via.placeholder.com/140/2A9D8F/ffffff?text=AP',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      },
      {
        id: 6,
        name: 'Zara Khan',
        role: 'Game Developer',
        photo: 'https://via.placeholder.com/140/E76F51/ffffff?text=ZK',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      }
    ],
    mentors: [
      {
        id: 7,
        name: 'Dr. Amit Singh',
        role: 'Faculty Mentor',
        photo: 'https://via.placeholder.com/140/264653/ffffff?text=AS',
        linkedin: '#',
        github: '#',
        tenure: '2025-26'
      }
    ],
    alumni: [
      {
        id: 8,
        name: 'Vikram Reddy',
        role: 'Former Technical Lead',
        photo: 'https://via.placeholder.com/140/9D4EDD/ffffff?text=VR',
        linkedin: '#',
        github: '#',
        tenure: '2024-25'
      }
    ]
  },

  projects: [
    {
      id: 1,
      title: 'AI-Powered Code Review Tool',
      description: 'Intelligent system for automated code review using machine learning',
      status: 'ongoing',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      contributors: ['Aakash', 'Priya'],
      github: 'https://github.com/codechef-projects/code-review-ai',
      demo: 'https://code-review-demo.vercel.app'
    },
    {
      id: 2,
      title: 'Real-Time Collaboration Platform',
      description: 'Web-based platform for real-time team collaboration and project management',
      status: 'ongoing',
      technologies: ['Node.js', 'React', 'WebSocket', 'MongoDB'],
      contributors: ['Arjun', 'Priya', 'Rahul'],
      github: 'https://github.com/codechef-projects/collab-platform',
      demo: 'https://collab-platform.vercel.app'
    },
    {
      id: 3,
      title: 'Mobile Game Engine',
      description: 'Custom game engine for developing 2D mobile games',
      status: 'completed',
      technologies: ['C++', 'OpenGL', 'SDL2'],
      contributors: ['Zara', 'Aakash'],
      github: 'https://github.com/codechef-projects/game-engine',
      demo: 'https://game-engine-docs.vercel.app'
    },
    {
      id: 4,
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for visualizing complex datasets',
      status: 'completed',
      technologies: ['D3.js', 'React', 'Node.js'],
      contributors: ['Priya', 'Arjun'],
      github: 'https://github.com/codechef-projects/viz-dashboard',
      demo: 'https://viz-dashboard.vercel.app'
    }
  ],

  research: [
    {
      id: 1,
      title: 'Machine Learning Approaches for Anomaly Detection in Network Traffic',
      authors: 'Bala Shanmugam, Dr. Amit Singh',
      publication: 'IEEE International Conference on Advanced Computing',
      year: 2024,
      pdf: '#',
      arxiv: 'https://arxiv.org/abs/2404.12345',
      doi: '10.1109/2024.12345'
    },
    {
      id: 2,
      title: 'Optimization Techniques in Distributed Systems: A Comprehensive Review',
      authors: 'Aakash Kumar, Priya Sharma',
      publication: 'Journal of Computer Systems Research',
      year: 2023,
      pdf: '#',
      arxiv: 'https://arxiv.org/abs/2303.54321',
      doi: '10.1016/j.2023.54321'
    }
  ],

  achievements: {
    awards: [
      {
        id: 1,
        icon: '🏆',
        title: 'Best Project Award',
        year: 2024,
        description: 'Awarded for innovative AI-powered code review system'
      },
      {
        id: 2,
        icon: '🥇',
        title: 'Hackathon First Prize',
        year: 2024,
        description: 'Won CodeChef VIT Hackathon 2024 with mobile game engine'
      }
    ],
    milestones: [
      {
        id: 3,
        icon: '📈',
        title: '50+ Active Members',
        year: 2024,
        description: 'Grew our team to 50+ passionate developers'
      },
      {
        id: 4,
        icon: '🚀',
        title: '20+ Projects Completed',
        year: 2024,
        description: 'Successfully completed 20+ projects across various domains'
      }
    ],
    hackathons: [
      {
        id: 5,
        icon: '⚡',
        title: 'CodeChef Hackathon 2024',
        year: 2024,
        description: 'Participated with 15+ team members'
      }
    ]
  },

  gameDev: {
    members: [
      {
        id: 1,
        name: 'Zara Khan',
        photo: 'https://via.placeholder.com/140/E76F51/ffffff?text=ZK'
      },
      {
        id: 2,
        name: 'Aakash Kumar',
        photo: 'https://via.placeholder.com/140/FF6B35/ffffff?text=AK'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Space Runner 2D',
        link: 'https://github.com/codechef-projects/space-runner'
      },
      {
        id: 2,
        title: 'Puzzle Master',
        link: 'https://github.com/codechef-projects/puzzle-master'
      }
    ],
    tools: ['Unity', 'Godot', 'Unreal Engine', 'Custom C++ Engine'],
    events: [
      {
        id: 1,
        title: 'Game Development Workshop',
        date: 'March 2024'
      },
      {
        id: 2,
        title: 'Game Jam Challenge',
        date: 'April 2024'
      }
    ]
  },

  questSystem: {
    leaderboard: [
      { rank: 1, teamName: 'Team Alpha', votes: 45, members: ['Aakash Kumar', 'Priya Sharma'], contributions: 45 },
      { rank: 2, teamName: 'Team Beta', votes: 38, members: ['Arjun Patel', 'Zara Khan'], contributions: 38 },
      { rank: 3, teamName: 'Team Gamma', votes: 32, members: ['Rahul Singh', 'Neha Verma'], contributions: 32 },
      { rank: 4, teamName: 'Team Delta', votes: 28, members: ['Amit Desai', 'Sophia Lee'], contributions: 28 },
      { rank: 5, teamName: 'Team Epsilon', votes: 25, members: ['Vikram Rao', 'Emma Wilson'], contributions: 25 }
    ],
    contributions: [
      { user: 'Aakash Kumar', contribution: 'Completed AI module for code review', date: '2024-03-15', points: 50 },
      { user: 'Priya Sharma', contribution: 'Designed UI for dashboard', date: '2024-03-14', points: 40 },
      { user: 'Arjun Patel', contribution: 'Implemented API endpoints', date: '2024-03-13', points: 45 }
    ],
    winners: [
      { month: 'March 2024', winner: 'Team Alpha', reward: 'CodeChef Goodies + Certificate' },
      { month: 'February 2024', winner: 'Team Beta', reward: 'CodeChef Goodies + Certificate' }
    ]
  },

  events: [
    {
      id: 1,
      title: 'AI & ML Workshop Series',
      date: '2026-02-15',
      time: '3:00 PM',
      description: 'Learn fundamental concepts of AI and Machine Learning with hands-on projects',
      location: 'Tech Lab, Building A',
      type: 'workshop',
      link: '#'
    },
    {
      id: 2,
      title: 'Web Dev Hackathon 2026',
      date: '2026-02-28',
      time: '10:00 AM',
      description: '24-hour hackathon focused on innovative web applications',
      location: 'Innovation Center',
      type: 'hackathon',
      link: '#'
    },
    {
      id: 3,
      title: 'Code Optimization Masterclass',
      date: '2026-03-10',
      time: '4:00 PM',
      description: 'Expert session on optimizing code for performance and efficiency',
      location: 'Auditorium, Building B',
      type: 'workshop',
      link: '#'
    },
    {
      id: 4,
      title: 'Q3 Project Showcase',
      date: '2026-03-20',
      time: '2:00 PM',
      description: 'Showcase of all team projects and innovations',
      location: 'Main Hall',
      type: 'event',
      link: '#'
    },
    {
      id: 5,
      title: 'DevOps & Cloud Workshop',
      date: '2026-01-20',
      time: '3:30 PM',
      description: 'Introduction to DevOps practices and cloud deployment',
      location: 'Tech Lab, Building A',
      type: 'workshop',
      link: '#'
    },
    {
      id: 6,
      title: 'Q4 Hackathon',
      date: '2025-12-10',
      time: '9:00 AM',
      description: 'Competitive hackathon with exciting prizes',
      location: 'Innovation Center',
      type: 'hackathon',
      link: '#'
    }
  ]
};

// Loa