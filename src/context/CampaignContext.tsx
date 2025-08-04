import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {Campaign} from "../classes/saveitems/Campaign/Campaign";

interface CampaignContextType {
    campaign: Campaign;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [campaign] = useState<Campaign>(() => new Campaign());

    return (
        <CampaignContext.Provider value={{ campaign }}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = (): CampaignContextType => {
    const context = useContext(CampaignContext);
    if (!context) throw new Error('useCampaign must be used within a CampaignProvider');
    return context;
};
