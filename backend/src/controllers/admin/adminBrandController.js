// const baseController = require("./baseController");
// const brand = require("../../models/brandModel");
// class adminBrandController extends baseController {
//   constructor() {
//     super(brand); // Truyền model Brand vào BaseController
//   }
// }

// module.exports = new adminBrandController();
// controllers/admin/adminBrandController.js
const baseController = require("./baseController");
const Brand = require("../../models/brandModel");

class adminBrandController extends baseController {
  constructor() {
    super(Brand, "brands", "brand"); // Truyền model, pluralKey, singularKey
  }

  // Nếu cần, bạn có thể override thêm các phương thức khác ở đây
}

module.exports = new adminBrandController();
