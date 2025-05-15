// Hook: useSynodFactionImageData
import React from 'react';
import { useEffect, useState } from 'react';

/**
 * Gets synod image data for a faction by its slug
 */

interface FactionImageData {
    url: string;
    sourceTitle: string;
    sourceUrl: string;
    imageId: number;
    factionName: string;
    factionId: number;
    loading: boolean;
    error: boolean;
}

// in-memory cache
const factionImageCache: Record<string, FactionImageData> = {};

export function useSynodFactionImageData(factionSlug: string, size = 'full'): FactionImageData {
    const [data, setData] = useState<FactionImageData>(() => {
        return factionImageCache[factionSlug] || {
            url: '',
            sourceTitle: '',
            sourceUrl: '',
            imageId: 0,
            factionName: '',
            factionId: 0,
            loading: true,
            error: false,
        };
    });

    useEffect(() => {
        if (!factionSlug) return;
        if (factionImageCache[factionSlug]) {
            setData({ ...factionImageCache[factionSlug], loading: false });
            return;
        }

        const synodUrl = 'https://synod.trench-companion.com/';

        fetch(`${synodUrl}wp-json/synod/v1/faction-image/${factionSlug}`)
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((json) => {
                const sizes = json.image?.media_details?.sizes;
                const sizedImage = sizes?.[size]?.source_url;

                const result: FactionImageData = {
                    url: sizedImage || json.image?.source_url || '',
                    sourceTitle: json.image?.meta?.attachment_source_title || '',
                    sourceUrl: json.image?.meta?.attachment_source || '',
                    imageId: json.image?.id || 0,
                    factionName: json.faction_name || '',
                    factionId: json.faction_id || 0,
                    loading: false,
                    error: !json.image || !json.image?.source_url,
                };

                factionImageCache[factionSlug] = result;
                setData(result);
            })
            .catch(() => {
                setData(prev => ({ ...prev, loading: false, error: true }));
            });
    }, [factionSlug, size]);

    return data;
}
