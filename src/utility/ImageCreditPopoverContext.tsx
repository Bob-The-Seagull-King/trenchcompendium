import React, { createContext, useContext, useState } from 'react';

interface ImageCreditPopoverContextType {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

const ImageCreditPopoverContext = createContext<ImageCreditPopoverContextType>({
    activeId: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setActiveId: () => {},
});

export const ImageCreditPopoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <ImageCreditPopoverContext.Provider value={{ activeId, setActiveId }}>
            {children}
        </ImageCreditPopoverContext.Provider>
    );
};

export const useImageCreditPopover = () => useContext(ImageCreditPopoverContext);