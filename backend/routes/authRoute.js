const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const session = require('express-session');
const pool = require('../db/pool');
require('dotenv').config();

const router = express.Router();

// Configure session middleware (required for OAuth)
router.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize());
router.use(passport.session());

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails[0].value;

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        let user;

        if (result.rows.length === 0) {
          // Insert new user
          const insert = await pool.query(
            'INSERT INTO users (google_id, name, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [googleId, name, email, 'pending']
          );
          user = insert.rows[0];
        } else {
          user = result.rows[0];
        }

        done(null, user);
      } catch (err) {
        console.error('Error with Google OAuth:', err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route to start login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//Callback route after login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login' //will change later when deploying
  }),
  (req, res) => {
    res.redirect('http://localhost:5173/layout'); 
  }
);

router.get('/me', (req, res) => { //returns logged in user info
  if (!req.user) {
    return res.json({ user: null });
  }
  res.json({ user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('http://localhost:5173');
});

module.exports = router;
