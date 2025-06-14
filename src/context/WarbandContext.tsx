import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserWarband } from '../classes/saveitems/Warband/UserWarband';
import { SumWarband } from '../classes/saveitems/Warband/WarbandManager';

interface WarbandContextType {
    warband: SumWarband | null;
    setWarband: (wb: SumWarband | null) => void;
    reloadDisplay: () => void;
    updateKey : number;
}

const WarbandContext = createContext<WarbandContextType | undefined>(undefined);

export const WarbandProvider: React.FC<{ children: ReactNode, warband: SumWarband }> = ({ children, warband }) => {
    const [wb, setWarband] = useState<SumWarband | null>(warband);
    const [statekey, setstatekey] = useState(0);

    const reloadDisplay = () => {
        setstatekey(statekey + 1)
    }

    return (
        <WarbandContext.Provider value={{ warband: wb, setWarband, reloadDisplay, updateKey: statekey}} >
            <div className='boundary-warband-provider' key={statekey}>

            </div>
            {children}
        </WarbandContext.Provider>
    );
};

export const useWarband = () => {
    const context = useContext(WarbandContext);
    if (!context) throw new Error('useWarband must be used within WarbandProvider');
    return context;
};
