// const baseController = require("./baseController");
// const category = require("../../models/categoryModel");

// class adminCategoryController extends baseController {
//   constructor() {
//     super(category); // Truyền model Category vào BaseController
//   }
// }

// module.exports = new adminCategoryController();
// controllers/admin/adminCategoryController.js
const baseController = require("./baseController");
const Category = require("../../models/categoryModel");

class adminCategoryController extends baseController {
  constructor() {
    super(Category, 'categories', 'category'); // Truyền model, pluralKey, singularKey
  }

  // Override các phương thức nếu cần
}

module.exports = new adminCategoryController();
