const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://udoigweprince_db_user:Wj31snHVYcFMCn49@cluster0.pd6mgwu.mongodb.net/').then(() => {
    console.log('Connected to Database');
})
.catch((error) => {
    console.log('Error connecting to database', error.message);
})