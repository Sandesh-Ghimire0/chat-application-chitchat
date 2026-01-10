import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
        // using original name is not recommended because if the files name are same they can be overwritten
        // right now i am only uplaoding the file in the local system  for few seconds it might not be the problem
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
