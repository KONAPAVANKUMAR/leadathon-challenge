const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');


// middle wares
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/', require('./routes/chess'));

// start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
})