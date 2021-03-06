/** ***********************************************************************
 * Execution        : 1. default node       cmd> nodemon server.js
 *
 * Purpose          : To hit the perticular API 

 * @file            : user.js
 * @author          : Pranil Kakade
 * @version         : 1.0
 * @since           : 06-06-2021
 ************************************************************************* */
const joi = require('@hapi/joi');
const helper = require('../../utility/helper');
const userService = require('../services/user');

const requestValidationSchema = joi.object({
  firstName: joi.string().min(3).max(10).pattern(new RegExp('^[A-Z]{1}[a-z]{2,}$')).message('First letter Should be capital For first name').required(),
  lastName: joi.string().min(3).max(10).pattern(new RegExp('^[A-Z]{1}[a-z]{2,}$')).message('First letter Should be capital For last name').required(),
  email: joi.string().email().message('Email Should Be in Proper Manner').required(),
  password: joi.string().required(),
  role: joi.string().required(),
});

class UserController {
   /**
   * @description add user/admin to database
   * @param {*} req in json formate
   * @param {*} res sends response from server
   */
  userRegister = (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        return res.status(400).send({
            success: false,
            message: "Fileds Cannot Be Empty...!!!",
        });
    }
    const result = requestValidationSchema.validate(req.data);
    if (result.error){
        return res.send('Enter the Valid Data..!');
    }

    const userDetails = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.role,
    };
    userService.userRegister(userDetails, (err, userResult) => {
        err
           ? res.status(401).send({
            success: false,
            message: err.message,
           })
           : res.status(200).send({
               success: true,
               message: 'Data Inserted Successfully..!',
               data: userResult,
           });
    });
  };

   /**
   * @description Login With User/Admin Credential
   * @param {*} req in json formate
   * @param {*} res sends response from server
   */
  login = (req, res) => {
    const loginData = {
      email: req.body.email,
      password: req.body.password,
      role: req.role,
    };
    userService.login(loginData, (err, loginResult) => {
      err 
        ? res.status(401).send({
          success: false,
          message: 'Login Failed...!',
          error: err,
         })
        : (
          req.role !== 'user'
          ? res.status(200).send({
            success: true,
            message: 'Login Admin Successfully..!',
            Token: helper.createToken(loginResult),
        }) 
         : res.status(200).send({
             success: true,
             message: 'Login User Successfully..!',
             Token: helper.createToken(loginResult),
         })
        )
    });
  };

  /**
   * @description Send Reset Password Link To EmailID
   * @param {*} req in json formate
   * @param {*} res sends response from server
   */
  forgotPassword = (req, res) => {
    const forgotPass = {
      email: req.body.email,
    };
    userService.forgotPassword(forgotPass, (err, result) => {
      err 
        ? res.status(401).send({
          success: false,
          message: 'Failed To Send An Email...!',
          err,
        })
        : res.status(200).send({
          success: true,
          message: 'Reset Link Sent On Register Email Id...Successully...!!!',
          data: result,
        });
    });
  };

   /**
   * @description Reset Password 
   * @param {*} req in json formate
   * @param {*} res sends response from server
   */
  resetPassword = (req, res) => {
    const userInfo = {
      newPassword: req.body.newPassword,
      email: req.userData.email,
    };
    userService.resetPassword(userInfo, (err, result) => {
      err
        ? res.status(401).send({
              success: false,
              message: 'Failed To Reset Password',
              err,
          })
        : res.status(200).send({
              success: true,
              message: 'Reset Password Successfully....!!! ',
              data: result     
          })
    });
  };
};

module.exports = new UserController();
