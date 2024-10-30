require("../models/vehicleModel");
require("../models/categoryModel");
require("../models/brandModel");
const customerProductRoutes = require("./customer/customerRoutes");
const adminProductRoutes = require("./admin/adminRoutes");
const userRouters = require("./users/userRoutes");
const orderRouters = require("./order/orderRoutes");
const emailRouters = require("./email/emailRouters");
const notificationRouters = require("./notification/notificationRouters");
const reviewRouters = require("./review/reviewRoutes");

const paymentRoutes = require("./payment/paymentRoutes");
const uploadRouter = require("../image/upload");
function router(app) {
  app.use("/api/customer", customerProductRoutes);
  app.use("/api/admin", adminProductRoutes);
  app.use("/api/users", userRouters);
  app.use("/api/orders", orderRouters);
  app.use("/api/emails", emailRouters);
  app.use("/api/notifications", notificationRouters);
  app.use("/api/reviews", reviewRouters);
  
  app.use("/api/payments", paymentRoutes);
  app.use("/api/uploads", uploadRouter);
}

module.exports = router;
