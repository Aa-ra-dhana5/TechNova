import joi from 'joi';


exports.signupValidation = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
});

exports.loginValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});