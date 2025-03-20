import axios from 'axios';
import config from "../Common/Configurations/APIConfig";
export default function Payment() {
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    async function displayRazorpay() {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        // creating a new order
        const result = await axios.post(config.APIACTIVATEURL + "Payment/ProcessRequestOrder?UserId=6aa8a589-66f9-4c3b-a193-81ee6cc12057&Amount=500");

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }
        // Getting the order details back
        const { amount, id: order_id, currency,razorpayKey,name } = result.data.data;

        const options = {
            key: razorpayKey,
            amount: amount,
            currency: currency,
            name: name,
            description: "Gas Bill Transaction",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };
                const result = await axios.post(config.LOCALWEBURL + "payment", data);
            },
            prefill: {
                name: "Hari Babu",
                email: "support@hydroid.in",
                contact: "9999999999",
            },
            notes: {
                address: "Hydroid Gas Meter",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }
    return (
        <header className="App-header">
            <p>Buy React now!</p>
            <button className="App-link" onClick={displayRazorpay}>
                Pay ₹500
            </button>
        </header>
    );
}