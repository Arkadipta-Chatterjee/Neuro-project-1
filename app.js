const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


const DB = require('./config.js');



// const DB = require('./config.js');

const port = DB.PORT;
const url = DB.url;

var db = mongoose.connection;

mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,

}).then(() => console.log('DB connection successful'));



let app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Neuro-project-1')));
app.use(bodyParser.urlencoded({
    extended: true
}));



app.post('/SIGN_UP', async (req, res) => {

    try {
        const data = await model.create(req.body);
        if (data.veremail !== data.email) {
            res.status(201).json({
                status: 'Successfully signed up!Keep a watch on your registered email id and phone number for further updates!',
                data: data

            })
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Verification email and entered email does not match'
            })
        }

    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'Connection error!Try again'
        })

    }

    //     let name = req.body.name;
    //     let password = req.body.password;
    //     let email = req.body.email;
    //     let veremail = req.body.veremail;
    //     let phone = req.body.phone;

    //     let data = {
    //         "name": name,
    //         "password": password,
    //         "email": email,
    //         "Verification email": veremail,
    //         "Phone number": phone
    //     }

    //     if (email !== veremail) {
    //         res.status(400).json({
    //             status: 'failed',
    //             message: 'Verification email does not match!'

    //         })
    //     } else {

    //         db.collection('Neuro-project-1').insertOne(data, (err, collection) => {
    //             if (err) {
    //                 res.status(400).json({
    //                     status: 'Failed',
    //                     message: 'Error in connection'
    //                 })
    //             } else {
    //                 res.status(200).json({
    //                     status: 'Success',
    //                     message: 'Data registered.Keep a watch at your email and phone number for updates!'
    //                 })
    //             }
    //         })


    //     }
    // })

})
app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
})
