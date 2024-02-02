const express = require("express");
const routes = express();
const { shiftValidator } = require("../middleware/validation");
const ShiftController = require("../controller/shiftController")


routes.post("/create",shiftValidator.create,ShiftController.create);
routes.get("/view",ShiftController.viewOneByShiftID);
routes.get("/view-all",ShiftController.view);
routes.get("/get/:Id",ShiftController.viewOneByAssignee);
routes.delete("/delete",ShiftController.delete);
routes.get("/search",shiftValidator.searchShifts,ShiftController.searchShifts);


module.exports = routes;