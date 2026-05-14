import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await api.checkout();
      alert("Order placed successfully!");
      navigate("/account");
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "720px", margin: "0 auto" }}>
        <h1>Checkout</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ fontSize: "18px", color: "#666" }}>Your cart is empty</p>
            <button
              onClick={() => navigate("/store")}
              style={{
                padding: "12px 24px",
                background: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Go Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2>Order Summary</h2>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>
                    {item.productName} x {item.quantity}
                  </span>
                  <span style={{ fontWeight: "bold" }}>
                    ${(item.productPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px 0 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  padding: "14px 28px",
                  background: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;