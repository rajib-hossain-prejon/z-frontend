import { create } from 'zustand';
import ICampaign from '../interfaces/ICampaign';

interface IUseAds {
  allCampaigns: ICampaign[];
  setAllCampaigns: (d: ICampaign[]) => any;
  setCampaign: (index: number, val: ICampaign & Record<string, any>) => any;
  updateCampaignById: (_id: string, val: Record<string, any>) => any;
}

const useAds = create<IUseAds>((set) => ({
  allCampaigns: [],
  setAllCampaigns: (val: ICampaign[]) => set(() => ({ allCampaigns: val })),
  setCampaign: (index: number, val: ICampaign & Record<string, any>) =>
    set((st) => ({
      allCampaigns: [
        ...st.allCampaigns.slice(0, index),
        {
          ...st.allCampaigns[index],
          ...val,
        },
        ...st.allCampaigns.slice(index + 1),
      ],
    })),
  updateCampaignById: (_id: string, val: Record<string, any>) =>
    set((st) => {
      const index = st.allCampaigns.findIndex((c) => c._id === _id);
      return {
        allCampaigns: [
          ...st.allCampaigns.slice(0, index),
          {
            ...st.allCampaigns[index],
            ...val,
          },
          ...st.allCampaigns.slice(index + 1),
        ],
      };
    }),
}));

export default useAds;
