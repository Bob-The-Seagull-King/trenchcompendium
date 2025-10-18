import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingOverlay from "../generics/Loading-Overlay";
import STL_PromoItem from "./STL_PromoItem";
import {SYNOD} from "../../../resources/api-constants";

interface FighterStlListProps {
    model_slug: string;
    isOpen: boolean; // <-- control fetching via parent collapse
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

const FighterSTL_List: React.FC<FighterStlListProps> = ({ model_slug = "", isOpen }) => {
    const [isLoading, setIsLoading] = useState(false); // start idle; fetch only when opened
    const [hasResults, setHasResults] = useState(true);
    const [data, setData] = useState<PromotionsResponse>(EMPTY_PROMOTIONS);

    // Prevent repeat fetches for the same slug while open toggles
    const fetchedForSlugRef = useRef<string>("");

    // Build endpoint URL once per slug (uses global SYNOD)
    const endpoint = useMemo(() => {
        if (!model_slug) return "";
        return `${SYNOD.URL}/wp-json/synod/v1/stl-promotions-by-model/${encodeURIComponent(model_slug)}`;
    }, [model_slug]);

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

    // Load exactly once per model_slug, but only when the parent is open
    useEffect(() => {
        // If closed or missing inputs, do nothing (no fetch)
        if (!isOpen) return;

        // Reset if slug changed since last time
        if (fetchedForSlugRef.current !== model_slug) {
            setData(EMPTY_PROMOTIONS);
            setHasResults(true);
        }

        if (!model_slug || !endpoint) {
            setHasResults(false);
            return;
        }

        // Avoid refetch for the same slug if we already did it
        if (fetchedForSlugRef.current === model_slug) return;

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
                fetchedForSlugRef.current = model_slug; // mark this slug as fetched once
            }
        })();

        return () => controller.abort();
    }, [isOpen, model_slug, endpoint, normalizePayload, computeHasResults]);

    // If the slug changes while closed, clear state so opening triggers a fresh load
    useEffect(() => {
        if (!isOpen) {
            fetchedForSlugRef.current = "";
            setData(EMPTY_PROMOTIONS);
            setHasResults(true);
            setIsLoading(false);
        }
    }, [model_slug, isOpen]);

    const bucketname = (bucket: string) => {
        if(bucket == 'self') {
            return 'This Model'
        }
        if(bucket == 'parent') {
            return 'Main Model';
        }
        if(bucket == 'children') {
            return 'Variants'
        }
        if(bucket == 'siblings') {
            return 'Related';
        }
    }

    return (
        <div className="FighterSTL_List">
            {isLoading ? (
                <LoadingOverlay
                    message={'Loading STL Files'}
                />
            ) : hasResults ? (
                <div className="stl-results">
                    {/* Loop over buckets, then items; item rendering is delegated */}
                    {BUCKETS.map((bucket, index) => (
                        <React.Fragment key={index}>
                            {data[bucket].length > 0 &&
                                <div
                                    key={`section-${index}`}
                                    className="stl-results-section"
                                >
                                    { bucket != 'self' &&
                                        <h3 className={'stl-results-section-headline'}>
                                            {bucketname(bucket)}
                                        </h3>
                                    }

                                    <div className={'stl-results-section-grid'}>
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
                            }
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <>No results</>
            )}
        </div>
    );
};

export default FighterSTL_List;
