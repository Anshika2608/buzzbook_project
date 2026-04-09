"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import axios from "axios";
import { toast } from "sonner"
import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/interceptor";
import { route } from "@/lib/api";
import { Button } from "@/components/ui/button";
interface SnackItem {
    id: string;
    unit: string;
    qty: number;
    price: number;
}
interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (res: RazorpayResponse) => Promise<void>;
    theme: { color: string };
}
interface RazorpayInstance {
    open: () => void;
}
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}
function PaymentPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const theater_id = searchParams.get("theater_id");
    const movie_title = searchParams.get("movie_title");
    const showtime = searchParams.get("showtime");
    const show_date = searchParams.get("show_date");
    const audi_number = searchParams.get("audi_number");
    const theaterName = searchParams.get("theater_name");
    const movie_language = searchParams.get("movie_language");
    const seats = searchParams.get("seats")?.split(",") || [];
    const ticketPrice = Number(searchParams.get("ticketPrice") || 0);
    const snacks = JSON.parse(searchParams.get("snacks") || "[]") as SnackItem[];
    const tempBookingId =
        typeof window !== "undefined"
            ? localStorage.getItem("tempBookingId")
            : null;
    const [loading, setLoading] = useState(false);
    const [updatedTotal, setUpdatedTotal] = useState(ticketPrice);

    const snackTotal = snacks.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );
    const shownRef = useRef(false);

    useEffect(() => {
        const noSnacks = searchParams.get("noSnacks");

        if (noSnacks && !shownRef.current) {
            shownRef.current = true;

            toast.info("Snacks are not available for this theatre.", {
                className: "!bg-purple-900 !text-purple-200 !border-purple-500",
            });
        }
    }, []);
    // 1) UPDATE temp booking
    useEffect(() => {
        if (!tempBookingId) {
            console.error("No tempBookingId found!");
            return;
        }
        const syncTempBooking = async () => {
            try {
                //  Update snacks → this returns total_price
                const res = await api.put(route.updateTempBooking, {
                    tempBookingId,
                    snacks: snacks.map((item) => ({
                        snackId: item.id,
                        unit: item.unit,
                        quantity: item.qty
                    })),
                });
                // Update UI with backend total
                if (res?.data?.total_price) {
                    setUpdatedTotal(res.data.total_price);
                } else {
                    // fallback: calculate manually
                    setUpdatedTotal(ticketPrice + snackTotal);
                }

            } catch (err) {
                console.error("Error syncing temp booking:", err);
            }
        };

        syncTempBooking();
    }, [snacks, seats, tempBookingId]);


    // Razorpay Loader
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    // const isBookingValid = !!tempBookingId;
    // Handle Payment
    const handlePayment = async () => {
        try {
            setLoading(true);

            const orderRes = await api.post(`${route.createPayment}`, {
                tempBookingId,
                amount: updatedTotal,
                currency: "INR",
            });
            if (!orderRes?.data?.success &&
                orderRes?.data?.reason === "BOOKING_EXPIRED") {

                toast.error("⏰ Session expired. Please select seats again.");
                localStorage.removeItem("tempBookingId");
                router.replace("/");
                return;
            }
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

            const options: RazorpayOptions = {
                key,
                amount: orderAmount,
                currency: "INR",
                name: "BuzzBook",
                description: "Movie + Snacks Payment",
                order_id,

                handler: async function (res: RazorpayResponse) {
                    const verifyRes = await api.post(route.verifyPayment, {
                        razorpay_order_id: res.razorpay_order_id,
                        razorpay_payment_id: res.razorpay_payment_id,
                        razorpay_signature: res.razorpay_signature,
                        tempBookingId,
                        bookingDetails: {
                            theater_id,
                            audi_number,
                            movie_title,
                            movie_language,
                            showtime,
                            show_date,
                            seats,
                            paymentId: res.razorpay_payment_id,
                            seat_price_total: ticketPrice,
                            snacks: snacks.map((s: SnackItem) => ({
                                snackId: s.id,
                                unit: s.unit,
                                quantity: s.qty,
                                price: s.price * s.qty,
                            })),
                            snacks_total: snackTotal,
                            total_price: updatedTotal,
                        },
                    });

                    // 🚨 HANDLE EXPIRED FIRST
                    if (!verifyRes.data.success) {
                        if (verifyRes.data.reason === "BOOKING_EXPIRED") {
                            toast.error("⏰ Your session expired. Please select seats again.");
                            localStorage.removeItem("tempBookingId");
                            router.replace("/");
                            return;
                        }

                        toast.error("Payment verification failed");
                        return;
                    }

                    // ✅ SUCCESS FLOW
                    localStorage.removeItem("tempBookingId");

                    router.push(
                        `/success?movie_title=${movie_title}&show_date=${show_date}&showtime=${showtime}&seats=${seats.join(
                            ","
                        )}&audi_number=${audi_number}`
                    );
                },

                theme: { color: "#a855f7" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            setLoading(false);
        } catch (err) {

            if (axios.isAxiosError(err)) {

                const reason = err.response?.data?.reason;

                if (reason === "BOOKING_EXPIRED") {
                    toast.error("⏰ Session expired.");
                    localStorage.removeItem("tempBookingId");
                    router.replace("/");
                    return;
                }

            }

            toast.error("Payment failed");
            console.error(err);
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
                        <p><span className="text-purple-400 font-medium">Theater:</span> {theaterName}</p>
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
                        snacks.map((item: SnackItem, i: number) => (
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
                        disabled={loading }
                    >
                        {loading ? "Processing..." : `Pay ₹${updatedTotal}`}
                    </Button>
                </div>

            </div>
        </div>
    );
}
export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="p-10 text-white text-center">Loading...</div>}>
            <PaymentPageInner />
        </Suspense>
    );
}
