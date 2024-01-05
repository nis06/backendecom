const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/user'); 
const contactRoutes = require('./routes/contactRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(
  {
    origin:"https://frontendecom.vercel.app",
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  }
));
app.options("*", cors());

// Set credentials in the response headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('DB Connected Successfully'))
  .catch((error) => {
    console.log('DB Connection Failed');
    console.error(error);
    process.exit(1);
  });

// Use user routes
app.use('/auth', authRoutes);

app.use('/contact', contactRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
