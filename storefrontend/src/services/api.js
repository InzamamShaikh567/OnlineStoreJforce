import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.id) {
    config.headers["X-User-Id"] = user.id;
  }
  return config;
});

export const api = {
  // Auth
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),

  // Products
  getProducts: (params) => API.get("/products", { params }),
  getProduct: (id) => API.get(`/products/${id}`),
  createProduct: (data) => API.post("/products", data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),

  // Cart
  getCart: () => API.get("/cart"),
  addToCart: (productId, quantity = 1) =>
    API.post("/cart", { productId, quantity }),
  removeFromCart: (id) => API.delete(`/cart/${id}`),

  // Orders
  checkout: () => API.post("/orders/checkout"),
  getMyOrders: () => API.get("/orders/my"),
  getAllOrders: () => API.get("/orders"),
  updateOrderStatus: (id, status) =>
    API.put(`/orders/${id}/status?status=${status}`),
  deleteOrder: (id) => API.delete(`/orders/${id}`),

  // Admin
  getAllUsers: () => API.get("/admin/users"),
};
