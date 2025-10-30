// src/display/components/PromotionsSet.tsx
import React from "react";
import {SYNOD} from "../../../resources/api-constants";
import Promotion from "./Promotion";

type PromotionsSetProps = {
    content_id: string;
};

type PromotionApiItem = {
    post_id: number;
    is_valid: boolean;
    content_id: string;
    image_id: number;
    image_urls: Record<string, string>;
    link: string;
};

const PromotionsSet: React.FC<PromotionsSetProps> = ({ content_id }) => {
    const [items, setItems] = React.useState<PromotionApiItem[] | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!content_id) {
            setItems([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const url = `${SYNOD.URL}/wp-json/synod/v1/promotions/${encodeURIComponent(content_id)}`;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(url, {
                    method: "GET",
                    credentials: "same-origin",
                    signal: controller.signal,
                    headers: {
                        "Accept": "application/json",
                    },
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`HTTP ${res.status} – ${txt || res.statusText}`);
                }

                const data = (await res.json()) as unknown;
                const arr = Array.isArray(data) ? (data as PromotionApiItem[]) : [];
                setItems(arr);
            } catch (e: any) {
                if (e?.name === "AbortError") return;
                setError(e?.message || "Failed to load promotions.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [content_id]);

    if (!content_id) return null;

    if( loading || !items || (items && items.length === 0) ){
        return null;
    }

    return (
        <div className={'PromotionsSet'} id={'Promotions'}>
            <h2>{'Promotions'}</h2>

            <div className={'row'}>
                {items.map((item, idx) => (
                    <div className={'col-12 col-md-6'} key={idx}>
                        <Promotion
                            item={item}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromotionsSet;
