export interface Recipient {
    name: string;
    email: string;
  }
  
  export interface Campaign {
    id: string;
    name: string;
    subject: string;
    sentAt: string;
    recipientCount: number;
    successCount: number;
    failureCount: number;
  }
  
  export interface EmailState {
    campaigns: Campaign[];
    recipients: Recipient[];
    subject: string;
    content: string;
    campaignName: string;
    loading: boolean;
    preview: Recipient | null;
    showCreateCampaign: boolean;
  }