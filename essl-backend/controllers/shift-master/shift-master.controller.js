const ShiftMaster = require('../shift-master/shift-master')

exports.createShift = async (req, res) => {
    try {
        const {  Shift_StartTime, Shift_EndTime, Is_Approved, Approved_By, Is_Active } = req.body;
        // console.log(shiftId)
        if (Shift_StartTime >= Shift_EndTime) {
            return res.status(400).json({
                msg: "End time must be after start time"
            });

        }
        const lastRecord = await ShiftMaster.findOne({
            order: [['Shift_ID', 'DESC']] // Get the highest RM_ID
        });
        const newShiftID = lastRecord ? lastRecord.Shift_ID + 1 : 1; 
        console.log(newShiftID)
        const newShift = await ShiftMaster.create({
Shift_ID:newShiftID,
            Shift_StartTime,
            Shift_EndTime,
            Is_Approved: Is_Approved ?? true,
            Approved_By,

            Is_Active: Is_Active ?? true,
        });
        console.log(newShift)
        return res.status(201).json(newShift);
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
};
exports.getAllShifts=async(req,res)=>{
    try {
        const AllShits=await ShiftMaster.findAll();
        return res.status(200).json(AllShits);
    } catch (error) {
        return res.status(500).json({
            error:error
        })
    }
};