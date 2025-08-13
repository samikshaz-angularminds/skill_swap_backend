import multer from "multer";

const storage = multer.diskStorage({

  filename: function (req, file, cb){
    console.log(">> Multer filename hit ✅", file.originalname);
    cb(null, file.originalname);
  }
});

export const upload = multer({ storage });
