import IUser from "./IUser";

export default interface IInvoice {
  _id: string;
  user: IUser;
  serviceId: string;
  service: 'paypal' | 'stripe';
  plan: string;
  amount: number;
  currency: string;
  datePaid: Date;
  metadata: Record<string, any> & {
    maxWorkspaces: number;
    storageSizeInBytes: number;
    userId: string;
  };
}
