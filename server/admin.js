const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
//引入users
const admin = require('./routes/admin/service');
const video = require('./routes/admin/video');
const user = require('./routes/admin/user');
const loginLog = require('./routes/admin/loginLog');
const notice = require('./routes/admin/notice');

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
require('./config/adminPassport')(passport);

//使用routes
app.use('/admin/service', admin);
app.use('/admin/video', video);
app.use('/admin/user', user);
app.use('/admin/loginLog', loginLog);
app.use('/admin/notice', notice);

app.listen(5001, () => {
    console.log('the port running');
})
