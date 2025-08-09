require('dotenv').config();
const express = require("express");
const cors = require('cors');
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => console.log(`Server was started on ${PORT}`));