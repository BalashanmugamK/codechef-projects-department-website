require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import models from files
const Member = require('./models/Member');
const User = require('./models/User');
const AdminAccount = require('./models/AdminAccount');
const Application = require('./models/Application');
const InterviewSlot = require('./models/InterviewSlot');
const Message = require('./models/Message');
const SystemStatus = require('./models/SystemStatus');
const Notification = require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS CONFIGURATION =====
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      process.env.FRONTEND_LOCAL
    ].filter(Boolean);

    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    // Allow exact matches
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // Allow all vercel domains safely
    if (origin.includes(".vercel.app")) {
      return callback(null, true);
    }

    console.warn(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ===== MONGODB CONNECTION =====
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ CRITICAL: MONGO_URI environment variable is not set!');
    console.error('   Please set MONGO_URI in your .env file');
    console.error('   Format: mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas Connected Successfully');
    await seedDefaults();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('   Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// ===== SCHEMAS =====
// Schemas are defined in separate model files

// ===== SEED DEFAULT DATA =====

const seedDefaults = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Seed admin accounts
        const defaultAdmins = [
            { email: 'admin@codechef-projects.com', password: 'Admin@123', role: 'super-admin' },
            { email: 'lead@codechef-projects.com', password: 'Lead@123', role: 'admin' }
        ];
        for (const adminData of defaultAdmins) {
            const existing = await AdminAccount.findOne({ email: adminData.email });
            if (!existing) {
                await new AdminAccount(adminData).save();
                console.log(`✓ Seeded admin: ${adminData.email}`);
            }
        }

        // Seed test user
        const testEmail = 'user@test.com';
        const existingUser = await User.findOne({ email: testEmail });
        if (!existingUser) {
            const hashedPw = await bcrypt.hash('User@123', 10);
            await new User({ name: 'Test User', email: testEmail, password: hashedPw, role: 'user' }).save();
            console.log('✓ Seeded test user: user@test.com');
        }

        // Seed members from mockData
        // SVG data URIs for avatar badges - no external service dependency
        const createAvatarSVG = (initials, bgColor) => {
            const svg = `<svg width="140" height="140" xmlns="http://www.w3.org/2000/svg">
                <rect width="140" height="140" fill="#${bgColor}"/>
                <text x="50%" y="50%" font-size="56" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif">${initials}</text>
            </svg>`;
            return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        };

        const mockMembers = [
            // Leads
            { name: 'Aakash Kumar', role: 'Technical Lead', group: 'Lead Developer', tenure: '2025-26', photo: createAvatarSVG('AK', 'FF6B35'), linkedin: '#', github: '#' },
            { name: 'Rahul Singh', role: 'Management Lead', group: 'Lead Developer', tenure: '2025-26', photo: createAvatarSVG('RS', 'FF8C42'), linkedin: '#', github: '#' },
            { name: 'Bala Shanmugam', role: 'Research Lead', group: 'Lead Developer', tenure: '2025-26', photo: createAvatarSVG('BS', '667EEA'), linkedin: '#', github: '#' },
            // Members
            { name: 'Priya Sharma', role: 'Frontend Developer', group: 'Core Team', tenure: '2025-26', photo: createAvatarSVG('PS', 'F4A261'), linkedin: '#', github: '#' },
            { name: 'Arjun Patel', role: 'Backend Developer', group: 'Core Team', tenure: '2025-26', photo: createAvatarSVG('AP', '2A9D8F'), linkedin: '#', github: '#' },
            { name: 'Zara Khan', role: 'Game Developer', group: 'Core Team', tenure: '2025-26', photo: createAvatarSVG('ZK', 'E76F51'), linkedin: '#', github: '#' },
            { name: 'Meera Nair', role: 'Data Scientist', group: 'Core Team', tenure: '2025-26', photo: createAvatarSVG('MN', '264653'), linkedin: '#', github: '#' },
            { name: 'Vivek Reddy', role: 'Full Stack Developer', group: 'Core Team', tenure: '2025-26', photo: createAvatarSVG('VR', 'e9c46a'), linkedin: '#', github: '#' },
            // Mentors
            { name: 'Dr. Amit Singh', role: 'Faculty Mentor', group: 'Mentor', tenure: '2025-26', photo: createAvatarSVG('AS', '1a535c'), linkedin: '#', github: '#' }
        ];

        const memberCount = await Member.countDocuments();
        console.log(`📊 Current members in DB: ${memberCount}`);
        
        if (memberCount !== mockMembers.length) {
            console.log(`⚠️  Expected ${mockMembers.length} members but found ${memberCount}. Clearing and reseeding...`);
            await Member.deleteMany({});
            console.log('🗑️  Cleared all members');
            
            await Member.insertMany(mockMembers);
            console.log(`✅ Seeded ${mockMembers.length} members to database`);
        } else {
            console.log(`✓ Database already has all ${memberCount} members`);
        }

        // Seed sample applications if needed
        const appCount = await Application.countDocuments();
        if (appCount === 0) {
            const sampleApps = [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '9876543210',
                    semester: '4',
                    role: 'Frontend Developer',
                    skills: 'React, JavaScript, CSS',
                    experience: '1 year in web development',
                    portfolio: 'https://johndoe.dev',
                    linkedin: 'https://linkedin.com/in/johndoe'
                },
                {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '9876543211',
                    semester: '4',
                    role: 'Backend Developer',
                    skills: 'Node.js, MongoDB, Python',
                    experience: '2 years in backend development',
                    portfolio: 'https://janesmith.dev',
                    linkedin: 'https://linkedin.com/in/janesmith'
                },
                {
                    name: 'Mike Johnson',
                    email: 'mike@example.com',
                    phone: '9876543212',
                    semester: '3',
                    role: 'Game Developer',
                    skills: 'Unity, C#, Game Design',
                    experience: '1.5 years in game development',
                    portfolio: 'https://mikejohnson.dev',
                    linkedin: 'https://linkedin.com/in/mikejohnson'
                }
            ];
            await Application.insertMany(sampleApps);
            console.log(`✅ Seeded ${sampleApps.length} sample applications`);
        }
        
        console.log('✨ Database seeding complete!');
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
    }
};

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  console.log('HEALTH ENDPOINT CALLED');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/ping', (req, res) => {
  console.log('PING ENDPOINT CALLED');
  res.json({ success: true, message: 'pong', timestamp: new Date().toISOString() });
});

// GET Members - moved here for testing
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find({});
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch members', error: error.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add member', error: error.message });
  }
});

app.patch('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update member', error: error.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove member', error: error.message });
  }
});

// ===== ROUTES =====

// GET Projects
app.get('/projects', (req, res) => {
    res.json([
        { id: 1, name: "Project Alpha" },
        { id: 2, name: "Project Beta" }
    ]);
});

// ===== AUTHENTICATION =====

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name/email/password are required' });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: 'user' });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role, github: user.github, linkedin: user.linkedin, photo: user.photo, codechef: user.codechef } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Registration failed', error: error.message });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name/email/password are required' });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: 'user' });
        await user.save();
        res.status(201).json({ success: true, message: 'User signup successful', user: { _id: user._id, name: user.name, email: user.email, role: user.role, github: user.github, linkedin: user.linkedin, photo: user.photo, codechef: user.codechefHandle } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Signup failed', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: 'Login successful', user: { _id: user._id, name: user.name, email: user.email, role: user.role, github: user.github, linkedin: user.linkedin, photo: user.photo, codechef: user.codechefHandle }, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminAccount.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: 'Admin login successful', user: { name: 'Admin', email: admin.email, role: admin.role, _id: admin._id }, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
    }
});

// Temporary route to check admin accounts
app.get('/api/auth/check-admins', async (req, res) => {
    try {
        const admins = await AdminAccount.find({}).select('email role createdAt');
        res.json({ 
            success: true, 
            count: admins.length,
            admins: admins 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to check admins', error: error.message });
    }
});

// Temporary route to seed admin accounts (force recreate)
app.post('/api/auth/seed-admins', async (req, res) => {
    try {
        console.log('🌱 Force seeding admin accounts...');
        
        // Delete all existing admin accounts
        await AdminAccount.deleteMany({});
        console.log('🗑️ Deleted existing admin accounts');
        
        const defaultAdmins = [
            { email: 'admin@codechef-projects.com', password: 'Admin@123', role: 'super-admin' },
            { email: 'lead@codechef-projects.com', password: 'Lead@123', role: 'admin' }
        ];
        
        for (const adminData of defaultAdmins) {
            const admin = new AdminAccount(adminData);
            await admin.save();
            console.log(`✓ Created admin: ${adminData.email}`);
        }
        
        const count = await AdminAccount.countDocuments();
        console.log(`✅ Total admin accounts: ${count}`);
        
        res.json({ 
            success: true, 
            message: 'Admin accounts force-seeded successfully',
            admins: [
                { email: 'admin@codechef-projects.com', password: 'Admin@123' },
                { email: 'lead@codechef-projects.com', password: 'Lead@123' }
            ]
        });
    } catch (error) {
        console.error('❌ Seeding error:', error);
        res.status(500).json({ success: false, message: 'Failed to seed admins', error: error.message });
    }
});

app.post('/api/auth/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.json({ success: true, message: "Email found" });
        else return res.json({ success: false, message: "Email not registered" });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to check email', error: error.message });
    }
});

// ===== USER ROUTES =====
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
console.log('User routes mounted');

// ===== ADMIN ROUTES =====
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
console.log('Admin routes mounted');

// ===== MEMBERS ROUTES =====
const membersRoutes = require('./routes/members');
app.use('/api/members', membersRoutes);
console.log('Members routes mounted');

// ===== NOTIFICATIONS ROUTES =====
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({});
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
});

app.put('/api/notifications/:id/read', userAuth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user.id }
    });
    res.json({ success: true, message: 'Notification marked read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
  }
});

app.put('/api/notifications/:id/dismiss', userAuth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { dismissedBy: req.user.id }
    });
    res.json({ success: true, message: 'Notification dismissed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to dismiss notification', error: error.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// ===== INTERVIEW SLOTS ROUTES =====
app.get('/api/interview-slots', async (req, res) => {
  try {
    const slots = await InterviewSlot.find({});
    res.json({ success: true, slots });
  } catch (error) {
    console.error('Error fetching interview slots:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interview slots', error: error.message });
  }
});

// ===== APPLICATIONS ROUTES =====
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find({});
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, phone, semester, role, skills, experience, portfolio, linkedin } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
    }
    
    const newApp = new Application({
      name,
      email,
      phone,
      semester,
      role,
      skills,
      experience,
      portfolio,
      linkedin
    });
    
    await newApp.save();
    res.status(201).json({ success: true, message: 'Application submitted', application: newApp });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application', error: error.message });
  }
});

// ===== SYSTEM STATUS ROUTES =====
app.get('/api/system', async (req, res) => {
  try {
    let system = await SystemStatus.findOne();
    if (!system) {
      system = new SystemStatus({
        recruitmentOpen: true,
        maintenanceMode: false
      });
      await system.save();
    }

    const responseSystem = {
      ...system.toObject(),
      registrationOpen: system.recruitmentOpen,
      recruitmentOpen: system.recruitmentOpen
    };

    res.json({ success: true, system: responseSystem });
  } catch (error) {
    console.error('System fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system config' });
  }
});

app.patch('/api/system', async (req, res) => {
  try {
    const updates = req.body;
    let system = await SystemStatus.findOne();

    if (!system) {
      system = new SystemStatus({
        recruitmentOpen: true,
        maintenanceMode: false
      });
    }

    if (updates.registrationOpen !== undefined) {
      system.recruitmentOpen = updates.registrationOpen;
    }
    if (updates.recruitmentOpen !== undefined) {
      system.recruitmentOpen = updates.recruitmentOpen;
    }
    if (updates.maintenanceMode !== undefined) {
      system.maintenanceMode = updates.maintenanceMode;
    }

    await system.save();

    const responseSystem = {
      ...system.toObject(),
      registrationOpen: system.recruitmentOpen,
      recruitmentOpen: system.recruitmentOpen
    };

    res.json({ success: true, system: responseSystem });
  } catch (error) {
    console.error('System update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update system config' });
  }
});

app.post('/api/system', async (req, res) => {
  try {
    const updates = req.body;
    let system = await SystemStatus.findOne();

    if (!system) {
      system = new SystemStatus({
        recruitmentOpen: true,
        maintenanceMode: false
      });
    }

    if (updates.registrationOpen !== undefined) {
      system.recruitmentOpen = updates.registrationOpen;
    }
    if (updates.recruitmentOpen !== undefined) {
      system.recruitmentOpen = updates.recruitmentOpen;
    }
    if (updates.maintenanceMode !== undefined) {
      system.maintenanceMode = updates.maintenanceMode;
    }

    await system.save();

    const responseSystem = {
      ...system.toObject(),
      registrationOpen: system.recruitmentOpen,
      recruitmentOpen: system.recruitmentOpen
    };

    res.json({ success: true, system: responseSystem });
  } catch (error) {
    console.error('System update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update system config' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test route works' });
});

// ===== FALLBACK ROUTES (ORDER MATTERS: Must come AFTER all specific routes) =====
// Catch-all for unknown API routes - using app.use() is the Express 5 safe way
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found', path: req.path });
});

// Global fallback for all other routes (Express 5: NO wildcard syntax!)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ===== START SERVER =====
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});