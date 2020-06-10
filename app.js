const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const validator = require('email-validator');

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

const model = require('./model');



app.post('/SIGN_UP', async (req, res) => {

    try {
        const data = await model.create(req.body);
        if (validator.validate(data.email)) {
            res.status(201).json({
                status: 'Successfully signed up!Keep a watch on your registered email id and phone number for further updates!',
                data: data



            })
            let smtpTransport = nodemailer.createTransport("SMTP", {
                service: "Gmail",
                auth: {
                    user: `${data.email}`,
                    password: `${data.password}`

                }
            })

            app.get('/send', function (req, res) {
                rand = Math.floor((Math.random() * 100) + 54);
                host = req.get('host');
                link = "http://" + req.get('host') + "/verify?id=" + rand;
                mailOptions = {
                    to: req.query.to,
                    subject: "Please confirm your Email account",
                    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end("error");
                    } else {
                        console.log("Message sent: " + response.message);
                        res.end("sent");
                    }
                });
            });

            app.get('/verify', function (req, res) {
                console.log(req.protocol + ":/" + req.get('host'));
                if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
                    console.log("Domain is matched. Information is from Authentic email");
                    if (req.query.id == rand) {
                        console.log("email is verified");
                        res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
                    } else {
                        console.log("email is not verified");
                        res.end("<h1>Bad Request</h1>");
                    }
                } else {
                    res.end("<h1>Request is from unknown source");
                }
            });
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Email id is not valid'
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
