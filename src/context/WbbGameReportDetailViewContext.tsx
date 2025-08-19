// context/WbbGameReportDetailViewContext.tsx
import React, { createContext, useContext, useState } from "react";

// Types
export interface Warband {
    id: string;
    name: string;
    victoryPoints: number;
}

export interface DeedAssignment {
    deedId: string;
    warbandId: string;
}

export interface GameDetails {
    scenario: string;
    deployment: string;
    winnerId: string;
    date: string;
    notes: string;
}

interface WbbGameReportDetailViewState {
    warbands: Warband[];
    gameDetails: GameDetails;
    deeds: DeedAssignment[];
}

interface WbbGameReportDetailViewContextValue {
    state: WbbGameReportDetailViewState;
    addWarband: (id: string, name: string) => void;
    removeWarband: (id: string) => void;
    setWarbandVictoryPoints: (id: string, points: number) => void; // renamed for clarity
    setGameDetails: (details: Partial<GameDetails>) => void;
    setDeeds: React.Dispatch<React.SetStateAction<DeedAssignment[]>>;
    setGameNotes: (notes: string) => void;
}

// Context
const WbbGameReportDetailViewContext =
    createContext<WbbGameReportDetailViewContextValue | undefined>(undefined);

export const useWbbGameReportDetailView = () => {
    const ctx = useContext(WbbGameReportDetailViewContext);
    if (!ctx) {
        throw new Error(
            "useWbbGameReportDetailView must be used within WbbGameReportDetailViewProvider"
        );
    }
    return ctx;
};

// Provider
export const WbbGameReportDetailViewProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                             children,
                                                                                         }) => {
    const [warbands, setWarbands] = useState<Warband[]>([]);
    const [gameDetails, setGameDetailsState] = useState<GameDetails>({
        scenario: "",
        deployment: "",
        winnerId: "",
        date: "",
        notes: "",
    });
    const [deeds, setDeeds] = useState<DeedAssignment[]>([]);

    const addWarband = (id: string, name: string) => {
        setWarbands((prev) => [...prev, { id, name, victoryPoints: 0 }]);
    };

    const removeWarband = (id: string) => {
        setWarbands((prev) => prev.filter((w) => w.id !== id));
        setDeeds((prev) => prev.filter((d) => d.warbandId !== id));
    };

    const setWarbandVictoryPoints = (id: string, points: number) => {
        setWarbands((prev) =>
            prev.map((w) => (w.id === id ? { ...w, victoryPoints: points } : w))
        );
    };

    const setGameDetails = (details: Partial<GameDetails>) => {
        setGameDetailsState((prev) => ({ ...prev, ...details }));
    };

    const setGameNotes = (notes: string) => {
        setGameDetailsState((prev) => ({ ...prev, notes }));
    };

    return (
        <WbbGameReportDetailViewContext.Provider
            value={{
                state: { warbands, gameDetails, deeds },
                addWarband,
                removeWarband,
                setWarbandVictoryPoints,
                setGameDetails,
                setDeeds,
                setGameNotes,
            }}
        >
            {children}
        </WbbGameReportDetailViewContext.Provider>
    );
};