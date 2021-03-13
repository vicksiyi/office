const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');

//引入users
const mini = require('./routes/api/mini');
const user = require('./routes/auth/user');

// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect
mongoose.connect(db)
    .then(() => {
        console.log('成功');
    })
    .catch((err) => {
        console.log(err);
    })

// passport初始化
app.use(passport.initialize());
require('./config/userPassport')(passport);


//使用routes
app.use('/api/mini', mini);
app.use('/auth/user', user);

app.listen(5000, () => {
    console.log('the port running');
})
