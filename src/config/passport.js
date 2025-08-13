
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.model.js"
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { envConfig } from "./envConfig.js";

passport.use(new GoogleStrategy({
    clientID: envConfig.google_client_id,
    clientSecret: envConfig.google_client_secret,
    callbackURL: envConfig.google_callback_uri,
}, async (accessToken, refreshToken, profile, done) => {
    // console.log({accessToken, refreshToken, profile, done});
    
    // Find or create user
    let user = await User.findOne({ email: profile.emails[0].value });

    let avatarGoogle = { public_id: "", url: "" };
    // if (profile.photos && profile.photos.length > 0) {
    //     avatarGoogle = await uploadImage(profile.photos[0].value);
    // }

    if (!user) {
        // console.log("profile-----> ", profile);
        const fakePassword = bcrypt.hashSync(uuidv4(), 10);
        user = await User.create({
            uid: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: avatarGoogle,
            uid: uuidv4(),
            username: profile.displayName,
            password: fakePassword,
        });
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    // console.log("serializing user: ", user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    
    const user = await User.findById(id);
    // console.log("de-serializing user: ", user);
    done(null, user);
});

export default passport;