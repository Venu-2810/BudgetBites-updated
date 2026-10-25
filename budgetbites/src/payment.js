export const startPayHere = async (orderDetails) => {
  const res = await fetch("http://localhost:3000/api/payment/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderDetails),
  });

  const data = await res.json();

  const script = document.createElement("script");
  script.src = "https://sandbox.payhere.lk/lib/payhere.js";
  script.onload = () => payhere.startPayment(data);
  document.body.appendChild(script);
};
