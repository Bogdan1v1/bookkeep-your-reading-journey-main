const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Отримуємо токен із заголовка запиту
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // 2. Якщо токена немає — відмова
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Перевіряємо токен
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Додаємо дані юзера (id) в запит
    next(); // Пропускаємо далі
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};