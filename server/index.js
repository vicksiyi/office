const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const keys = require('./config/keys');
const passport = require('passport');

//引入users
const mini = require('./routes/api/mini');
const user = require('./routes/auth/user');
const video = require('./routes/send/video');
const modify = require('./routes/user/modify');
const focus = require('./routes/user/focus');
const collection = require('./routes/user/collection');
const good = require('./routes/user/good');
const share = require('./routes/user/share');
const exam = require('./routes/exam/exam');
const customer = require('./routes/customer/service');
const notice = require('./routes/user/notice');
const complaint = require('./routes/complaint/service');
const news = require('./routes/news/service');

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
app.use('/send/video', video);
app.use('/user/modify', modify);
app.use('/user/focus', focus);
app.use('/user/collection', collection);
app.use('/user/good', good);
app.use('/user/share', share);
app.use('/user/notice', notice);
app.use('/exam/exam', exam);
app.use('/customer/service', customer);
app.use('/complaint/service', complaint);
app.use('/news/service', news);

app.listen(5000, () => {
    console.log('the port running');
})
