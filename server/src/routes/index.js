import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import controller from '../controllers';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../../public'));
    },
    filename: (req, file, cb) => {
        const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage });

const Router = express.Router();
Router.post('/file', upload.single('ics'), controller.upload);

export default Router;
