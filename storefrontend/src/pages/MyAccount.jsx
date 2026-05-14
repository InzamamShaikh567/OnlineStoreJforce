import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

function MyAccount() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      navigate("/");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const ordersRes = await api.getMyOrders();
      setOrders(ordersRes.data);
      const cartRes = await api.getCart();
      setCart(cartRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.removeFromCart(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveForLater = (item) => {
    setSavedItems([...savedItems, item]);
    handleRemove(item.id);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
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
      <div style={{ padding: "20px", maxWidth: "720px", margin: "0 auto" }}>
        <h1>User cart and previous order:</h1>

        {/* My Orders section */}
        <div style={{ marginBottom: "40px" }}>
          <h2>My Account</h2>
          <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            My Orders
          </h3>

          {orders.length === 0 ? (
            <p style={{ color: "#888" }}>No orders yet</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "15px 0",
                }}
              >
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {item.productName}
                      </p>
                      <p style={{ margin: "5px 0 0", color: "#666", fontSize: "14px" }}>
                        Order #{order.id} - {order.orderDate} - Qty: {item.quantity}
                      </p>
                    </div>
                    <span
                      style={{
                        color: getStatusColor(order.status),
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* My Cart section */}
        <div>
          <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
            My Cart
          </h3>

          {cart.length === 0 ? (
            <p style={{ color: "#888" }}>Cart is empty</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    borderBottom: "1px solid #ddd",
                    padding: "15px 0",
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {item.productName}
                    </p>
                    <p style={{ margin: "5px 0 0", color: "#666" }}>
                      ${item.productPrice} x {item.quantity}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleRemove(item.id)}
                      style={{
                        padding: "8px 16px",
                        background: "#ddd",
                        color: "#2c3e50",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleSaveForLater(item)}
                      style={{
                        padding: "8px 16px",
                        background: "#ddd",
                        color: "#2c3e50",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Save for Later
                    </button>
                  </div>
                </div>
              ))}

              {/* Cart total and checkout */}
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "right",
                }}
              >
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Total: ${total.toFixed(2)}
                </p>
                <button
                  onClick={handleCheckout}
                  style={{
                    padding: "12px 24px",
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAccount;