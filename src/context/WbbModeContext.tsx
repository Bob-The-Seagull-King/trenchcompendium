import React, { createContext, useContext, useMemo, useState } from 'react';

type ModeType = 'view' | 'edit' | 'play' | 'print';

interface WbbModeContextType {
    mode: ModeType;
    setMode: (mode: ModeType) => void;
    view_mode: boolean;
    edit_mode: boolean;
    play_mode: boolean;
    print_mode: boolean;
    isOwner: boolean;
}

const WbbModeContext = createContext<WbbModeContextType | undefined>(undefined);

export const WbbModeProvider: React.FC<{
    children: React.ReactNode;
    isOwner: boolean;
}> = ({ children, isOwner }) => {
    const [mode, _setMode] = useState<ModeType>(isOwner ? 'edit' : 'view');

    const setMode = (newMode: ModeType) => {
        if (!isOwner && (newMode === 'edit' || newMode === 'play')) {
            _setMode('view');
        } else {
            _setMode(newMode);
        }
    };

    const value = useMemo(() => ({
        mode,
        setMode,
        view_mode: mode === 'view',
        edit_mode: mode === 'edit',
        play_mode: mode === 'play',
        print_mode: mode === 'print',
        isOwner
    }), [mode, isOwner]);

    return (
        <WbbModeContext.Provider value={value}>
            {children}
        </WbbModeContext.Provider>
    );
};

export const useWbbMode = () => {
    const context = useContext(WbbModeContext);
    if (!context) throw new Error('useWbbMode must be used within WbbModeProvider');
    return context;
};
