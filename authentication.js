const jwt = require('jsonwebtoken');
const User = require('./model.js');
const config = require('./config.js');
const AppError = require('./AppError.js');
const catchAsync = require('./catchAsync.js');

const signToken = id => {
    return jwt.sign({
        id
    }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phone: req.body.phone
    })

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'Success!',
        token,
        data: {
            user: newUser
        }
    })

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
    }

})
exports.resetPassword = (req, res, next) => {}
