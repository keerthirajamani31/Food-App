import foodRoute from './routes/foodRoute.js'
import express from 'express'
import cors from 'cors';
import offerRoute from './routes/offerRoute.js'
import registerRoute from './routes/registerRoute.js';
const app = express()

// Middleware
app.use(cors({
    origin: ['https://your-food-app.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json())

// Routes
app.use('/api/users', registerRoute);
app.use('/api/special-offers', offerRoute);
app.use('/api/food', foodRoute);

// Demo login route for portfolio
app.post('/api/demo/login', (req, res) => {
  const { email, password } = req.body;
  
  const demoUsers = {
    'admin@demo.com': { 
      password: 'admin123', 
      role: 'admin', 
      name: 'Demo Admin'
    },
    'user@demo.com': { 
      password: 'user123', 
      role: 'user', 
      name: 'Demo User'
    }
  };
  
  if (demoUsers[email] && demoUsers[email].password === password) {
    res.json({
      success: true,
      token: 'demo-token-' + Date.now(),
      user: demoUsers[email]
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "Food Delivery API is running!",
    endpoints: {
      users: '/api/users',
      food: '/api/food', 
      offers: '/api/special-offers',
      demo: '/api/demo/login',
      health: '/api/health'
    }
  });
});

export default app;