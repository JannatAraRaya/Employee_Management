const { sendResponse } = require("../utils/responseHandler");
const { validationResult } = require("express-validator");
const moment = require("moment");
const HTTP_STATUS = require("../constants/http_codes");
const ShiftService = require("../service/shiftService");

class ShiftController {
  static async create(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to add the shift!",
          validation
        );
      }
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
  static async viewOneByShiftID(req, res) {
    try {
      const { shiftId } = req.body;
      const shift = await ShiftService.getShiftById(shiftId);
      return sendResponse(res, HTTP_STATUS.OK, "Got it", shift);
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  static async view(req, res) {
    try {
      const shifts = await ShiftService.getAllShift();
      return sendResponse(res, HTTP_STATUS.OK, "Got it", shifts);
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  static async viewOneByAssignee(req, res) {
    try {
      const { Id } = req.params;
      const shift = await ShiftService.getShiftsByAssignee(Id);
      return sendResponse(res, HTTP_STATUS.OK, "Got it", shift);
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Internal server error"
      );
    }
  }
  static async delete(req, res) {
    try {
      const { shiftId } = req.body;
      const deleteShift = await ShiftService.deleteById(shiftId);
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Shift deleted Successfully",
        deleteShift
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
  static async searchShifts(req, res) {
    try {
      const validation = validationResult(req).array();
      if (validation.length > 0) {
        return sendResponse(
          res,
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          "Failed to query!",
          validation
        );
      }
      const { startDate, endDate, startTime, endTime } = req.query;

      const page = Number(req.query.page);
      const shiftLimit = Number(req.query.limit);

      const result = await ShiftService.search(        
        startDate,
        endDate,
        startTime,
        endTime,
        page,
        shiftLimit
      );
      return sendResponse(
        res,
        HTTP_STATUS.OK,
        "Successfully received the shifts!",
        result
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to search shifts."
      );
    }
  }
}

module.exports = ShiftController;
