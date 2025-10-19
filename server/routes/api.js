
// //COmmon JS
// const express = require('express');
// const router = express.Router();
// const EmployeeController = require('../controllers/EmployeeController')

// module.exports=router; // iexport si router


//ES MODULE
import { Router} from 'express';
const router =Router();
import EmployeeController from '../controllers/EmployeeController.js'; //import the EmployeeController
import DepartmentController from "../controllers/DepartmentController.js";
import SectionController from "../controllers/SectionController.js";
import TeamController from "../controllers/TeamController.js";

router.route('/employees') // router.route
    .get(EmployeeController.getEmployees)
    .post(EmployeeController.insertEmployee)
router.put('/employees/:id', EmployeeController.updateEmployee)
router.delete('/employees', EmployeeController.deleteEmployee)
router.patch('/employees', EmployeeController.restoreEmployee)
    
    
router.get('/departments', DepartmentController.getDepartments)
router.post('/departments', DepartmentController.insertDepartment)
router.put('/departments/:id', DepartmentController.updateDepartment)
router.delete('/departments/:id', DepartmentController.deleteDepartment)
router.patch('/departments', DepartmentController.restoreDepartment)


router.get('/sections', SectionController.getSections)
router.post('/sections', SectionController.insertSections)
router.put('/sections/:id',SectionController.updateSections)
router.delete('/sections/:id',SectionController.deleteSections)
router.patch('/sections',SectionController.restoreSections)


router.get('/teams', TeamController.getTeams)
router.post('/teams', TeamController.insertTeam)
router.put('/teams/:id', TeamController.updateTeam)
router.delete('/teams/:id', TeamController.deleteTeam)
router.patch('/teams', TeamController.restoreTeam)

    
    
export default router;