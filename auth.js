// Express Router

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { connectDB } = require('./db');
const initializePassport = require('./passport-config');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

initializePassport(
    passport,
    async email => {
        const database = await connectDB();
        const userCollection = database.collection('UserData');
        return userCollection.findOne({ email: email });
    },
    async id => {
        const database = await connectDB();
        const userCollection = database.collection('UserData');
        return userCollection.findOne({ id: id });
    }
);

router.use(passport.initialize());
router.use(flash());
router.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: false
}));
router.use(methodOverride('_method'));

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureFlash: true
}), async (req, res) => {
    try {
        const userEmail = req.user.email;
        const database = await connectDB();
        const userCollection = database.collection('UserData');
        const user = await userCollection.findOne({ email: userEmail });
        
        if (user) {
            const userId = user.id;
            res.status(200).json({ userId: userId, message: 'Login Successful' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Login Failed' });
    }
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const database = await connectDB();
        const userCollection = database.collection('UserData');
        await userCollection.insertOne({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.send('Registration Success');
    } catch (e) {
        console.log(e);
        res.send('Registration Failed');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.status(403).json({ message: 'Forbidden' });
    } else {
        return next();
    }
}

module.exports = router;