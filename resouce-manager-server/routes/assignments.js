// routes/assignments.js
const express = require('express');
const router = express.Router();

const {
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignmentController');
const { protect, isManager } = require('../middleware/authMiddleware');


router.post('/',protect,isManager, createAssignment);
router.put('/:id',protect,isManager, updateAssignment);
router.delete('/:id',protect,isManager, deleteAssignment);

module.exports = router;
