    const express = require('express');
    const router = express.Router();
    const { updateUser } = require('../controllers/userController');
    const { protect } = require('../middleware/authMiddleware');
    const { updateUser, updateUserAdmin } = require('../controllers/userController');

    // PUT /api/users/:id
    // This route is protected, meaning a user must be logged in.
    router.put('/admin/:id', protect, isManager, updateUserAdmin);
    router.put('/:id', protect, updateUser);
    module.exports = router;
   
    
