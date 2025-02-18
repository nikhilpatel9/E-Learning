import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/user/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const { name, email, picture } = profile._json;
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                name,
                email,
                password: "",
                photoUrl: picture, // Store Google profile picture URL
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

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
