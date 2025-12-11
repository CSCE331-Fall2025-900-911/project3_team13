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
    secret: process.env.AUTH_ROUTER_SECRET,
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
      callbackURL: 'https://project3-team13-backend.onrender.com/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails[0].value;

        // 1️⃣ Check if email exists in users table
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );

        if (result.rows.length === 0) {
          // ❌ Email not in system → Not authorized
          return done(null, false, { message: "Email not registered" });
        }

        let user = result.rows[0];

        // 2️⃣ If google_id is missing, update it
        if (!user.google_id) {
          const update = await pool.query(
            'UPDATE users SET google_id = $1, name = $2 WHERE id = $3 RETURNING *',
            [googleId, name, user.id]
          );
          user = update.rows[0];
        }

        // 3️⃣ Login success
        return done(null, user);

      } catch (err) {
        console.error('Error with Google OAuth:', err);
        return done(err, null);
      }
    }
  )
);


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Route to start login
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'   // 🔥 Forces account chooser
  })
);

//Callback route after login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://cashier-project3-team13.vercel.app/not-authorized' //will change later when deploying
  }),
(req, res) => {
  const role = req.user?.role;

  if (role === "manager" || role === "cashier") {
    return res.redirect("https://cashier-project3-team13.vercel.app/layout");
  }

  // Anything else
  return res.redirect("https://cashier-project3-team13.vercel.app/not-authorized");
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
  res.redirect('https://cashier-project3-team13.vercel.app');
});

module.exports = router;
