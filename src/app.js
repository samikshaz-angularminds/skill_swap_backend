import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import httpStatus from "http-status";
import ApiError from "./errors/ApiError.js";
import session  from "express-session";
import passport from "./config/passport.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      console.log('Multer error:', err);
      res.status(500).send('Multer error occurred');
    } else {
      next(err);
    }
  });

// for google auth
app.use(session({ secret: "your_secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const corsConfig = cors({
  origin: ['http://localhost:3000'],
  credentials:true
});
app.use(corsConfig);

app.use('/',routes);

app.use((req,res,next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'not found'));
});


export default app;
