import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckOutForm'


function Payment(props: { stripePromise: any; }) {
  const { stripePromise } = props;
  const [ clientSecret, setClientSecret ] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const storedToken = localStorage.getItem("token");

    fetch("http://localhost:8080/api/payment/create-payment-intent", {
        headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
        },
    })
      .then((res) => res.json())
      .then(({clientSecret}) => setClientSecret(clientSecret));
  }, []);


  return (
    <>
      <h1>Payment</h1>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;