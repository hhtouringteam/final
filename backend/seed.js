// seed.js

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

// Import các mô hình
const Brand = require("./src/models/brandModel");
const Category = require("./src/models/categoryModel");
const Vehicle = require("./src/models/vehicleModel");
const Product = require("./src/models/productModel");

// Cấu hình Mongoose để tránh cảnh báo DeprecationWarning về strictQuery
mongoose.set("strictQuery", false);

// Kết nối đến MongoDB
mongoose
  .connect("mongodb://localhost:27017/ProductDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Kết nối thành công đến MongoDB");
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err);
  });

// Hàm tạo dữ liệu giả cho Brand
async function createBrands(num = 10) {
  const brands = [];

  for (let i = 0; i < num; i++) {
    const brand = new Brand({
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      establishedYear: faker.date.past({ years: 50 }).getFullYear(),
      country: faker.location.country(),
      website: faker.internet.url(),
    });
    brands.push(brand);
  }

  await Brand.insertMany(brands);
  console.log(`${num} thương hiệu đã được tạo.`);
}

// Hàm tạo dữ liệu giả cho Category
async function createCategories(num = 10) {
  const categories = new Set();

  // Sử dụng Set để đảm bảo tính duy nhất
  while (categories.size < num) {
    categories.add(faker.commerce.department());
  }

  const categoryDocs = Array.from(categories).map((name) => ({
    name,
    description: faker.lorem.sentence(),
  }));

  try {
    await Category.insertMany(categoryDocs);
    console.log(`${num} danh mục đã được tạo.`);
  } catch (err) {
    console.error("Lỗi khi tạo danh mục:", err);
  }
}

// Hàm tạo dữ liệu giả cho Vehicle
async function createVehicles(num = 10) {
  const vehicles = new Set();

  // Sử dụng Set để đảm bảo tính duy nhất cho tên xe
  while (vehicles.size < num) {
    vehicles.add(faker.vehicle.model());
  }

  const vehicleDocs = Array.from(vehicles).map((name) => ({
    name,
    description: faker.lorem.sentence(),
    manufacturer: faker.vehicle.manufacturer(),
    year: faker.date.past({ years: 30 }).getFullYear(),
    type: faker.vehicle.type(),
    engineSize: `${faker.number.int({ min: 100, max: 2000 })}cc`,
  }));

  try {
    await Vehicle.insertMany(vehicleDocs);
    console.log(`${num} phương tiện đã được tạo.`);
  } catch (err) {
    console.error("Lỗi khi tạo phương tiện:", err);
  }
}

// Hàm tạo dữ liệu giả cho Product
async function createProducts(num = 50) {
  // Lấy tất cả các Brand, Category, và Vehicle từ cơ sở dữ liệu
  const brands = await Brand.find();
  const categories = await Category.find();
  const vehicles = await Vehicle.find();

  if (brands.length === 0 || categories.length === 0 || vehicles.length === 0) {
    throw new Error("Không có đủ Brand, Category hoặc Vehicle để tạo Product.");
  }

  const products = [];

  for (let i = 0; i < num; i++) {
    // Chọn ngẫu nhiên một Brand, Category và Vehicle
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

    const product = new Product({
      name: `${faker.commerce.productName()}-${faker.string.uuid()}`, // Đảm bảo tên duy nhất
      price: faker.number.int({ min: 1000, max: 100000 }),
      description: faker.lorem.paragraph(),
      categoryId: randomCategory._id,
      brandId: randomBrand._id,
      vehicleId: randomVehicle._id,
      itemCode: faker.string.uuid(),
      stock: faker.number.int({ min: 0, max: 1000 }),
      imageUrl: faker.image.url(),
      specifications: {
        size: faker.lorem.word(), // Sửa lỗi ở đây
        material: faker.commerce.productMaterial(),
        color: faker.color.human(),
        spokeCount: faker.number.int({ min: 0, max: 50 }),
        weight: faker.number.float({ min: 0, max: 100 }),
      },
    });
    products.push(product);
  }

  try {
    await Product.insertMany(products);
    console.log(`${num} sản phẩm đã được tạo.`);
  } catch (err) {
    console.error("Lỗi khi tạo sản phẩm:", err);
  }
}

// Hàm chính để seed dữ liệu
async function seedDatabase() {
  try {
    // Xóa dữ liệu cũ để tránh trùng lặp
    await Brand.deleteMany({});
    await Category.deleteMany({});
    await Vehicle.deleteMany({});
    await Product.deleteMany({});
    console.log("Đã xóa dữ liệu cũ.");

    // Tạo dữ liệu mới
    await createBrands(20);
    await createCategories(20);
    await createVehicles(20);
    await createProducts(100);

    console.log("Đã tạo dữ liệu giả thành công!");
  } catch (err) {
    console.error("Lỗi khi tạo dữ liệu giả:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Thực thi hàm seed
seedDatabase();
