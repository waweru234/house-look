const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("<h1>HouseLook M-Pesa Mock API Server</h1><p>This is a mock server for testing purposes</p>");
});

// ✅ STK Push Mock Endpoint — Matches Safaricom sandbox structure
app.post("/mpesa/stkpush/v1/processrequest", async (req, res) => {
  const { PhoneNumber, Amount, TransactionDesc } = req.body;

  console.log("📲 Simulating STK Push:", { PhoneNumber, Amount, TransactionDesc });

  if (!PhoneNumber || !Amount) {
    return res.status(400).json({ error: "PhoneNumber and Amount are required" });
  }

  // Simulate Safaricom response
  const mockResponse = {
    MerchantRequestID: "mock_merchant_" + Date.now(),
    CheckoutRequestID: "ws_CO_" + Date.now(),
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing",
    CustomerMessage: "STK Push request has been initiated"
  };

  console.log("✅ Responding with mock M-Pesa data:", mockResponse);
  res.status(200).json(mockResponse);
});

// Optional: Callback simulation
app.post("/callback", (req, res) => {
  console.log("📥 Mock M-Pesa Callback Received:", req.body);
  res.status(200).json({ status: "OK" });
});

// Start mock server
app.listen(port, () => {
  console.log(`✅ M-Pesa Mock Server running on http://localhost:${port}`);
  console.log("⚠️  This is a mock server for testing purposes only.");
});
