"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/interceptor";
import { route } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const theater_id = searchParams.get("theater_id");
    const movie_title = searchParams.get("movie_title");
    const showtime = searchParams.get("showtime");
    const show_date = searchParams.get("show_date");
    const seats = searchParams.get("seats")?.split(",") || [];
    const ticketPrice = Number(searchParams.get("ticketPrice") || 0);
    const snacks = JSON.parse(searchParams.get("snacks") || "[]");

    const [loading, setLoading] = useState(false);
    const [updatedTotal, setUpdatedTotal] = useState(ticketPrice);

    const snackTotal = snacks.reduce(
        (sum: number, item: any) => sum + item.qty * item.price,
        0
    );

    const grandTotal = ticketPrice + snackTotal;

    // ------------------------
    // 1) UPDATE temp booking
    // ------------------------
    useEffect(() => {
        const tempBookingId = localStorage.getItem("tempBookingId");

        if (!tempBookingId) {
            console.error("❌ No tempBookingId found!");
            return;
        }

        const syncTempBooking = async () => {
            try {
                // First ensure seats are up-to-date
                await api.put(route.updateSeats, { tempBookingId, seats, show_date });

                // Then update snacks
                await api.put(route.updateTempBooking, {
                    tempBookingId,
                    snacks: snacks.map((item: any) => ({ snackId: item.id, unit: item.unit, quantity: item.qty })),
                });

                // Fetch latest temp booking to read total_price (assuming you have an endpoint)
                // If no endpoint, the update endpoints can return total_price which you should use.
                // const resp = await api.get(`${route.getTempBooking}?id=${tempBookingId}`);
                // setUpdatedTotal(resp.data.total_price || ticketPrice + snackTotal);
            } catch (err) {
                console.error("❌ Error syncing temp booking:", err);
            }
        };

        syncTempBooking();
    }, [snacks, seats]);

    // ------------------------
    // Razorpay Loader
    // ------------------------
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // ------------------------
    // Handle Payment
    // ------------------------
    const handlePayment = async () => {
        try {
            setLoading(true);

            const orderRes = await api.post(`${route.createPayment}`, {
                amount: updatedTotal,
                currency: "INR",
            });

            if (!orderRes.data.success) {
                alert("Order creation failed");
                setLoading(false);
                return;
            }

            const { order_id, key, amount: orderAmount } = orderRes.data;

            const loaded = await loadRazorpayScript();
            if (!loaded) {
                alert("Razorpay failed to load!");
                setLoading(false);
                return;
            }

            const options: any = {
                key,
                amount: orderAmount,
                currency: "INR",
                name: "BuzzBook",
                description: "Movie + Snacks Payment",
                order_id,

                handler: async function (res: any) {
                    const verifyRes = await api.post(`${route.verifyPayment}`, {
                        razorpay_order_id: res.razorpay_order_id,
                        razorpay_payment_id: res.razorpay_payment_id,
                        razorpay_signature: res.razorpay_signature,
                    });

                    if (verifyRes.data.success) {
                        router.push("/success");
                    }
                },

                theme: { color: "#a855f7" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            setLoading(false);
        } catch (err) {
            alert("Payment failed!");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/40 to-black text-white p-6 ">
            <div className="max-w-6xl mx-auto mt-24">

                <h1 className="text-4xl font-bold text-center mb-8">Order Summary</h1>

                {/* MOVIE DETAILS */}
                <div className="text-lg mb-6">
                    <p className="font-bold text-purple-400 text-xl mb-2">🎬 Movie Details</p>

                    <div className="space-y-3 text-purple-200">
                        <p><span className="text-purple-400 font-medium">Movie:</span> {movie_title}</p>
                        <p><span className="text-purple-400 font-medium">Theater:</span> {theater_id}</p>
                        <p><span className="text-purple-400 font-medium">Date:</span> {show_date}</p>
                        <p><span className="text-purple-400 font-medium">Showtime:</span> {showtime}</p>
                        <p><span className="text-purple-400 font-medium">Seats:</span> {seats.join(", ")}</p>
                    </div>

                    <div className="mt-3 flex justify-between text-xl font-bold text-purple-300">
                        <span>Ticket Price</span>
                        <span>₹{ticketPrice}</span>
                    </div>
                </div>

                <hr className="border-purple-800 my-6" />

                {/* SNACKS SECTION */}
                <div className="text-lg mb-6">
                    <p className="font-bold text-purple-400 text-xl mb-2">🍿 Snacks</p>

                    {snacks.length === 0 ? (
                        <p className="text-purple-400">No snacks selected</p>
                    ) : (
                        snacks.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between py-2 text-purple-200">
                                <span>{item.unit} × {item.qty}</span>
                                <span>₹{item.qty * item.price}</span>
                            </div>
                        ))
                    )}

                    <div className="mt-3 flex justify-between text-xl font-bold text-purple-300">
                        <span>Snacks Total</span>
                        <span>₹{snackTotal}</span>
                    </div>
                </div>

                <hr className="border-purple-800 my-6" />

                {/* UPDATED TOTAL */}
                <div className="flex justify-between items-center text-3xl font-semibold text-white mb-10">
                    <span>Total Amount</span>
                    <span className="text-green-400">₹{updatedTotal}</span>
                </div>

                {/* PAY BUTTON */}
                <div className="w-full flex justify-center">
                    <Button
                        className="w-full max-w-md text-2xl bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-700/50"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : `Pay ₹${updatedTotal}`}
                    </Button>
                </div>

            </div>
        </div>
    );
}
