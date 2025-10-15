import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingOverlay from "../generics/Loading-Overlay";
import STL_PromoItem from "./STL_PromoItem";
import { SYNOD } from "../../../resources/api-constants";

interface FighterStlListProps {
    model_slug: string;
    faction_slug: string;   // optional; pass '' if none
    isOpen: boolean;        // controls fetching via parent collapse
}

type PromoItem = {
    id: number;
    name: string;
    thumbnail_url: string;
    creator_name: string;
};

type PromotionsResponse = {
    self: PromoItem[];
    parent: PromoItem[];
    children: PromoItem[];
    siblings: PromoItem[];
};

const EMPTY_PROMOTIONS: PromotionsResponse = {
    self: [],
    parent: [],
    children: [],
    siblings: [],
};

// Render order for buckets
const BUCKETS: Array<keyof PromotionsResponse> = ["self", "parent", "children", "siblings"];

const FighterSTL_List: React.FC<FighterStlListProps> = ({ model_slug = "", faction_slug = "", isOpen }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasResults, setHasResults] = useState(true);
    const [data, setData] = useState<PromotionsResponse>(EMPTY_PROMOTIONS);

    // Track which (model_slug + faction_slug) we already fetched
    const fetchedForRef = useRef<string>("");

    // Build endpoint URL (SYNOD is absolute, safe for URL constructor)
    const endpoint = useMemo(() => {
        if (!model_slug) return "";
        const url = new URL(
            `${SYNOD.URL}/wp-json/synod/v1/stl-promotions-by-model/${encodeURIComponent(model_slug)}`
        );
        // Append optional faction filter
        if (faction_slug && faction_slug.trim().length > 0) {
            url.searchParams.set("faction_slug", faction_slug.trim());
        }
        return url.toString();
    }, [model_slug, faction_slug]);

    // Composite fetch key (ensures refetch when faction changes)
    const fetchKey = useMemo(() => {
        if (!model_slug) return "";
        return `${model_slug}::${faction_slug || ""}`;
    }, [model_slug, faction_slug]);

    // Normalize any unknown server response into our stable shape
    const normalizePayload = useCallback((raw: any): PromotionsResponse => {
        return {
            self: Array.isArray(raw?.self) ? raw.self : [],
            parent: Array.isArray(raw?.parent) ? raw.parent : [],
            children: Array.isArray(raw?.children) ? raw.children : [],
            siblings: Array.isArray(raw?.siblings) ? raw.siblings : [],
        };
    }, []);

    const computeHasResults = useCallback((d: PromotionsResponse) => {
        return d.self.length + d.parent.length + d.children.length + d.siblings.length > 0;
    }, []);

    // Load exactly once per (model_slug + faction_slug), but only when the parent is open
    useEffect(() => {
        // Do nothing if closed or inputs missing
        if (!isOpen || !model_slug || !endpoint) return;

        // If key changed, reset optimistic state before fetching
        if (fetchedForRef.current !== fetchKey) {
            setData(EMPTY_PROMOTIONS);
            setHasResults(true);
        }

        // Avoid refetch for the same key
        if (fetchedForRef.current === fetchKey) return;

        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            try {
                const res = await fetch(endpoint, { method: "GET", signal: controller.signal });
                if (!res.ok) throw new Error(String(res.status));
                const json = await res.json();
                const normalized = normalizePayload(json);

                setData(normalized);
                setHasResults(computeHasResults(normalized));
            } catch {
                // Any failure => treat as "no results"
                setData(EMPTY_PROMOTIONS);
                setHasResults(false);
            } finally {
                setIsLoading(false);
                fetchedForRef.current = fetchKey; // mark this combo as fetched
            }
        })();

        return () => controller.abort();
    }, [isOpen, model_slug, faction_slug, endpoint, fetchKey, normalizePayload, computeHasResults]);

    // If the slug or faction changes while closed, clear so next open triggers a fresh load
    useEffect(() => {
        if (!isOpen) {
            fetchedForRef.current = "";
            setData(EMPTY_PROMOTIONS);
            setHasResults(true);
            setIsLoading(false);
        }
    }, [model_slug, faction_slug, isOpen]);

    const bucketname = (bucket: string) => {
        if (bucket === "self") return "This Model";
        if (bucket === "parent") return "Main Model";
        if (bucket === "children") return "Variants";
        if (bucket === "siblings") return "Related";
        return "";
    };

    return (
        <div className="FighterSTL_List">
            {isLoading ? (
                <LoadingOverlay message={"Loading STL Files"} />
            ) : hasResults ? (
                <div className="stl-results">
                    {/* Loop over buckets, then items; item rendering is delegated */}
                    {BUCKETS.map((bucket) =>
                        data[bucket].length > 0 ? (
                            <div key={`section-${bucket}`} className="stl-results-section">
                                {bucket !== "self" && (
                                    <h3 className={"stl-results-section-headline"}>{bucketname(bucket)}</h3>
                                )}
                                <div className={"stl-results-section-grid"}>
                                    {data[bucket].map((item) => (
                                        <STL_PromoItem
                                            key={`promo-${item.id}`}
                                            thumbnail_url={item.thumbnail_url}
                                            creator_name={item.creator_name}
                                            name={item.name}
                                            promo_id={item.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            ) : (
                <>No results</>
            )}
        </div>
    );
};

export default FighterSTL_List;
