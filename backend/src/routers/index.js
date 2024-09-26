require("../models/vehicleModel");
require("../models/categoryModel");
require("../models/brandModel");
const customerProductRoutes = require("./customer/customerRoutes");
const adminProductRoutes = require("./admin/adminRoutes");
const userRouters = require("./userRoutes");
function router(app) {
  app.use("/api/customer/products", customerProductRoutes);
  app.use("/api/admin", adminProductRoutes);
  app.use("/api/users", userRouters);
}

module.exports = router;
