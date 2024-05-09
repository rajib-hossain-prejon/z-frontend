import React, { useEffect } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { payCampaign } from '../../../api/user';

interface IPayPalCheckoutButtonProps {
  orderId: string;
  campaignId: string;
  onSuccess: (d?: any) => any;
  onError: (e?: any) => any;
}

const ButtonWrapper = (
  props: { type: string } & IPayPalCheckoutButtonProps,
) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'capture',
      },
    });
  }, [props.type]);
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return payCampaign(props.campaignId).then((res) => res.orderId || '');
      }}
      onApprove={(d) => props.onSuccess(d.orderID)}
      onError={props.onError}
      style={{
        label: 'pay',
      }}
    />
  );
};

export default function PayPalCheckoutButton(
  props: IPayPalCheckoutButtonProps,
) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        components: 'buttons',
        intent: 'capture',
      }}
    >
      <ButtonWrapper
        type="intent"
        orderId={props.orderId}
        campaignId={props.campaignId}
        onSuccess={props.onSuccess}
        onError={props.onError}
      />
    </PayPalScriptProvider>
  );
}
