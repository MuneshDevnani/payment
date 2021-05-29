import "./App.css";
// import StripeCheckout from 'react-stripe-checkout'
import { useEffect, useState } from "react";
import {
  CardElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from 'axios'

function App() {
  const [product, setProduct] = useState({
    name: "shirt",
    price: 10,
    productBy: "Munesh",
  });
  const stripe = useStripe();
  const elements = useElements();
  const [CardError, setCardError] = useState("");
  const [Loader, setLoader] = useState(false);
const [userEmail, setuserEmail] = useState("muneshkumarzenveus@gmail.com")
  // const makePayment = (token) => {
  //   const body = {
  //     token,
  //     product,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };

  //   return fetch("http://localhost:5000/pay", {
  //     method: "Post",
  //     headers,
  //     body: JSON.stringify(body),
  //   })
  //     .then((response) => {
  //       console.log("response", response);
  //       const { status } = response;
  //       console.log("Status", status);
  //     })
  //     .catch((error) => console.log(error));
  // };

  // const makePayment = async (event) => {
  //  stripe.createPaymentMethod(elements.getElement(CardNumberElement)).then(function(result) {
	// 		if (result.error) {
	// 		  setLoader(false)
	// 		  console.log(result.error);
	// 		  setCardError(result.error)
	// 		} else {
  //       axios.post("http://localhost:5000/pay", {
  //             token:result.token.id,
  //             amount: product.price * 100,
  //             product,
  //             userEmail,
  //     })       .then((response) => {
  //             console.log("response", response);
  //             const { status } = response;
  //             console.log("Status", status);
  //           })
  //           .catch((error) => console.log(error));
  //     }
  //    })  
  // };

  const handleClick = async (event) => {

    // Call your backend to create the Checkout Session
    const response = await fetch('http://localhost:5000/create-checkout-session', { method: 'POST' });

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };
  let paymentIntent;
  let clientSecret;
  useEffect(async () => {
    paymentIntent = await createIntant()
    clientSecret = paymentIntent.client_secret
   console.log(paymentIntent);
  //  createCardForm();
  }, [])

  const createIntant = async (event) => {
   return axios.post('http://localhost:5000/payment',{
    amount: product.price
  })
   console.log(paymentIntent);
  };

  const generate_payment_response =async (paymentIntent) => {
    if (
      paymentIntent.data.status === 'requires_action' &&
      paymentIntent.data.next_action.type === 'use_stripe_sdk'
    ) {
      // Tell the client to handle the action
      return {
        requires_action: true,
        payment_intent_client_secret: paymentIntent.data.client_secret
      };
    } else if (paymentIntent.data.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      }
    }
  };
  return (
    <div className="App">
        <div
          className="blue-text text-darken-2"
          style={{ marginLeft: "200px" }}
        >
          <h1 style={{ color: "black" }}>PAYMENT INFORMATION</h1>

          <div className="">
            <p className="">CARD NUMBER</p>

            <CardNumberElement
              options={{ showIcon: true }}
              className={`p-2 mt-1 bg-white rounded-sm ${
                CardError.code?.includes("number") && "border border-red-500"
              }`}
            />
          </div>
          <div className="grid w-full grid-cols-2">
            <div className="">
              <p className="text-xs opacity-80 mb-0.5">EXP.DATE</p>

              <CardExpiryElement
                className={`w-10/12 p-3 bg-white rounded-sm h-9 ${
                  CardError.code?.includes("expiry") && "border border-red-500"
                }`}
                type="text"
              />
            </div>
            <div className="">
              <p className="text-xs opacity-80 mb-0.5">CVC</p>

              <CardCvcElement
                className={`w-10/12 p-3 bg-white rounded-sm h-9 ${
                  CardError?.code == "incomplete_cvc" && "border border-red-500"
                }`}
              />
            </div>
          </div>
          <div className="mt-2 text-center text-red-600">
            {CardError.message && <small>{CardError.message}</small>}
          </div>
        </div>
        <button className="btn-large blue" onClick={generate_payment_response} disabled={!stripe}>
          Buy Now For {product.price}{" "}
        </button>
        < br />
        <button className="btn-large blue" onClick={handleClick} disabled={!stripe}>
          Checkout
        </button>

      {/* <StripeCheckout 
      stripeKey="pk_test_5oz7eIJr3VLfdKu4tJKLAtnH00G6ky5a0i"
      token ={makePayment}
      name="Buy Product"
      amount ={product.price * 100}
      >
        <button className="btn-large blue">Buy Now For {product.price} </button> </StripeCheckout> */}
    </div>
  );
}

export default App;
