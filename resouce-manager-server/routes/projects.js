// routes/projects.js
const express = require('express');
const router = express.Router();

// Import controller functions
const { 
    getAllProjects, 
    createProject, 
    updateProject, 
    deleteProject 
} = require('../controllers/projectController');

const { protect, isManager } = require('../middleware/authMiddleware');

router.get('/',protect,getAllProjects);
router.post('/',protect,isManager, createProject);
router.put('/:id',protect,isManager, updateProject);
router.delete('/:id',protect,isManager, deleteProject);

module.exports = router;
