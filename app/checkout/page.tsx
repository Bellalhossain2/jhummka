  "use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PayForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const pay = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/success" },
    });
    if (error) setMsg(error.message || "Failed");
    setLoading(false);
  };

  return (
    <form onSubmit={pay} className="space-y-6 bg-black p-6 border border-yellow-200/20">
      <h2 className="text-[#f5e6a0] text-xl tracking-widest">PAY WITH CARD</h2>
      <PaymentElement />
      {msg && <p className="text-red-400 text-sm">{msg}</p>}
      <button disabled={!stripe || loading} className="w-full bg-[#f5e6a0] text-black py-4 font-bold">
        {loading ? "PROCESSING..." : `PAY $${amount} NOW`}
      </button>
      <p className="text-gray-500 text-xs text-center">Test card: 4242 4242 4242 4242 - 12/34 - 123</p>
    </form>
  );
}

export default function CheckoutPage() {
  const [secret, setSecret] = useState("");
  const amount = 99; // your product total - change this

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then(r => r.json())
      .then(d => setSecret(d.clientSecret));
  }, []);

  if (!secret) return <div className="p-10 text-[#f5e6a0] text-center">Loading secure payment...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center pt-20 px-4">
      <div className="w-full max-w-md">
        <Elements stripe={stripePromise} options={{ clientSecret: secret, appearance: { theme: "night" } }}>
          <PayForm amount={amount} />
        </Elements>
      </div>
    </div>
  );
} 
