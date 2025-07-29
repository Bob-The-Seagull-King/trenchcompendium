import React, {createContext, useContext, useEffect, useState} from 'react';

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

    useEffect(() => {
        function handleDocumentClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            if (!target.closest('.image-credit-popover') && !target.closest('.image-credit')) {
                setActiveId(null);
            }
        }

        if (activeId !== null) {
            document.addEventListener('mousedown', handleDocumentClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [activeId]);

    return (
        <ImageCreditPopoverContext.Provider value={{ activeId, setActiveId }}>
            {children}
        </ImageCreditPopoverContext.Provider>
    );
};

export const useImageCreditPopover = () => useContext(ImageCreditPopoverContext);