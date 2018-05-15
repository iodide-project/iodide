const express = require('express')
const path = require('path')
const passport = require('passport')
const util = require('util')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const GitHubStrategy = require('passport-github2').Strategy
const partials = require('express-partials')
const PORT = process.env.PORT || 5000
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const SERVER_URI = process.env.SERVER_URI

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
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: `${SERVER_URI}/auth/github/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
};

express()
  .use(express.static(path.join(__dirname, 'prod'), {'index': 'iodide.iodide-server.html'}))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(partials())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(methodOverride())
  .use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .get('/', function(req, res){
    res.render('index', { user: req.user });
  })
  .get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  })
  .get('/login', (req, res) => {
    res.render('login', { user: req.user });
  })
  .get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  })
  .get('/auth/github',
       passport.authenticate('github', { scope: [ 'user:email' ] }),
       (req, res) => {
         // The request will be redirected to GitHub for authentication, so this
         // function will not be called.
       })
  .get('/auth/github/callback',
       passport.authenticate('github', { failureRedirect: '/login' }),
       function(req, res) {
         // Successful authentication, redirect home.
         res.redirect('/');
       })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

console.log(process.env);
