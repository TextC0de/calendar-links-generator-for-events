import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import icsRoutes from './routes';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/ics', icsRoutes);
app.use('/ics', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
});
