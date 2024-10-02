require("../models/vehicleModel");
require("../models/categoryModel");
require("../models/brandModel");
const customerProductRoutes = require("./customer/customerRoutes");
const adminProductRoutes = require("./admin/adminRoutes");
const userRouters = require("./users/userRoutes");
const orderRouters = require("./order/orderRoutes");
function router(app) {
  app.use("/api/customer", customerProductRoutes);
  app.use("/api/admin", adminProductRoutes);
  app.use("/api/users", userRouters);
  app.use("/api/orders", orderRouters);
}

module.exports = router;
