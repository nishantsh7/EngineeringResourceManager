    const express = require('express');
    const router = express.Router();
    const { updateUser,updateUserAdmin } = require('../controllers/userController');
    const { protect, isManager} = require('../middleware/authMiddleware');
    
   

    // PUT /api/users/:id
    
    router.put('/admin/:id', protect, isManager, updateUserAdmin);
    router.put('/:id', protect, updateUser);
    module.exports = router;
   
    
