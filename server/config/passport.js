
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../models/User");

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by googleId
        let user = await User.findOne({ googleId: profile.id });

        // If not, check by email
        if (!user && profile.emails && profile.emails.length > 0) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // Create user if doesn't exist
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.id}@google.com`,
            googleId: profile.id,
            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
            role: "buyer", // Default role
          });
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId, update it
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by facebookId
        let user = await User.findOne({ facebookId: profile.id });

        // If not, check by email
        if (!user && profile.emails && profile.emails.length > 0) {
          user = await User.findOne({ email: profile.emails[0].value });
        }

        // Create user if doesn't exist
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.id}@facebook.com`,
            facebookId: profile.id,
            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
            role: "buyer", // Default role
          });
        } else if (!user.facebookId) {
          // If user exists but doesn't have facebookId, update it
          user.facebookId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Serialize and deserialize user (needed only if using sessions)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
