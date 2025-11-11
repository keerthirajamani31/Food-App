import mongoose from 'mongoose';
import app from './server.js';

const MONGO_URL = 'mongodb+srv://keerthanaanu3103_db_user:x1qF0wnIdCtzJYFH@fooddelivery.yl93klz.mongodb.net/?retryWrites=true&w=majority&appName=Fooddelivery';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Database Connected Successfully!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("🚀 Server is listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });