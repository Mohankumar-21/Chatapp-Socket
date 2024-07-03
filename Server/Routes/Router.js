
const express = require('express');
const Register = require('../Controller/Register');
const Login = require('../Controller/Login');
const GetUserById = require('../Controller/GetUserByID');


const router = express();

//Register 

router.post('/register', Register);
router.post('/login', Login);
router.get('/:userId', GetUserById);


module.exports = router;