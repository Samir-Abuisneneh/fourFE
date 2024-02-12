import {useEffect, useState} from 'react';

function Completion(props) {
  const [ messageBody, setMessageBody ] = useState('');
  const { stripePromise } = props;

  useEffect(() => {
    if (!stripePromise) return;

    stripePromise.then(async (stripe) => {
      const url = new URL(window.location);
      const clientSecret = url.searchParams.get('payment_intent_client_secret');
      const { error, paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
      
      // console.log(paymentIntent)
      // const id = paymentIntent.id;
      // try {
      //   const storedToken = localStorage.getItem("token");
      //   console.log("ASDFdasf")
      //   const response = await fetch("http://localhost:8080/api/payment/add-coins?payId="+id, {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${storedToken}`,
      //     },
      //     body: JSON.stringify({
      //       payId:id
      //     })
      //   });
  
      //   if (response.ok) {
      //     const data = await response.json();
      //   } else {
      //     console.error("Error add user's coins");
      //   }
      // } catch (error) {
      //   console.error("Error:", error);
      // }

      setMessageBody(error ? `> ${error.message}` : (
        <>&gt; Payment {paymentIntent.status}: <a href={`https://dashboard.stripe.com/test/payments/${paymentIntent.id}`} target="_blank" rel="noreferrer">{paymentIntent.id}</a></>
      ));
    });
  }, [stripePromise]);

  return (
    <>
      <h1>Thank you!</h1>
      <a href="/">home</a>
      <div id="messages" role="alert" style={messageBody ? {display: 'block'} : {}}>{messageBody}</div>
    </>
  );
}

export default Completion;