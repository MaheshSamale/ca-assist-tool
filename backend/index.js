import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://maheshsamale7:Ne4o8ktrZfJHZWK8@cluster0.kqnu7xa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:',err));

// MODELS
const clientSchema = new mongoose.Schema({
  name: String,
  pan: String,
  gstin: String,
  documentStatus: {
    gstReturn: Boolean,
    tdsFiling: Boolean
  },
  nextDeadline: String,
  email: String
});
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Client = mongoose.model('Client', clientSchema);
const User = mongoose.model('User', userSchema);

// AUTH MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).send("Unauthorized");
  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(403).send("Invalid Token");
  }
};

// ROUTES
app.post('/api/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered" });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(404).send("User not found");
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(403).send("Invalid credentials");
  const token = jwt.sign({ id: user._id }, "secret", { expiresIn: '1h' });
  res.json({ token });
});

app.get('/api/clients', authMiddleware, async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

app.post('/api/clients', authMiddleware, async (req, res) => {
  const client = new Client(req.body);
  await client.save();
  res.json(client);
});

app.put('/api/clients/:id', authMiddleware, async (req, res) => {
  const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(client);
});
app.delete('/api/clients/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(204).send(); // Success, no content
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/deadlines', authMiddleware, async (req, res) => {
  const clients = await Client.find().sort({ nextDeadline: 1 });
  res.json(clients);
});

app.get('/api/remind', async (req, res) => {
  const today = new Date();
  const clients = await Client.find();
  clients.forEach(c => {
    const daysLeft = (new Date(c.nextDeadline) - today) / (1000 * 3600 * 24);
    if (daysLeft <= 3) {
      console.log(`Reminder: Email to ${c.email || 'N/A'} for ${c.name} due on ${c.nextDeadline}`);
    }
  });
  res.send("Reminder check complete (console)");
});

app.listen(5001, () => console.log('Server running on port 5001'));

