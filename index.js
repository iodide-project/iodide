const express = require('express')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const partials = require('express-partials')
const GitHubStrategy = require('passport-github2').Strategy

const PORT = process.env.PORT || 5000
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SERVER_URI } = process.env

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
passport.use(new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${SERVER_URI}/auth/github/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    const userData = {
      firstName: profile.displayName.split(' ')[0],
      avatar: profile.photos[0].value,
      accessToken,
    }
    // asynchronous verification, for effect...
    process.nextTick(() => done(null, userData))
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
  },
))

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
  return ''
};

express()
  .use(express.static(path.join(__dirname, 'dev'), { index: 'iodide.dev.html' }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(partials())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(methodOverride())
  .use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .get('/', (req, res) => {
    res.render('index', { user: req.user });
  })
  .get('/account', ensureAuthenticated, (req, res) => {
    res.render('account', { user: req.user });
  })
  .get('/login', (req, res) => {
    res.render('login', { user: req.user });
  })
  .get('/success', (req, res) => {
    res.render('success', { user: req.user });
  })
  .get('/failure', (req, res) => {
    res.render('failure', { user: req.user });
  })
  .get('/logout', (req, res) => {
    try {
      req.logout()
      res.json({ status: 'success' })
    } catch (err) {
      console.log(err)
      res.json({ status: 'failed' })
    }
  })
  .get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email', 'gist'] }),
    () => {
      // The request will be redirected to GitHub for authentication, so this
      // function will not be called.
    },
  )
  .get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/failure' }),
    (req, res) => {
      res.redirect('/success');
    },
  )
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
