import React, { useEffect } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

interface IPayPalSubscribeButtonProps {
  planId: string;
  subscriptionId: string;
  onSuccess: (d?: any) => any;
  onError: (e?: any) => any;
}

const ButtonWrapper = (
  props: { type: string } & IPayPalSubscribeButtonProps,
) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    });
  }, [props.type]);
  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription
          .create({
            custom_id: props.subscriptionId,
            plan_id: props.planId,
            auto_renewal: true,
            quantity: '1',
          })
          .then((d) => {
            return d;
          });
      }}
      onApprove={(d) => props.onSuccess(d.subscriptionID)}
      onError={props.onError}
      style={{
        label: 'subscribe',
      }}
    />
  );
};

export default function PayPalSubscribeButton(
  props: IPayPalSubscribeButtonProps,
) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        components: 'buttons',
        intent: 'subscription',
        vault: true,
      }}
    >
      <ButtonWrapper
        type="subscription"
        planId={props.planId}
        subscriptionId={props.subscriptionId}
        onSuccess={props.onSuccess}
        onError={props.onError}
      />
    </PayPalScriptProvider>
  );
}
