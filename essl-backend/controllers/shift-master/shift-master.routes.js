const express=require("express");
const ulpoad=require('../upload/upload')

const router=express.Router();

const {createShift,getAllShifts}=require('../shift-master/shift-master.controller')

router.post('/createShift',createShift);

router.get('/allShifts',getAllShifts)
module.exports=router;