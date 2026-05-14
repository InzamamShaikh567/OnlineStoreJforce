import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "ELECTRONICS",
    imageUrl: "https://via.placeholder.com/150",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id || !user.admin) {
      navigate("/");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsRes = await api.getProducts();
      setProducts(productsRes.data);
      const usersRes = await api.getAllUsers();
      setUsers(usersRes.data);
      const ordersRes = await api.getAllOrders();
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
      } else {
        await api.createProduct(data);
      }

      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "ELECTRONICS",
        imageUrl: "https://via.placeholder.com/150",
      });
      loadData();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.deleteOrder(orderId);
      loadData();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "#2ecc71";
      case "CANCELED":
        return "#e74c3c";
      default:
        return "#f39c12";
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Admin Dashboard</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "10px 20px",
              background: activeTab === "products" ? "#4a90e2" : "#ddd",
              color: activeTab === "products" ? "white" : "#2c3e50",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              padding: "10px 20px",
              background: activeTab === "users" ? "#4a90e2" : "#ddd",
              color: activeTab === "users" ? "white" : "#2c3e50",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 20px",
              background: activeTab === "orders" ? "#4a90e2" : "#ddd",
              color: activeTab === "orders" ? "white" : "#2c3e50",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Orders
          </button>
        </div>

        {/* Products tab */}
        {activeTab === "products" && (
          <div>
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => {
                  setShowProductForm(true);
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    description: "",
                    price: "",
                    category: "ELECTRONICS",
                    imageUrl: "https://via.placeholder.com/150",
                  });
                }}
                style={{
                  padding: "10px 20px",
                  background: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              >
                <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      required
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Description:</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                      required
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Price:</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: e.target.value })
                      }
                      required
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Category:</label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    >
                      <option value="ELECTRONICS">Electronics</option>
                      <option value="CLOTHING">Clothing</option>
                      <option value="HOME_KITCHEN">Home & Kitchen</option>
                      <option value="SPORTS">Sports</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        background: "#4a90e2",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProduct(null);
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "#ddd",
                        color: "#2c3e50",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Price</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "12px" }}>{p.name}</td>
                    <td style={{ padding: "12px" }}>{p.category}</td>
                    <td style={{ padding: "12px" }}>${p.price}</td>
                    <td style={{ padding: "12px" }}>
                      <button
                        onClick={() => handleEditProduct(p)}
                        style={{
                          padding: "5px 10px",
                          background: "#4a90e2",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginRight: "5px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        style={{
                          padding: "5px 10px",
                          background: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users tab */}
        {activeTab === "users" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Username</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "12px" }}>{u.id}</td>
                  <td style={{ padding: "12px" }}>{u.username}</td>
                  <td style={{ padding: "12px" }}>{u.email}</td>
                  <td style={{ padding: "12px" }}>
                    {u.admin ? "Admin" : "User"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "15px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <strong>Order #{order.id}</strong> -{" "}
                    {order.items.map((item) => item.productName).join(", ")}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      style={{ padding: "5px" }}
                    >
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      style={{
                        padding: "5px 10px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Total: ${order.totalAmount} | Date: {order.orderDate}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;