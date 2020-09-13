import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import icsRoutes from './routes';

require('dotenv').config({
    path: path.join(
        __dirname,
        `../../.env.${process.env.NODE_ENV === 'production' ? 'production' : 'development'}`
    )
});

const PORT = process.env.EXPRESS_PORT || 5000;
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/ics', icsRoutes);
app.use('/files', express.static(path.join(__dirname, '../../public')));
app.use('/', express.static(path.join(__dirname, '../../client/build')));

if (process.env.NODE_ENV === 'production') {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
}

app.listen(PORT, (err) => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`>>> Server runing on ${process.env.HOST}:${process.env.PORT}`);
});
