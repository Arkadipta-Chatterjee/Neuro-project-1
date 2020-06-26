const jwt = require('jsonwebtoken');
const User = require('./model.js');
const config = require('./config.js');
const AppError = require('./AppError.js');
const catchAsync = require('./catchAsync.js');
const Email = require('./email.js');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({
        id
    }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 50000 * 24 * 60 * 60 * 1000)
    }
    httpOnly: true
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phone: req.body.phone
    })

    const url = `${req.protocol}://${req.get('host')}/me`;
    console.log(url);

    await new Email(newUser, url).sendConfirmationEmail();

    createSendToken(newUser, 201, res);
    res.send('Finish the sign up process by clicking on the link in the email sent to the registered email Id');

});

exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: 'fail',
            message: 'Please provide both email and password!'
        })
        console.log('Error!Email or Password Missing!');
    } else {



        const user = await User.findOne({
            email: email
        }).select('+password')




        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect Email or Password', 401))
        }

        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token
        })


    }
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        res.status(404).json({
            message: 'There is no user with the given email'
        })
    } else {
        const resetToken = user.createPasswordResetToken();
        await user.save({
            validateBeforeSave: false
        });
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;



        try {


            await new Email(user, resetURL).sendresetPassword()
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            })

        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({
                validateBeforeSave: false
            });

            res.status(500).send('There was an error sending the email!Try again later');
        }

    }



})
exports.resetPassword = catchAsync(async (req, res, next) => {

    //1)Get User based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    })



    //2)If token has not expired,and there is user,set the new password!)
    if (!user)
        return res.status(400).json({
            message: 'Token is Invalid or has expired'
        })
    else {
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();


        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token
        })


    }


    //3)Update changePassword At property of the user


    //4)Log the user in,send JWT
})
