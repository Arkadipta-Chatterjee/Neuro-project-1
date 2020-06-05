const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

require('dotenv').config();
const config = require('./config.env');



const DB = require('./config.js');

const port = DB.PORT;
const url = DB.url;

mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => console.log('DB connection successful'));



let app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Neuro-project-1')));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.post('/SIGN_UP', (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;
    let veremail = req.body.veremail;
    let phone = req.body.phone;

    let data = {
        "name": name,
        "password": password,
        "email": email,
        "Verification email": veremail,
        "Phone number": phone
    }

    if (email !== veremail) {
        res.status(400).json({
            status: 'failed',
            message: 'Verification email does not match!'

        })
    } else {

        db.collection('Neuro-project-1').insertOne(data, (err, collection) => {
            if (err) {
                res.status(400).json({
                    status: 'Failed',
                    message: 'Error in connection'
                })
            } else {
                res.status(200).json({
                    status: 'Success',
                    message: 'Data registered.Keep a watch at your email and phone number for updates!'
                })
            }
        })


    }
})
app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
});
