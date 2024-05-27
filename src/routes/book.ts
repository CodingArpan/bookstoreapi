import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { authenticateSeller } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

interface Book {
    title: string;
    author: string;
    publishedDate: Date;
    price: number;
    sellerId: number;
}

router.post('/upload', authenticateSeller, upload.single('file'), async (req, res) => {
    try {



        const file = req.file;
        //@ts-ignore
        console.log(req.user, file)
        //@ts-ignore
        const sellerId = req.user.userId;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const books: Book[] = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (row) => {
                books.push({
                    title: row.title,
                    author: row.author,
                    publishedDate: new Date(row.publishedDate),
                    price: parseFloat(row.price),
                    sellerId,
                });
            })
            .on('end', async () => {
                await prisma.book.createMany({ data: books });
                fs.unlinkSync(file.path);
                res.status(201).json({ message: 'Books uploaded successfully' });
            });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticateSeller, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishedDate, price } = req.body;
        //@ts-ignore
        const sellerId = req.user.userId;

        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!book || book.sellerId !== sellerId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const updatedBook = await prisma.book.update({
            where: { id: parseInt(id) },
            data: { title, author, publishedDate: new Date(publishedDate), price },
        });

        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authenticateSeller, async (req, res) => {
    try {
        const { id } = req.params;
        //@ts-ignore
        const sellerId = req.user.userId;

        const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
        if (!book || book.sellerId !== sellerId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await prisma.book.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;