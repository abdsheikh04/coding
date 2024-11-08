// Required modules
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Mongoose Models
const User = require('./models/User');
const Contact = require('./models/Contact');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// MongoDB connection setup (using original Atlas connection string)
mongoose.connect('mongodb+srv://mohammadabdullahsheikh04:EgmTCz5knbl49GUS@app.r9ibq.mongodb.net/app?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes

// Home route
app.get('/', (req, res) => {
  res.render('index', { username: null });
});

// Register page
app.get('/register', (req, res) => {
  res.render('register', { errorMessage: null, successMessage: null });
});

// Registration functionality
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('register', { errorMessage: 'Username or email already registered. Please log in.', successMessage: null });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    // Optionally, you can redirect to login with a success message passed in a query parameter
    // or you can just render the register page again with successMessage.
    res.render('register', { errorMessage: null, successMessage: 'Registration successful! Please log in.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).render('register', { errorMessage: 'Error registering user', successMessage: null });
  }
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { errorMessage: null });
});

// Login functionality
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      return res.redirect('/'); // Redirect to homepage
    }
    res.render('login', { errorMessage: 'Invalid username or password.' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { errorMessage: 'Login error' });
  }
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', { successMessage: null, errorMessage: null });
});

// Contact form submission
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.render('contact', { successMessage: 'Message sent successfully!', errorMessage: null });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).render('contact', { successMessage: null, errorMessage: 'Error sending message' });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
