import React, { useEffect, useState } from "react";
import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { database } from "../firebase/firebase";
import { CheckoutForm } from "../components";

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: "https://fonts.googleapis.com/css?family=Roboto",
    },
  ],
};

const stripePromise = loadStripe(
  "pk_test_51IcThDLWYGDi6uMlOtqv6zwl8nlraS0M8LC1CVBJthmUFOFArSabWp2ARLpTRmSYu586wd3l4p5da6cUOI7Svy1e00bVgnAGkp"
);

const CheckoutPage = ({ paymentIntent }) => {
  console.log("paymentIntent = ", paymentIntent);

  const router = useRouter();
  const [validFileUser, setValidFileUser] = useState(null);
  let filename = router.query.file.split("-")[0];
  const user = router.query.file.split("-")[1];
  if (filename.includes("%")) {
    filename = filename.split("%").join(" ");
  }

  useEffect(async () => {
    const res = database.collection("userFiles");
    const data = await res.get();
    data.forEach((file) => {
      if (file.data().email === user && file.data().filename === filename) {
        setValidFileUser({ id: file.id, ...file.data() });
      }
    });
  }, []);

  return (
    <div className="AppWrapper">
      <div className="title-pg">
        <h1>Checkout</h1>
      </div>

      <div className="msg-pg">
        <h4>
          The selected dataset has an unpaid balance of ${validFileUser?.price}.
          Please make a payment to continue with the download.
        </h4>
      </div>

      <div className="title-pg">
        <h1>Your Order</h1>
      </div>

      <div className="checkoutPage-table">
        <table>
          <tr style={{ background: "#ccc" }}>
            <th style={{ width: "350px", textAlign: "left" }}>Dataset</th>
            <th>Amount Due</th>
          </tr>
          <tr style={{ background: "#eee" }}>
            <td>{filename}</td>
            <td>{validFileUser?.price}</td>
          </tr>
        </table>
      </div>

      <div className="title-pg">
        <h1>Payment</h1>
      </div>
      <br />
      <div>
        <input
          style={{ marginLeft: "15px", marginBottom: "10px" }}
          type="radio"
          checked
        />
        <label
          for="credit card"
          style={{ fontWeight: "bold", fontSize: "15px" }}
        >
          {" "}
          Credit Card
        </label>
        <br></br>
      </div>

      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <CheckoutForm
          paymentIntent={paymentIntent}
          id={validFileUser?.id}
          price={validFileUser?.price}
          filename={filename}
        />
      </Elements>

      <div>
        <input style={{ marginLeft: "15px", marginTop: "40px" }} type="radio" />
        <label
          for="credit card"
          style={{ fontWeight: "bold", fontSize: "15px" }}
        >
          {" "}
          PayPal
        </label>
        <br></br>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const price = ctx.query.file.split("-")[2];
  const stripe = new Stripe(
    "sk_test_51IcThDLWYGDi6uMlp1ucOUORskxQWbF3oM8CuSFyqT0JE6tX4H4S7oQxU6uQ5SZ587KVWRxKjHiSH8zF5jCJW6Cy009G1ZT5rU"
  );

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent,
      },
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "usd",
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent,
    },
  };
};

export default CheckoutPage;
