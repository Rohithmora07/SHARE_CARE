const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'qFo2PtdbPAI/zQgp/du1OCp1JEl9snmEJ+6oidm16Ic='

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Set Pug as the view engine
app.set('views', path.join(__dirname, '../client'));
app.set('view engine', 'pug'); // This works for .jade files too


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sharecare', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    phone: String,
    password: String,
    userType: { type: String, enum: ['donor', 'volunteer', 'organization'] },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Donation Schema
const donationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    category: String,
    paymentMethod: String,
    campaignId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

// Volunteer Schema
const volunteerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    address: String,
    skills: String,
    roles: [String],
    availability: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

// Adoption Inquiry Schema
const adoptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    address: String,
    preferences: String,
    household: [String],
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

// Contact Form Schema
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// API Routes

// User Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, userType } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            userType,
        });

        await user.save();

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Process Donation
app.post('/api/donations', authenticateToken, async (req, res) => {
    try {
        const { amount, category, paymentMethod, campaignId } = req.body;

        if (!amount || amount < 100) {
            return res.status(400).json({ message: 'Minimum donation amount is ₹100' });
        }

        const donation = new Donation({
            userId: req.user.userId,
            amount,
            category: category || 'general',
            paymentMethod,
            campaignId,
        });

        await donation.save();

        // Simulate payment processing
        setTimeout(async () => {
            donation.status = 'completed';
            await donation.save();
            res.status(201).json({ message: 'Donation processed successfully', donationId: donation._id });
        }, 2000);
    } catch (error) {
        res.status(500).json({ message: 'Error processing donation', error: error.message });
    }
});

// Volunteer Registration
app.post('/api/volunteers', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, city, address, skills, roles, availability } = req.body;

        const volunteer = new Volunteer({
            userId: req.user.userId,
            firstName,
            lastName,
            email,
            phone,
            city,
            address,
            skills,
            roles,
            availability,
        });

        await volunteer.save();

        res.status(201).json({ message: 'Volunteer application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting volunteer application', error: error.message });
    }
});

// Adoption Inquiry
app.post('/api/adoptions', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, city, address, preferences, household } = req.body;

        const adoption = new Adoption({
            userId: req.user.userId,
            firstName,
            lastName,
            email,
            phone,
            city,
            address,
            preferences,
            household,
        });

        await adoption.save();

        res.status(201).json({ message: 'Adoption inquiry submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting adoption inquiry', error: error.message });
    }
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        const contact = new Contact({
            firstName,
            lastName,
            email,
            phone,
            subject,
            message,
        });

        await contact.save();

        res.status(201).json({ message: 'Contact message submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting contact message', error: error.message });
    }
});

// Serve Frontend (Pug Template) for all other GET requests
app.get('*', (req, res) => {
    res.render('index');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});