import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RazorpayCheckout: React.FC = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(5100); // Default amount
  const [receipt, setReceipt] = useState<string>(''); // Default receipt
  const [orderDetails, setOrderDetails] = useState<any>(null); // To store dynamic order details

  // Handle amount change dynamically
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(event.target.value) * 100); // Convert to paise (smallest currency unit)
  };

  // Handle receipt change dynamically
  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceipt(event.target.value);
  };

  // Fetch order data dynamically from your backend using Axios
  const createOrder = async () => {
    try {
      const response = await axios.post('http://192.168.29.82:8000/api/create_order/', {
        amount: amount,
        receipt: receipt, // Sending dynamic receipt to the backend
      });

      const data = response.data;

      if (data.status === 'success') {
        setOrderId(data.order_id); // Set the order ID dynamically
        setOrderDetails(data.order_details); // Store full order details from the API response
        return data.order_id;
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // UseEffect to load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => console.log('Razorpay script loaded');
      document.body.appendChild(script);
    };

    loadRazorpayScript();

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle the Razorpay payment submission
  const handlePayment = async () => {
    if (!orderId) {
      const createdOrderId = await createOrder(); // Create order if not already created
      if (!createdOrderId) {
        alert('Failed to create order');
        return;
      }
    }

    if (orderDetails) {
      const options: any = {
        key: 'rzp_test_hqWvVqOn8QFGEF', // Replace with your Razorpay Key ID
        amount: orderDetails.amount, // Amount in smallest currency unit (i.e., cents or paise)
        currency: 'INR', // Currency
        name: orderDetails.receipt || 'Default Name', // Using receipt as name (replace with actual dynamic field)
        description: 'Purchase Description',
        image: 'vk.jpg', // Add dynamic image URL here if needed
        order_id: orderId, // Dynamically set the order_id
        prefill: {
          name: 'Harshil Mathur', // Replace with actual dynamic data
          email: 'harshil@razorpay.com', // Replace with actual dynamic data
          contact: '9999999999', // Replace with actual dynamic data
        },
        notes: {
          shopping_order_id: orderDetails.receipt || 'Unknown', // Using receipt for shopping order ID
        },
        handler: function (response: any) {
          alert('Payment Successful: ' + response.razorpay_payment_id);
          // You can handle the response here (e.g., sending payment info to your server)
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Checkout</h2>
        
        {/* Amount input */}
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter Amount"
          onChange={handleAmountChange}
          value={amount / 100} // Convert to INR
        />
        
        {/* Receipt input */}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter Receipt ID"
          onChange={handleReceiptChange}
          value={receipt}
        />

        <p className="text-center text-gray-500 mb-4">Total Amount: ₹{amount / 100}</p>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default RazorpayCheckout;
