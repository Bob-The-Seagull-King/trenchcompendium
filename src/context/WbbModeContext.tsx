import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

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
        if (!isOwner && (newMode === 'edit')) {
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

    // Toggle body class depending on play_mode
    useEffect(() => {
        if (value.play_mode) {
            document.body.classList.add('play-mode');
        } else {
            document.body.classList.remove('play-mode');
        }

        // Cleanup: always remove on unmount
        return () => {
            document.body.classList.remove('play-mode');
        };
    }, [value.play_mode]);

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
