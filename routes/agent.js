const express = require('express');
const router = express.Router();
const agentController = require('../controller/agentController');

// Register Page
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/create', agentController.create);

// logout
router.get ('/logout',agentController.logout);

module.exports = router;
