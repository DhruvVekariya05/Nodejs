const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { MongoClient } = require('mongodb');

const router = express.Router();

let client;
try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} catch (error) {
    console.error('Error initializing Twilio client:', error.message);
    console.error('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
    console.error('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN);
}

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    const { username, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const mongoClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
        const db = mongoClient.db(process.env.DB_NAME);
        const signupCollection = db.collection('signup');

        const existingUser = await signupCollection.findOne({ username });
        if (existingUser) {
            console.log('Username already exists');
            return res.status(400).send('Username already exists');
        }

        const result = await signupCollection.insertOne({ username, password: hashedPassword, phone });
        console.log('Inserted document:', result.insertedId);
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Error during signup');
    } finally {
        await mongoClient.close();
        console.log('Closed MongoDB connection');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const mongoClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB');
        const db = mongoClient.db(process.env.DB_NAME);
        const signupCollection = db.collection('signup');

        const user = await signupCollection.findOne({ username });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET);
            req.session.token = token;
            req.session.username = username;
            console.log('Login successful, redirecting to dashboard');
            return res.redirect('/dashboard');
        } else {
            console.log('Invalid username or password');
            return res.redirect('/auth/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    } finally {
        await mongoClient.close();
        console.log('Closed MongoDB connection');
    }
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/forgot-password', async (req, res) => {
    const { phone } = req.body;

    const mongoClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB_NAME);
        const signupCollection = db.collection('signup');

        const user = await signupCollection.findOne({ phone });
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            await signupCollection.updateOne({ _id: user._id }, { $set: { otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) } });

            // Send OTP via Twilio
            await client.messages.create({
                body: `Your OTP for password reset is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone
            });

            res.redirect('/auth/verify-otp');
        } else {
            res.status(400).send('No user found with this phone number');
        }
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).send('Error during forgot password process');
    } finally {
        await mongoClient.close();
    }
});


router.get('/verify-otp', (req, res) => {
    res.render('verify-otp');
});

router.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;

    const mongoClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB_NAME);
        const signupCollection = db.collection('signup');

        const user = await signupCollection.findOne({
            phone,
            otp: parseInt(otp),
            otpExpiry: { $gt: new Date() }
        });

        if (user) {
            // OTP is valid, allow password reset
            req.session.resetPhone = phone;
            res.redirect('/auth/reset-password');
        } else {
            res.status(400).send('Invalid or expired OTP');
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).send('Error during OTP verification');
    } finally {
        await mongoClient.close();
    }
});


router.get('/reset-password', (req, res) => {
    res.render('reset-password');
});

router.get('/reset-password', (req, res) => {
    if (req.session.resetPhone) {
        res.render('reset-password');
    } else {
        res.redirect('/auth/forgot-password');
    }
});

router.post('/reset-password', async (req, res) => {
    const { newPassword } = req.body;
    const phone = req.session.resetPhone;

    if (!phone) {
        return res.status(400).send('Invalid reset request');
    }

    const mongoClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB_NAME);
        const signupCollection = db.collection('signup');

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await signupCollection.updateOne(
            { phone },
            {
                $set: { password: hashedPassword },
                $unset: { otp: "", otpExpiry: "" }
            }
        );

        delete req.session.resetPhone;
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send('Error during password reset process');
    } finally {
        await mongoClient.close();
    }
});

module.exports = router;
