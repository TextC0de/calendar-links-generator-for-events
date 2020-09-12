import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import icsRoutes from './routes';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/ics', icsRoutes);
app.use('/ics', express.static('public'));

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
});
