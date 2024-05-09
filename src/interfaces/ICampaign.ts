export default interface ICampaign {
  _id: string;
  title: string;
  description: string;
  display: ('upload-screen' | 'download-screen')[];
  isABTesting: boolean;
  creative: {
    url: string;
    image: string;
  };
  creativeABTesting?: {
    url: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  impressions: {
    date: string;
    totalImpressions: number;
    totalClicks: number;
  }[];
  payment?: {
    service: 'stripe' | 'paypal';
    serviceId: string;
    price: number;
    status: string;
    invoiceLink: string; // for handling invoices manually by user interaction
  };
  updateToken: string;
}
