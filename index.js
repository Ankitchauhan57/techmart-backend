const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// let users=[];
mongoose.connect("mongodb+srv://ankitchauhan6331:qy3HZtgsQNc840Nj@cluster0.vxlhkuz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: Number,
  cart: [{
    productId: String,
    quantity: { type: Number, default: 1 }
  }],
  wishlist: [{
    productId: String
  }]
}, {
  timestamps: true
});
const User = mongoose.model('users', userSchema);


app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Error retrieving user');
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send('Error saving user');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); //  MongoDB query
    // or use bcrypt for hash check
    if (user) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).send('Error updating user');
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('User not found');
    res.send('User deleted');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
});

//products
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  brand: String
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error retrieving products');
  }
});
//contact
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  message: String
}, {
  timestamps: true
});
const Contact = mongoose.model('Contact', contactSchema);
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(201).json({ message: 'Contact saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

//billing
const billingSchema = new mongoose.Schema({
  name: String,
  address: String,
  extra: String,
  town: String,
  phone: String,
  email: String,
  saveInfo: Boolean,
  cartItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  total: Number,
  paymentMethod: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Billing', billingSchema);
app.post('/billing', async (req, res) => {
  try {
    const billing = new Billing(req.body);
    await billing.save();
    res.status(201).json({ message: 'Billing info saved successfully' });
  } catch (error) {
    console.error('Billing error:', error);
    res.status(500).json({ message: 'Failed to save billing info' });
  }
});


app.listen(3000, () => console.log('Server running on port 3000'));

