const express = require("express");
const router = express.Router();
const adminBrandController = require("../../controllers/admin/adminBrandController");
const adminProductController = require("../../controllers/admin/adminProductController");
const adminCategoryController = require("../../controllers/admin/adminCategoryController");
const adminVehicleController = require("../../controllers/admin/adminVehicleController");

const CrudRoutes = (resourceName, controller) => {
  router.get(`/${resourceName}`, controller.getAll.bind(controller));
  router.get(
    `/${resourceName}/:id`,
    controller.getProductById.bind(controller)
  );
  router.post(`/${resourceName}/add`, controller.create.bind(controller));
  router.put(`/${resourceName}/update/:id`, controller.update.bind(controller));
  router.delete(
    `/${resourceName}/delete/:id`,
    controller.delete.bind(controller)
  );
};

CrudRoutes("brands", adminBrandController);
CrudRoutes("products", adminProductController);
CrudRoutes("categories", adminCategoryController);
CrudRoutes("vehicles", adminVehicleController);

module.exports = router;
