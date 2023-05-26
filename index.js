import express from 'express';
import passport, { Passport } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import expressSession from 'express-session';
import dotenv from "dotenv";
dotenv.config()

const app = express();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/google'
},(accessToken, refreshToken, profile, callback)=>{
    callback(null, profile);
}))

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:'/facebook',
    profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback)=>{
    callback(null, profile)
}))

passport.serializeUser((user,callback)=>{
    callback(null, user);
})

passport.deserializeUser((user, callback)=>{
    callback(null, user);
})

app.use(expressSession({
    secret: 'sendhyrama',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
//routes
app.get('/login/google', passport.authenticate('google', {scope:['profile email']}));
app.get('/login/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/google', passport.authenticate('google'),(req,res)=>{
    res.redirect('/');
})
app.get('/facebook', passport.authenticate('facebook'),(req,res)=>{
    res.redirect('/');
})

app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });
  
app.get('/',(req,res)=>{

    res.send(req.user? req.user: 'Not logged in, login with Google or facebook');
})

app.listen(3000, ()=>{
    console.log('server started on 3000');
})