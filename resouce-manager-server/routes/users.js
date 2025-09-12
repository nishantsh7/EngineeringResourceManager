    const express = require('express');
    const router = express.Router();
    const { updateUser } = require('../controllers/userController');
    const { protect } = require('../middleware/authMiddleware');

    // PUT /api/users/:id
    // This route is protected, meaning a user must be logged in.
    router.put('/:id', protect, updateUser);
    module.exports = router;
   
    
