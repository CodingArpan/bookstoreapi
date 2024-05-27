import express from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth'
import bookRoutes from './routes/book'
import { authenticateToken } from './middleware/auth';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', authenticateToken, bookRoutes);

app.get('/health', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});