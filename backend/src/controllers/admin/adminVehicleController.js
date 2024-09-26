// const baseController = require("./baseController");
// const vehicle = require("../../models/vehicleModel");

// class adminVehicleController extends baseController {
//   constructor() {
//     super(vehicle); // Truyền model Vehicle vào BaseController
//   }
// }

// module.exports = new adminVehicleController();
// controllers/admin/adminVehicleController.js
const baseController = require("./baseController");
const Vehicle = require("../../models/vehicleModel");

class adminVehicleController extends baseController {
  constructor() {
    super(Vehicle, "vehicles", "vehicle"); // Truyền model, pluralKey, singularKey
  }

  // Override các phương thức nếu cần
}

module.exports = new adminVehicleController();
