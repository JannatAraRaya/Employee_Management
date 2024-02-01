const express = require("express");
const routes = express();
const ShiftController = require("../controller/shiftController")


routes.post("/create",ShiftController.create);
routes.get("/view",ShiftController.viewOneByShiftID);
routes.get("/view-all",ShiftController.view);
routes.get("/get/:Id",ShiftController.viewOneByAssignee);
routes.delete("/delete",ShiftController.delete);


module.exports = routes;