import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserWarband } from '../classes/saveitems/Warband/UserWarband';
import { SumWarband } from '../classes/saveitems/Warband/WarbandManager';

interface WarbandContextType {
    warband: SumWarband | null;
    setWarband: (wb: SumWarband | null) => void;
    reloadDisplay: () => void;
    updateKey : number;
    modalIsOpen: boolean; // can be used to disable things based on if overlays are open
    setModalIsOpen: (open: boolean) => void;
}

const WarbandContext = createContext<WarbandContextType | undefined>(undefined);

export const WarbandProvider: React.FC<{ children: ReactNode, warband: SumWarband }> = ({ children, warband }) => {
    const [wb, setWarband] = useState<SumWarband | null>(warband);
    const [statekey, setstatekey] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const reloadDisplay = () => {
        if (wb != null) {
            wb.warband_data.DumpCache();
        }
        setstatekey(statekey + 1)
    }

    return (
        <WarbandContext.Provider value={{
            warband: wb,
            setWarband,
            reloadDisplay,
            updateKey: statekey,
            modalIsOpen,
            setModalIsOpen
        }} >
            <div className='boundary-warband-provider' key={statekey}>

            </div>
            {children}
        </WarbandContext.Provider>
    );
};

/* Use this when warband will 100% be defined */
export const useWarband = () => {
    const context = useContext(WarbandContext);
    if (!context) throw new Error('useWarband must be used within WarbandProvider');
    return context;
};

/* Use this when warband may be undefined */
export const useOptionalWarband = () => useContext(WarbandContext);