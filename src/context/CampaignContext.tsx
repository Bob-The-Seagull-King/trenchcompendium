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
    reloadCampaignDisplay: () => void;
    updateCampaignKey : number;
    ensureHydrated: () => Promise<void>;
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

type ProviderProps = {
    children: ReactNode;
    campaignId: number;
    hydrate?: boolean; // If true, load the campaign fully-hydrated. If false, load a lightweight summary
};

export const CampaignProvider: React.FC<ProviderProps> = ({ children, campaignId, hydrate = false }) => {

    // freeze the initial preference for this provider instance
    const initialHydrateRef = React.useRef(hydrate);

    // Hold exactly one Campaign instance for the provider lifetime.
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // UI state
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [statekey, setstatekey] = useState(0);

    const reloadCampaignDisplay = () => {
        setstatekey(statekey + 1)
    }

    // Force consumers to rerender after mutating the same instance
    const [version, setVersion] = useState(0);

    // Keep the latest abort controller to cancel in-flight fetches on id change/unmount
    const abortRef = useRef<AbortController | null>(null);

    const reload = useCallback(async () => {

        console.log('triggered data reload');
        console.log('hydrate');
        console.log(hydrate);

        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        setError(null);

        console.log('initialHydrateRef.current');
        console.log(initialHydrateRef.current);

        try {
            const obj = await CampaignFactory.GetCampaignPublicByID(
                campaignId,
                { force: true },
                initialHydrateRef.current
            );
            setCampaign(obj);
            // Mark UI to re-render even if the reference is the same.
            setVersion(v => v + 1);
        } catch (e: any) {
            if (e?.name !== "AbortError") setError(e?.message ?? "Failed to load campaign.");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [campaignId]);

    // Initial load + reload on id change
    useEffect(() => {
        if (!campaignId) return;

        console.log('!campaignId reload');

        reload();
        return () => {
            if (abortRef.current) abortRef.current.abort();
        };
    }, [campaignId, reload]);

    // --- on-demand hydration upgrade for this instance ---
    const ensureHydrated = useCallback(async () => {

        console.log('ensureHydrated runs ')
        // If already hydrated or no instance, do nothing.
        if (!campaign || campaign.isHydrated) return;

        console.log('ensureHydrated loads')

        setLoading(true);
        try {
            // Upgrade the very same instance in place (keeps object identity stable).
            await CampaignFactory.Rehydratecampaign(campaign);
            // Mark UI to re-render even if the reference is the same.
            setVersion(v => v + 1);
        } catch (e) {
            // Swallow or setError if you want to surface a message
            console.error("Failed to hydrate campaign:", e);
        } finally {
            setLoading(false);
        }
    }, [campaign]);

    return (
        <CampaignContext.Provider
            value={{
                campaign: campaign ?? null,
                loading,
                reloadCampaignDisplay,
                updateCampaignKey : statekey,
                error,
                reload,
                ensureHydrated,
            }}
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
