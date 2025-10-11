
const express = require('express');
const { PrismaClient } = require('./generated/prisma');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// Топ-5 по выращенным цветам
app.get('/api/top-flowers', async (req, res) => {
  try {
    const top = await prisma.user.findMany({
      orderBy: { flowersGrown: 'desc' },
      take: 5,
      select: { nickname: true, flowersGrown: true, coins: true }
    });
    return res.json({ top });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Топ-5 по монетам
app.get('/api/top-coins', async (req, res) => {
  try {
    const top = await prisma.user.findMany({
      orderBy: { coins: 'desc' },
      take: 5,
      select: { nickname: true, coins: true, flowersGrown: true }
    });
    return res.json({ top });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Сохранение количества монет пользователя
app.post('/api/coins', async (req, res) => {
  const { nickname, coins } = req.body;
  if (!nickname || typeof coins !== 'number') {
    return res.status(400).json({ error: 'Некорректные данные' });
  }
  try {
    const user = await prisma.user.update({
      where: { nickname },
      data: { coins },
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Регистрация пользователя и автоматический вход
app.post('/api/register', async (req, res) => {
  const { nickname } = req.body;
  if (!nickname || typeof nickname !== 'string') {
    return res.status(400).json({ error: 'Ник обязателен' });
  }
  try {
    let user = await prisma.user.findUnique({ where: { nickname } });
    if (user) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }
    user = await prisma.user.create({ data: { nickname } });
    // Автоматический вход: возвращаем пользователя
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить пользователя по нику
app.get('/api/user/:nickname', async (req, res) => {
  const { nickname } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { nickname } });
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});


// Сохранение количества выращенных цветков пользователя
app.post('/api/flowers-grown-count', async (req, res) => {
  const { nickname, count } = req.body;
  if (!nickname || typeof count !== 'number') {
    return res.status(400).json({ error: 'Некорректные данные' });
  }
  try {
    const user = await prisma.user.update({
      where: { nickname },
      data: { flowersGrown: count },
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
