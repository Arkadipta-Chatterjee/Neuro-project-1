const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const smtpTransportmodule = require('nodemailer-smtp-transport');

const mongoose = require('mongoose');

const Upvote = require('./upvote.js');
const Downvote = require('./downvote.js');
const Question = require('./post.js');

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
const authController = require('./authentication');

const router = express.Router();


app.post('/signup', authController.signup);
app.post('/login', authController.login);

app.post('/forgotPassword', authController.forgotPassword);
app.post('/resetPassword', authController.resetPassword);



// app.post('/SIGN_UP', async (req, res) => {
//     var token = req.body.stripeToken;

//     try {
//         const data = await model.create(req.body);
//         db.collection('Neuro-project-1').insertOne(data, (err, collection) => {
//             if (err) {
//                 res.status(400).json({
//                     status: 'Failed',
//                     message: 'Error in connection'
//                 })
//             } else {



//                 if (validator.validate(data.email)) {

//                     res.status(201).json({
//                         status: 'Successfully signed up!Keep a watch on your registered email id and phone number for further updates!',
//                         data: data



//                     })
//                     let smtpTransport = nodemailer.createTransport({
//                         service: "Gmail",


//                         auth: {
//                             user: 'arkadiptachatterjee@gmail.com',
//                             pass: '8927604667'

//                         }
//                     })
//                     let rand, mailOptions, host, link;
//                     app.get('/SEND', function (req, res) {
//                         rand = Math.floor((Math.random() * 100) + 54);
//                         host = req.get('host');
//                         link = "http://" + req.get('host') + "/verify?id=" + rand;
//                         mailOptions = {
//                             from: "arkadiptachatterjee@gmail.com",
//                             to: data.email,
//                             subject: "Please confirm your Email account",
//                             html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
//                         }
//                         console.log(mailOptions);
//                         smtpTransport.sendMail(mailOptions, function (error, res) {
//                             if (error) {
//                                 console.log(error);
//                                 res.end("error");
//                             } else {
//                                 console.log("Message sent: " + res.message);

//                                 res.end("sent");
//                             }
//                         });
//                     });

//                     app.get('/VERIFY', function (req, res) {
//                         console.log(req.protocol + ":/" + req.get('host'));
//                         if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
//                             console.log("Domain is matched. Information is from Authentic email");
//                             if (req.query.id == rand) {
//                                 console.log("email is verified");
//                                 res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
//                             } else {
//                                 console.log("email is not verified");
//                                 res.end("<h1>Bad Request</h1>");
//                             }
//                         } else {
//                             res.end("<h1>Request is from unknown source");
//                         }
//                     });
//                 } else {
//                     res.status(400).json({
//                         status: 'failed',
//                         message: 'Email id is not valid'
//                     })
//                 }
//             }

//         })


//     } catch (err) {
//         res.status(404).json({
//             status: 'failed',
//             message: 'Connection error!Try again'
//         })

//     }
// })

// app.post('/reset-password', (req, res) => {

//     db.collection('Neuro-project-1')
//         .findOne({
//             where: {
//                 email: req.body.email
//             }, //checking if the email address sent by client is present in the db(valid)
//         })
//         .then((user) => {
//             if (!user) {
//                 return console.log('No user found with that email address.')
//             }
//             db.collection('Neuro-project-1')
//                 .findOne({
//                     where: {
//                         userId: req.body._id,
//                         status: 0
//                     },
//                 }).then((resetPassword) => {
//                     if (resetPassword)
//                         resetPassword.destroy({
//                             where: {
//                                 id: resetPassword.id
//                             }
//                         })

//                     let smtpTransport = nodemailer.createTransport({
//                         service: "Gmail",


//                         auth: {
//                             user: 'arkadiptachatterjee@gmail.com',
//                             pass: '8927604667'

//                         }
//                     })
//                     token = crypto.randomBytes(32).toString('hex') //creating the token to be sent to the forgot password form (react)
//                     bcrypt.hash(token, null, null, (err, hash) => { //hashing the password to store in the db node.js
//                         ResetPassword.create({
//                             userId: req.body._id,
//                             resetPasswordToken: hash,
//                             expire: moment.utc().add(config.tokenExpiry, 'seconds'),
//                         }).then((item) => {
//                             if (!item)
//                                 return (res, 'Oops problem in creating new password record')
//                             let mailOptions = {
//                                 from: 'arkadiptachatterjee@gmail.com',
//                                 to: req.body.email,
//                                 subject: 'Reset your account password',
//                                 html: '<h4><b>Reset Password</b></h4>' +
//                                     '<p>To reset your password, complete this form:</p>' +
//                                     '<a href=' + config.clientUrl + 'reset/' + userId + '/' + token + '">' + config.clientUrl + 'reset/' + user.id + '/' + token + '</a>' +
//                                     '<br><br>' +
//                                     '<p>--Team</p>'
//                             }
//                             smtpTransport.sendMail(mailOptions, function (error, res) {
//                                 if (error) {
//                                     console.log(error);
//                                     res.end("error");
//                                 } else {
//                                     console.log("Message sent: " + res.message);

//                                     res.end("sent");
//                                 }
//                             });
//                         })
//                     })
//                 });
//         })
// })

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

// app.post('/upvote', (req, res) => {

//     Upvote.findOne({
//             questionid: req.body.params.questionid
//         })
//         .then(oneVote => {

//             if (oneVote.votes.filter(user => req.body.params.userid).length === 1) {

//                 Question.updateOne({
//                         _id: req.body.params.questionid
//                     }, {
//                         $inc: {
//                             voteCount: -1
//                         }
//                     })
//                     .then(() => {

//                         Upvote.updateOne({
//                                 questionid: req.body.params.questionid,
//                             }, {
//                                 $pull: {
//                                     votes: {
//                                         user: ObjectId(req.body.params.userid)
//                                     }
//                                 }
//                             })
//                             .then(() => console.log('decrement by -1'))
//                     })
//                     .catch(err => console.log(err))
//             } else if (oneVote.votes.filter(user => req.body.params.userid).length === 0) {

//                 Upvote.findOneAndUpdate({
//                         questionid: req.body.params.questionid,
//                         'votes.user': {
//                             $ne: ObjectId(req.body.params.userid)
//                         }
//                     }, {
//                         $push: {
//                             votes: {
//                                 user: ObjectId(req.body.params.userid)
//                             }
//                         }
//                     }, {
//                         useFindAndModify: false
//                     })
//                     .then(oldupvote => {
//                         Downvote.findOne({
//                                 questionid: req.body.params.questionid
//                             })
//                             .then(downvote => {
//                                 if (downvote.votes.filter(user => req.body.params.userid).length > 0) {


//                                     Downvote.updateOne({
//                                             questionid: req.body.params.questionid,
//                                         }, {
//                                             $pull: {
//                                                 votes: {
//                                                     user: ObjectId(req.body.params.userid)
//                                                 }
//                                             }
//                                         })
//                                         .then(() => {
//                                             Question.updateOne({
//                                                     _id: req.body.params.questionid
//                                                 }, {
//                                                     $inc: {
//                                                         voteCount: 2
//                                                     }
//                                                 })
//                                                 .then(() => console.log('increment by 2'))
//                                                 .catch(err => console.log(err))
//                                         })
//                                         .catch(err => console.log(err))


//                                 } else {
//                                     Question.updateOne({
//                                             _id: req.body.params.questionid
//                                         }, {
//                                             $inc: {
//                                                 voteCount: 1
//                                             }
//                                         })
//                                         .then(() => console.log('increment by 1'))
//                                         .catch(err => console.log(err))
//                                 }
//                             })
//                             .catch(err => console.log(err))

//                     })
//             }

//         })
//         .catch(err => console.log(err))
// })

// app.post('/downvote', (req, res) => {


//     Downvote.findOne({
//             questionid: req.body.params.questionid
//         })
//         .then(oneVote => {
//             if (oneVote.votes.filter(user => req.body.params.userid).length === 1) {
//                 Question.updateOne({
//                         _id: req.body.params.questionid
//                     }, {
//                         $inc: {
//                             voteCount: 1
//                         }
//                     })
//                     .then(() => {
//                         Downvote.updateOne({
//                                 questionid: req.body.params.questionid,
//                             }, {
//                                 $pull: {
//                                     votes: {
//                                         user: ObjectId(req.body.params.userid)
//                                     }
//                                 }
//                             })
//                             .then(() => console.log('increment by 1'))
//                             .catch(err => console.log(err))

//                     })
//                     .catch(err => console.log(err))
//             } else if (oneVote.votes.filter(user => req.body.params.userid).length === 0) {
//                 Downvote.findOneAndUpdate({
//                         questionid: req.body.params.questionid,
//                         'votes.user': {
//                             $ne: ObjectId(req.body.params.userid)
//                         }
//                     }, {
//                         $push: {
//                             votes: {
//                                 user: ObjectId(req.body.params.userid)
//                             }
//                         }
//                     }, {
//                         useFindAndModify: false
//                     })
//                     .then(oldownvote => {
//                         Upvote.findOne({
//                                 questionid: req.body.params.questionid
//                             })
//                             .then(upvote => {
//                                 if (upvote.votes.filter(user => req.body.params.userid).length > 0) {
//                                     Upvote.updateOne({
//                                             questionid: req.body.params.questionid,
//                                         }, {
//                                             $pull: {
//                                                 votes: {
//                                                     user: ObjectId(req.body.params.userid)
//                                                 }
//                                             }
//                                         })
//                                         .then(() => {
//                                             Question.updateOne({
//                                                     _id: req.body.params.questionid
//                                                 }, {
//                                                     $inc: {
//                                                         voteCount: -2
//                                                     }
//                                                 })
//                                                 .then(() => console.log('decrement by -2'))

//                                         })
//                                         .catch(err => console.log(err))
//                                 } else {
//                                     Question.updateOne({
//                                             _id: req.body.params.questionid
//                                         }, {
//                                             $inc: {
//                                                 voteCount: -1
//                                             }
//                                         })
//                                         .then(() => console.log('decrement by -1'))
//                                         .catch(err => console.log(err))
//                                 }
//                             })
//                             .catch(err => console.log(err))

//                     })
//                     // .then(() => {
//                     //     Upvote.findOne({ questionid: req.body.params.questionid })
//                     //         .then(updatedupvote => console.log(updatedupvote))
//                     // })
//                     .catch(err => console.log(err))

//             }

//         })
//         .catch(err => console.log(err))



// })



app.listen(port, () => {
    console.log(`App is listening to port:${port}`);
})
