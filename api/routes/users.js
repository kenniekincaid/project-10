const express = require('express');
const router = express.Router();
const { User } = require('../models'); 
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./authentication');
const { check, validationResult } = require('express-validator');

//ROUTE 1 of 2: Send a GET request to /users to return the currently authenticated user
router.get('/', authenticateUser, (req, res, next) => {
    return res.status(200).json({    
    userId: req.currentUser.get("id"),
    firstName: req.currentUser.get("firstName"),
    lastName: req.currentUser.get("lastName"),
    emailAddress: req.currentUser.get("emailAddress")
  });
});

//ROUTE 2 of 2: Send a POST request to /users to CREATE a new user, sets the Location header to "/", and returns no content 
router.post('/', [
  // Validations
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provide a valid email address for "email"'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please provide a "password" that is between 8 and 20 characters in length')
], async (req, res, next)=>{
    // Get the validation result from Request object.
    const errors = validationResult(req);
  // If validation errors exist...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    
    // Return validation errors to the client.
    const err = new Error(errorMessages);
    err.status = 400;
    next(err);   
  }else{
    const user = new User ({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "emailAddress": req.body.emailAddress,
      "password": bcryptjs.hashSync(req.body.password)
      })
  
    try {
      await user.save();
      res.location('/');
      // Set the status to 201 Created and end the response.
      res.status(201).end();
    } catch (err) {
      if(err.name === 'SequelizeValidationError') {
        res.status(400).json({message: "Please complete all required fields"});
        next();
      } else {
        res.status(400).json({message: 'This email already exists. Please log in or Try Again!'});
      }
    }
  }
  
});
module.exports = router;