const baseController = require("./baseController");
const Vehicle = require("../../models/vehicleModel");

class adminVehicleController extends baseController {
  constructor() {
    super(Vehicle, "vehicles", "vehicle"); // Truyền model, pluralKey, singularKey
  }

  // Override các phương thức nếu cần
}

module.exports = new adminVehicleController();
