const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const auth = require('./middleware/auth'); // Додай це зверху
const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'https://bookkeep-your-reading-journey-main-1.onrender.com' // 👈 Встав сюди своє НОВЕ посилання фронтенду з Render
  ],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully via Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Перевіряємо, чи є вже такий користувач
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Шифруємо пароль
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Створюємо нового користувача
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ВХІД (Login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Шукаємо користувача по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Перевіряємо пароль (порівнюємо зашифрований з тим, що ввів юзер)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Якщо все ок — створюємо токен (перепустку)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 1. Отримати книги ТІЛЬКИ поточного користувача
app.get('/api/books', auth, async (req, res) => {
  try {
    // Шукаємо книги, де owner співпадає з id користувача з токена
    const books = await Book.find({ owner: req.user.id }).sort({ dateAdded: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Додати книгу (і прив'язати до користувача)
app.post('/api/books', auth, async (req, res) => {
  const book = new Book({
    ...req.body,       // Беремо всі дані з форми
    owner: req.user.id // 👇 Додаємо ID власника автоматично
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Оновити (тільки свою книгу)
app.patch('/api/books/:id', auth, async (req, res) => {
  try {
    // Шукаємо книгу по ID і по Власнику (щоб не оновити чужу)
    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id }, 
      req.body, 
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: "Book not found or not yours" });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Видалити (тільки свою книгу)
app.delete('/api/books/:id', auth, async (req, res) => {
  try {
    const deletedBook = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deletedBook) return res.status(404).json({ message: "Book not found or not yours" });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});