import React, { createContext, useContext } from 'react';

interface PlayModeContextType {
    playMode: boolean;
    togglePlayMode: () => void;
    viewmode: boolean
}

const PlayModeContext = createContext<PlayModeContextType | undefined>(undefined);

export const PlayModeProvider: React.FC<{
    children: React.ReactNode;
    value: PlayModeContextType;
}> = ({ children, value }) => (
    <PlayModeContext.Provider value={value}>
        {children}
    </PlayModeContext.Provider>
);

export const usePlayMode = () => {
    const context = useContext(PlayModeContext);
    if (!context) throw new Error('usePlayMode must be used within PlayModeProvider');
    return context;
};
