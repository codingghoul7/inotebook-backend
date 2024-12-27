const connectDB = require('./database');
connectDB();
const express = require('express');
const app = express();
const port = 6000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Avaliable Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
