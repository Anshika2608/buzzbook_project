import api from "@/lib/interceptor";
import { route } from "@/lib/api";

export const handlePayment = async (bookingDetails: any, amount: number) => {
  try {
    // 1️⃣ Create order on backend
    const orderRes = await api.post(`${route.createPayment}`, {
      amount,
      currency: "INR",
    });

    if (!orderRes.data.success) {
      alert("Failed to create order");
      return;
    }

    const { order_id, key, amount: orderAmount } = orderRes.data;

    // 2️⃣ Load Razorpay script
    const rzpScript = await loadRazorpayScript();
    if (!rzpScript) {
      alert("Razorpay SDK failed to load!");
      return;
    }

    // 3️⃣ Razorpay Checkout Options
    const options: any = {
      key,
      amount: orderAmount,
      currency: "INR",
      name: "BuzzBook",
      description: "Movie Ticket & Snacks Payment",
      order_id,
      handler: async function (response: any) {
        try {
          // 4️⃣ After payment → Verify payment with backend
          const verifyRes = await api.post(`${route.verifyPayment}`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingDetails, // send seat + snacks details
          });

          if (verifyRes.data.success) {
            alert("Payment Successful!");
          }
        } catch (err) {
          alert("Payment verification failed!");
        }
      },
      prefill: {
        name: bookingDetails.user_name,
        email: bookingDetails.user_email,
      },
      theme: {
        color: "#6b21a8",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Payment failed!");
  }
};

// Helper for loading Razorpay SDK
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
