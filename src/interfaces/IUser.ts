import ICampaign from './ICampaign';
import IWorkspace from './IWorkspace';

export default interface IUser {
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  email: string;
  password: string;
  language: string;
  zoxxoUrl: string;
  workspaces: IWorkspace[];
  campaigns: string[] | ICampaign[];
  defaultWorkspace: IWorkspace | string;
  maxWorkspaces: number;
  storageSizeInBytes: number;
  billing?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    vatNumber: string;
  };
  paymentMethod?: {
    service: 'stripe' | 'paypal';
    verificationLink: string; // for handling verification manually by user interaction
    stripeCardData?: {
      stripeId: string;
      nameOnCard: string;
      brand: 'visa' | 'mastercard';
      last4: string;
    };
  };
  // subscription represents TORNADO plan
  subscription?: {
    type: 'monthly' | 'yearly';
    extraWorkspaces: number;
    extraStorageInBytes: number;
    price: number;
    invoiceLink: string; // for handling invoices manually by user interaction
    isEligibleForProratedDiscount: boolean;
    status: 'active' | 'downgrading' | 'trialing' | 'canceled' | 'incomplete' | 'past_due',
    downgradesAt: string;
  };
}
