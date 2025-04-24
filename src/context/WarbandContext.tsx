import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserWarband } from '../classes/saveitems/Warband/UserWarband';

interface WarbandContextType {
    warband: UserWarband | null;
    setWarband: (wb: UserWarband | null) => void;
}

const WarbandContext = createContext<WarbandContextType | undefined>(undefined);

export const WarbandProvider: React.FC<{ children: ReactNode, warband: UserWarband }> = ({ children, warband }) => {
    const [wb, setWarband] = useState<UserWarband | null>(warband);

    return (
        <WarbandContext.Provider value={{ warband: wb, setWarband }}>
            {children}
        </WarbandContext.Provider>
    );
};

export const useWarband = () => {
    const context = useContext(WarbandContext);
    if (!context) throw new Error('useWarband must be used within WarbandProvider');
    return context;
};
