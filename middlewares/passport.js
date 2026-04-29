const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const signUpModel = require('../models/signUp');


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log('Profile: ', profile)
        let signUp = await signUpModel.findOne({ EmailAddress: profile._json.EmailAddress });
        
        if (!signUp) {
          signUp = new signUpModel({
            FullName: profile._json.FullName,
            EmailAddress: profile._json.EmailAddress,
            phoneNumber: profile._json.phoneNumber,
            Password: profile._json.Password,
            profilePicture: profile._json.profilePicture,

          })
          await signUp.save()
        }

        return cb(null, signUp)
        
    } catch (error) {
        return cb(null, error)
    }
  }
));

passport.serializeUser((signUp, cb) => {
  console.log(signUp)
  cb(null, signUp.id);
});

passport.deserializeUser(async (id, cb) => {
  // console.log(id)
  const signUp = await signUpModel.findById(id)

  if (!signUp) {
    return cb(new Error('User not found'), null)
  }
  cb(null, signUp)
});

const profile = passport.authenticate('google', {scope: ['profile', 'email'] })

const loginProfile = passport.authenticate('google', { failureRedirect: '/login' })

module.exports = {passport, profile, loginProfile }