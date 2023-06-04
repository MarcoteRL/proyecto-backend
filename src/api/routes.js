const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory.model');
const User = require('../models/user.model');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hash });

  try {
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: 'Incorrect username or password.' });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ message: 'Logged in successfully', token, accessToken, refreshToken });
  console.log('refreshTokens', refreshTokens)
  console.log('token', token)
  console.log('accessToken', accessToken)
  console.log(({ message: 'Logged in successfully', token, accessToken, refreshToken }))
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401); // No token provided
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // Invalid token

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
});



router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    console.log('inventory', inventory)
    res.json(inventory);
  } catch (error) {
    console.error(`Error al obtener el inventario: ${error}`);
    res.status(500).send('Error al obtener el inventario');
  }
});

router.post('/createProduct', async (req, res) => {
  console.log('req.body', req.body)
  const { name, description, price, image } = req.body;
  try {
    const newProduct = new Inventory({
      name,
      description,
      price,
      image
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(`Error al agregar el producto: ${error}`);
    res.status(500).send('Error al agregar el producto');
  }
});


router.put('/updateProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productObjectId = new ObjectId(productId);
    const { name, description, price, image } = req.body;
    const inventory = await Inventory.findByIdAndUpdate({ _id: productObjectId }, {
      name,
      description,
      price,
      image
    });
    res.json(inventory);
  } catch (error) {
    console.error(`Error al actualizar el producto: ${error}`);
    res.status(500).send('Error al actualizar el producto');
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productObjectId = new ObjectId(productId);
    const inventory = await Inventory.findByIdAndDelete({ _id: productObjectId });
    res.json(inventory);
  } catch (error) {
    console.error(`Error al eliminar el producto: ${error}`);
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;