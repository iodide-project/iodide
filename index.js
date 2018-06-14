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
const db = require('./server/models')
const apiRouter = require('./server/routes')
const User = db.User

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id.'))
    }
    done(null, user)
  })
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
    // asynchronous verification, for effect...
    process.nextTick(function () {
      User.findOne({
        where: {'githubUserId' : profile.id}
      }).then(user => {
        if (user) {
          user.accessToken = accessToken
          user.save()
          return done(null, user);
        }
        else {
          var newUser = new User();
          newUser.githubUserId = profile.id,
          newUser.accessToken  = accessToken,
          newUser.avatar       = profile.photos[0].value;
          // save
          newUser.save(function(err){
            if (err) throw err;
            return done(null, newUser);
          });
        }
      }).catch(err => {
        return done(err)
      })
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
  return ''
};

// // Sync Database
// db.sequelize.sync().then(function(){
//   console.log('Nice! Database looks fine')
// }).catch(function(err){
//   console.log(err,"Something went wrong with the Database Update!")
// });


express()
  .use(express.static(path.join(__dirname, 'dev'), {'index': 'iodide.dev.html'}))
  .set('views', path.join(__dirname, 'server/views'))
  .set('view engine', 'ejs')
  .use(partials())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(methodOverride())
  .use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/api', apiRouter)
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
