// Hook: useSynodFactionImageData
import { FactionImageData, SynodImageCache } from '../classes/_high_level_controllers/SynodImageCache';
import React from 'react';
import { useEffect, useState } from 'react';

const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

export function useSynodFactionImageData(factionSlug: string, size = 'full'): FactionImageData {
    const [data, setData] = useState<FactionImageData>(() => {
        const synodcache : SynodImageCache = SynodImageCache.getInstance();
        return synodcache.imageFactionCache[factionSlug] || {
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
        
        async function runImageCheck() {
            if (!factionSlug) return;
            const synodcache : SynodImageCache = SynodImageCache.getInstance();

            if (synodcache.CheckFactionCache(factionSlug)) {
                setData({ ...synodcache.imageFactionCache[factionSlug], loading: false });
                return;
            }

            const synodUrl = 'https://synod.trench-companion.com/';

            if (synodcache.CheckFactionCallCache(factionSlug)) {    
                const EMERGENCY_OUT = 1000; // If we spend 100 seconds on one image, just give up
                let count_check = 0;
                while ((!synodcache.CheckFactionCache(factionSlug)) && (count_check < EMERGENCY_OUT)) {
                    await delay(100);
                    count_check += 1;
                }                   
                setData(synodcache.imageFactionCache[factionSlug])
            }

            if (!synodcache.CheckFactionCache(factionSlug)) {
                synodcache.AddFactionCallCache(factionSlug);
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

                        synodcache.imageFactionCache[factionSlug] = result;
                        setData(result);
                    })
                    .catch(() => {
                        setData(prev => ({ ...prev, loading: false, error: true }));
                    });
            }
        }

        runImageCheck();
    }, [factionSlug, size]);

    return data;
}
