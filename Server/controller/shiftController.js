const { sendResponse } = require("../utils/responseHandler");

const moment = require("moment");
const HTTP_STATUS = require("../constants/http_codes");
const ShiftService = require("../service/shiftService");

class ShiftController {
  async create(req, res) {
    try {
      let { date, startTime, endTime, assigneedTo } = req.body;
      const jwtToken = req.headers.authorization.split(" ")[1];
      startTime = moment(startTime, "h:mm A").format("HH:mm");
      endTime = moment(endTime, "h:mm A").format("HH:mm");

      const shiftCreate = await ShiftService.create(
        date,
        startTime,
        endTime,
        assigneedTo,
        jwtToken
      );

      if (shiftCreate.error) {
        return sendResponse(res, HTTP_STATUS.BAD_REQUEST, shiftCreate.error);
      }
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Shift Created Successfully!",
        shiftCreate
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  async viewOneByShiftID(req, res) {
    try {
      const {shiftId}=req.body;
      const shift = await ShiftService.getShiftById(shiftId);
      return sendResponse(res,HTTP_STATUS.OK,"Got it",shift)
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  async view(req, res) {
    try {
      const shifts = await ShiftService.getAllShift();
      return sendResponse(res,HTTP_STATUS.OK,"Got it",shifts)
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  async viewOneByAssignee(req, res) {
    try {
      const {Id}=req.params;
      const shift = await ShiftService.getShiftsByAssignee(Id);
      return sendResponse(res,HTTP_STATUS.OK,"Got it",shift)
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  async delete(req,res){
    try {
      const {shiftId} =req.body;
      const deleteShift = await ShiftService.deleteById(shiftId);
      return sendResponse(res,HTTP_STATUS.OK,"Shift deleted Successfully",deleteShift)
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
}

module.exports = new ShiftController();
