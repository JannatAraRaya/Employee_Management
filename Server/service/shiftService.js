const jsonwebtoken = require("jsonwebtoken");
const ShiftModel = require("../model/shiftModel");
const UserModel = require("../model/userModel");

class ShiftService {
  async create(date, startTime, endTime, assigneedTo, jwtToken) {
    const decodedToken = jsonwebtoken.decode(jwtToken);
    console.log(decodedToken.user._id);
    const assignedBy = decodedToken.user._id;
    // Fetching the assignee's ID from the user model
    const assigneedToID = await UserModel.findOne({
      employeeId: assigneedTo,
    });

    assigneedTo = assigneedToID._id;
    // Schedule overlap check
    const overlappingShift = await ShiftModel.find({
      assigneedTo: assigneedTo,
      date: date,
      $or: [
        {
          $and: [
            { startTime: { $lte: startTime } },
            { endTime: { $gte: startTime } },
          ],
        },
        {
          $and: [
            { startTime: { $lte: endTime } },
            { endTime: { $gte: endTime } },
          ],
        },
        {
          $and: [
            { startTime: { $gte: startTime } },
            { endTime: { $lte: endTime } },
          ],
        },
      ],
    });
    console.log(overlappingShift);
    if (overlappingShift.length > 0) {
      return { error: "Oh no! Shift overlapped, change the schedule." };
    }

    // Creating the shift, if not overlapped
    const shift = await ShiftModel.create({
      date: date,
      startTime: startTime,
      endTime: endTime,
      assigneedTo: assigneedTo,
      assigneedBy: assignedBy,
    });

    if (!shift) {
      return { error: "Shift did not created..." };
    }

    const updateEmployeeData = await UserModel.findByIdAndUpdate(
      assigneedToID._id,
      { $addToSet: { ShiftAssigneed: shift._id } },
      { new: true }
    );

    if (!updateEmployeeData) {
      return { error: "Failed to update to the assignings data..." };
    }

    // Updating the Assigners' Data
    const updateAssignerData = await UserModel.findByIdAndUpdate(
      assignedBy,
      { $addToSet: { ShiftAssigner: shift._id } },
      { new: true }
    );

    if (!updateAssignerData) {
      return { error: "Failed to update to the assigner data..." };
    }

    return shift;
  }
  async getShiftById(shiftId) {
    const shift = await ShiftModel.findById({ _id: shiftId })
      .populate("assigneedTo", "-_id employeeId username email")
      .populate("assigneedBy", "-_id employeeId username email");

    return shift;
  }
  async getAllShift() {
    const shift = await ShiftModel.find({})
      .populate("assigneedTo", "-_id employeeId username email")
      .populate("assigneedBy", "-_id employeeId username email");
    console.log(shift);
    return shift;
  }
  async getShiftsByAssignee(assigneeId) {
    try {
      const shifts = await ShiftModel.find({ assigneedTo: assigneeId }).select(
        "date startTime endTime assigneedBy"
      );
    
      console.log(shifts);
      return { success: true, shifts};
    } catch (error) {
      console.error("Error viewing shifts by assignee:", error);
      return { error: "Failed to view shifts by assignee." };
    }
  }

  async deleteById(shiftId) {

    const shift = await ShiftModel.findById(shiftId);
    console.log(shift.assigneedTo)

      if (!shift) {
        return { error: "Shift not found." };
      }
      const updateAssigneeData = await UserModel.findByIdAndUpdate(
       shift.assigneedTo ,
        { $pull: { ShiftAssigneed: shiftId } },
        { new: true }
      );

      if (!updateAssigneeData) {
        return { error: "Failed to update assignee's data." };
      }

      const updateAssignerData = await UserModel.findByIdAndUpdate(
        shift.assigneedBy,
        { $pull: { ShiftAssigner: shiftId } },
        { new: true }
      );

      if (!updateAssignerData) {
        return { error: "Failed to update assigner's data." };
      }
      await ShiftModel.findByIdAndDelete(shiftId);

      return { success: true, message: "Shift deleted successfully." };
  }
}

module.exports = new ShiftService();
