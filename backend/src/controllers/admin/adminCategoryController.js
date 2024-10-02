const baseController = require("./baseController");
const Category = require("../../models/categoryModel");

class adminCategoryController extends baseController {
  constructor() {
    super(Category, "categories", "category");
  }
}

module.exports = new adminCategoryController();
