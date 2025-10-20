// context/CampaignContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode,
    useRef,
} from "react";
import { SYNOD } from "../resources/api-constants";
import { Campaign, ICampaign } from "../classes/saveitems/Campaign/Campaign";
import { CampaignFactory } from "../factories/warband/CampaignFactory";

type CampaignContextType = {
    campaign: Campaign | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

type ProviderProps = {
    children: ReactNode;
    campaignId: number;
};

export const CampaignProvider: React.FC<ProviderProps> = ({ children, campaignId }) => {

    // Hold exactly one Campaign instance for the provider lifetime.
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Force consumers to rerender after mutating the same instance
    const [version, setVersion] = useState(0);

    // Keep the latest abort controller to cancel in-flight fetches on id change/unmount
    const abortRef = useRef<AbortController | null>(null);

    const reload = useCallback(async () => {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            const obj = await CampaignFactory.GetCampaignPublicByID(campaignId);
            setCampaign(obj);
        } catch (e: any) {
            if (e?.name !== "AbortError") setError(e?.message ?? "Failed to load campaign.");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [campaignId]); // <-- nur campaignId

    // Initial load + reload on id change
    useEffect(() => {
        if (!campaignId) return;
        reload();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [campaignId, reload]);

    return (
        <CampaignContext.Provider
            value={{
                campaign: campaign ?? null,
                loading,
                error,
                reload,
            }}
            // Consumers will re-render when loading/error change or when `reload()` bumps data via setVersion.
            // `version` is not in the value to keep a stable reference; UI updates via state above.
        >
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = (): CampaignContextType => {
    const ctx = useContext(CampaignContext);
    if (!ctx) throw new Error("useCampaign must be used within a CampaignProvider");
    return ctx;
};
