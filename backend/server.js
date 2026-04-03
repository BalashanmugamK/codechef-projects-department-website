require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import Member model from file
const Member = require('./models/Member');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== CORS CONFIGURATION =====
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend.vercel.app',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/recruitment-db')
  .then(() => {
    console.log('MongoDB Atlas Connected');
    seedDefaults();
  })
  .catch(err => console.error('MongoDB Error:', err));

// ===== SCHEMAS =====

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    semester: { type: String, required: true },
    role: { type: String, required: true },
    skills: { type: String, required: true },
    experience: { type: String, required: true },
    portfolio: { type: String, required: true },
    linkedin: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const interviewSlotSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    bookedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const adminAccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});

const systemSchema = new mongoose.Schema({
    recruitmentOpen: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// ===== MODELS =====

const Application = mongoose.model('Application', applicationSchema);
const InterviewSlot = mongoose.model('InterviewSlot', interviewSlotSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const User = mongoose.model('User', userSchema);
const SystemStatus = mongoose.model('SystemStatus', systemSchema);
const Message = mongoose.model('Message', messageSchema);
const AdminAccount = mongoose.model('AdminAccount', adminAccountSchema);

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
        const mockMembers = [
            // Leads
            { name: 'Aakash Kumar', role: 'Technical Lead', group: 'Lead Developer', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Rahul Singh', role: 'Management Lead', group: 'Lead Developer', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Bala Shanmugam', role: 'Research Lead', group: 'Lead Developer', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            // Members
            { name: 'Priya Sharma', role: 'Frontend Developer', group: 'Core Team', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Arjun Patel', role: 'Backend Developer', group: 'Core Team', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Zara Khan', role: 'Game Developer', group: 'Core Team', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Meera Nair', role: 'Data Scientist', group: 'Core Team', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            { name: 'Vivek Reddy', role: 'Full Stack Developer', group: 'Core Team', tenure: '2025-26', photo: '', linkedin: '#', github: '#' },
            // Mentors
            { name: 'Dr. Amit Singh', role: 'Faculty Mentor', group: 'Mentor', tenure: '2025-26', photo: '', linkedin: '#', github: '#' }
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
        
        console.log('✨ Database seeding complete!');
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
    }
};

// ===== HEALTH CHECK =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ROUTES =====

// GET Projects
app.get('/projects', (req, res) => {
    res.json([
        { id: 1, name: "Project Alpha" },
        { id: 2, name: "Project Beta" }
    ]);
});

// ===== APPLICATION ENDPOINTS =====

app.post('/api/applications', async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully', application });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to submit application', error: error.message });
    }
});

app.get('/api/applications', async (req, res) => {
    try {
        const applications = await Application.find().sort({ timestamp: -1 });
        res.json({ success: true, applications, count: applications.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
});

// ===== INTERVIEW SLOTS =====

app.get('/api/interview-slots', async (req, res) => {
    try {
        const slots = await InterviewSlot.find().sort({ createdAt: -1 });
        res.json({ success: true, slots });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch interview slots', error: error.message });
    }
});

app.post('/api/slots', async (req, res) => {
    try {
        const { date, time } = req.body;
        if (!date || !time) return res.status(400).json({ success: false, message: 'Date and time are required' });
        const slot = new InterviewSlot({ date, time });
        await slot.save();
        res.json({ success: true, slot });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add slot', error: err.message });
    }
});

// ===== BOOKINGS =====

app.get('/api/bookings/:email', async (req, res) => {
    try {
        const bookings = await Booking.find({ email: req.params.email });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const { email, date, time } = req.body;
        const slotTaken = await Booking.findOne({ date, time });
        if (slotTaken) return res.status(400).json({ success: false, message: 'This slot is already booked' });
        const userBooked = await Booking.findOne({ email, date, time });
        if (userBooked) return res.status(400).json({ success: false, message: 'You already booked this slot' });
        const booking = new Booking({ email, date, time });
        await booking.save();
        res.status(201).json({ success: true, message: 'Slot booked successfully', booking });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to book slot', error: error.message });
    }
});

// ===== ADMIN ENDPOINTS =====

app.post('/api/admin/interview-slots', async (req, res) => {
    try {
        const { date, time } = req.body;
        if (!date || !time) return res.status(400).json({ success: false, message: 'Date and time are required' });
        const slot = new InterviewSlot({ date, time });
        await slot.save();
        res.status(201).json({ success: true, message: 'Interview slot added', slot });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add interview slot', error: error.message });
    }
});

app.get('/api/admin/applications', async (req, res) => {
    try {
        const applications = await Application.find().sort({ timestamp: -1 });
        res.json({ success: true, applications, count: applications.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch applications', error: error.message });
    }
});

app.delete('/api/admin/applications/:id', async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.id);
        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json({ success: true, message: 'Application removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove application', error: error.message });
    }
});

app.delete('/api/admin/interview-slots/:id', async (req, res) => {
    try {
        const slot = await InterviewSlot.findByIdAndDelete(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Interview slot not found' });
        res.json({ success: true, message: 'Interview slot removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove interview slot', error: error.message });
    }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ bookedAt: -1 });
        res.json({ success: true, bookings, count: bookings.length });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
});

// ===== SYSTEM CONFIG =====

app.get('/api/system', async (req, res) => {
    try {
        let system = await SystemStatus.findOne();
        if (!system) { system = new SystemStatus(); await system.save(); }
        res.json({ success: true, system });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch system config', error: error.message });
    }
});

app.post('/api/system', async (req, res) => {
    try {
        const { recruitmentOpen, maintenanceMode } = req.body;
        let system = await SystemStatus.findOne();
        if (!system) {
            system = new SystemStatus({ recruitmentOpen, maintenanceMode });
        } else {
            if (typeof recruitmentOpen === 'boolean') system.recruitmentOpen = recruitmentOpen;
            if (typeof maintenanceMode === 'boolean') system.maintenanceMode = maintenanceMode;
            system.updatedAt = Date.now();
        }
        await system.save();
        res.json({ success: true, system });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update system config', error: error.message });
    }
});

// ===== BROADCAST / ANNOUNCEMENTS =====

app.post('/api/admin/messages', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) return res.status(400).json({ success: false, message: 'Message text is required' });
        const message = new Message({ text: text.trim() });
        await message.save();
        res.status(201).json({ success: true, message: 'Message broadcasted', data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
});

app.post('/api/announce', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ success: false, message: 'Message is required' });
        const newMessage = new Message({ text: message.trim() });
        await newMessage.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send announcement', error: err.message });
    }
});

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
    }
});

app.get('/api/announce', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages.map(m => m.text));
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch announcements', error: error.message });
    }
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
        res.status(201).json({ success: true, message: 'User registered successfully', user: { name: user.name, email: user.email, role: user.role } });
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
        res.status(201).json({ success: true, message: 'User signup successful', user: { name: user.name, email: user.email, role: user.role } });
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
        res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
});

app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminAccount.findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        res.json({ success: true, message: 'Admin login successful', user: { name: 'Admin', email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
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

app.get('/api/members', async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        res.json({ success: true, members });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch members" });
    }
});

app.post('/api/members', async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.json({ success: true, member });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add member" });
    }
});

app.put('/api/members/:id', async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, message: 'Member updated', member });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to update member', error: error.message });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete member" });
    }
});

// ===== ADMIN ACCOUNTS MANAGEMENT =====

app.get('/api/admin/accounts', async (req, res) => {
    try {
        const accounts = await AdminAccount.find().sort({ createdAt: -1 });
        res.json({ success: true, accounts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch admin accounts', error: error.message });
    }
});

app.post('/api/admin/accounts', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingAdmin = await AdminAccount.findOne({ email });
        if (existingAdmin) return res.status(400).json({ success: false, message: 'Admin email already exists' });
        const admin = new AdminAccount({ email, password, role: role || 'admin' });
        await admin.save();
        res.status(201).json({ success: true, message: 'Admin account created', admin: { email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to create admin account', error: error.message });
    }
});

app.put('/api/admin/accounts/:email/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const admin = await AdminAccount.findOne({ email: req.params.email });
        if (!admin || admin.password !== currentPassword) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        admin.password = newPassword;
        await admin.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update password', error: error.message });
    }
});

// ===== START SERVER =====

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = { app, server };
