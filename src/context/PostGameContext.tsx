import React, { createContext, useContext, useState } from "react";

// --- Shape of Post Game Data ---
export interface GloriousDeed {
    id: string;
    name: string;
}

interface PostGameContextValue {
    gloriousDeeds: GloriousDeed[];
    setGloriousDeeds: React.Dispatch<React.SetStateAction<GloriousDeed[]>>;
    hasWon: boolean;
    setHasWon: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostGameContext = createContext<PostGameContextValue | undefined>(undefined);

export const PostGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gloriousDeeds, setGloriousDeeds] = useState<GloriousDeed[]>([]);
    const [hasWon, setHasWon] = useState<boolean>(false);

    return (
        <PostGameContext.Provider value={{ gloriousDeeds, setGloriousDeeds, hasWon, setHasWon }}>
            {children}
        </PostGameContext.Provider>
    );
};

export const usePostGame = () => {
    const ctx = useContext(PostGameContext);
    if (!ctx) {
        throw new Error("usePostGame must be used within PostGameProvider");
    }
    return ctx;
};

export default PostGameContext;
