import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PrintModeContextType {
    printMode: boolean;
    setPrintMode: (mode: boolean) => void;
}

const PrintModeContext = createContext<PrintModeContextType | undefined>(undefined);

export const PrintModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [printMode, setPrintMode] = useState(false);

    return (
        <PrintModeContext.Provider value={{ printMode, setPrintMode }}>
            {children}
        </PrintModeContext.Provider>
    );
};

export const usePrintMode = () => {
    const context = useContext(PrintModeContext);
    if (!context) {
        throw new Error('usePrintMode must be used inside a PrintModeProvider');
    }
    return context;
};