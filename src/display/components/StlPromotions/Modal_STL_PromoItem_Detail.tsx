import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCartShopping, faDownload, faXmark} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import {SYNOD} from "../../../resources/api-constants";
import LoadingOverlay from "../generics/Loading-Overlay";
import STL_Creator_Name from "./STL_Creator_Name";


interface Modal_STL_PromoItem_DetailProps {
    promo_id: number;
    show: boolean;       // controlled: visible or not
    onClose: () => void; // controlled: close handler from parent
}

type CreatorInfo = {
    creator_name?: string;
    creator_id?: number;
    creator_thumbnail_url?: string;
};

type PromotionDetail = {
    id: number;
    name?: string;
    thumbnail_url?: string;
    thumbnail_id?: number;
    model_id?: number;
    details_link?: string;
    description?: string;
    gallery_ids?: number[];
    gallery_urls?: string[];
    creator_id?: number;
    creator?: CreatorInfo;
};

const Modal_STL_PromoItem_Detail: React.FC<Modal_STL_PromoItem_DetailProps> = ({ promo_id = 0, show, onClose }) => {
    // Loading & data state
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PromotionDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Prevent re-fetch while toggling the same promo_id
    const fetchedForIdRef = useRef<number | null>(null);

    const endpoint = useMemo(() => {
        if (!promo_id) return "";
        return `${SYNOD.URL}/wp-json/synod/v1/stl-promotion-detail/${encodeURIComponent(String(promo_id))}`;
    }, [promo_id]);

    // Normalizes any server payload to our typed shape
    const normalize = (raw: any): PromotionDetail => {
        const galleryUrls: string[] = Array.isArray(raw?.gallery_urls)
            ? raw.gallery_urls.filter((u: any) => typeof u === "string" && u.length > 0)
            : [];

        const galleryIds: number[] = Array.isArray(raw?.gallery_ids)
            ? raw.gallery_ids.map((v: any) => parseInt(v, 10)).filter((v: any) => Number.isInteger(v) && v > 0)
            : [];

        const creator: CreatorInfo | undefined = raw?.creator && typeof raw.creator === "object"
            ? {
                creator_name: typeof raw.creator.creator_name === "string" ? raw.creator.creator_name : undefined,
                creator_id: Number.isInteger(raw.creator.creator_id) ? raw.creator.creator_id : undefined,
                creator_thumbnail_url: typeof raw.creator.creator_thumbnail_url === "string"
                    ? raw.creator.creator_thumbnail_url
                    : undefined,
            }
            : undefined;

        return {
            id: Number(raw?.id ?? promo_id),
            name: typeof raw?.name === "string" ? raw.name : "",
            thumbnail_url: typeof raw?.thumbnail_url === "string" ? raw.thumbnail_url : "",
            thumbnail_id: Number.isInteger(raw?.thumbnail_id) ? raw.thumbnail_id : undefined,
            model_id: Number.isInteger(raw?.model_id) ? raw.model_id : undefined,
            details_link: typeof raw?.details_link === "string" ? raw.details_link : "",
            description: typeof raw?.description === "string" ? raw.description : "",
            gallery_ids: galleryIds,
            gallery_urls: galleryUrls,
            creator_id: Number.isInteger(raw?.creator_id) ? raw.creator_id : undefined,
            creator,
        };
    };

    // Fetch once when opened; do nothing when closed
    useEffect(() => {
        // Guard: closed, invalid id, or missing endpoint
        if (!show || !promo_id || !endpoint) return;

        // Avoid refetch for the same id while the component stays mounted
        if (fetchedForIdRef.current === promo_id) return;

        const controller = new AbortController();

        (async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(endpoint, { method: "GET", signal: controller.signal });
                if (!res.ok) throw new Error(String(res.status));
                const json = await res.json();

                const normalized = normalize(json);
                setData(normalized);
            } catch (e) {
                setError("Failed to load promotion details.");
                setData(null);
            } finally {
                setIsLoading(false);
                fetchedForIdRef.current = promo_id;
            }
        })();

        // Cleanup: abort fetch if modal unmounts/closes mid-flight
        return () => controller.abort();
    }, [show, promo_id, endpoint]); // eslint-disable-line react-hooks/exhaustive-deps

    // When promo_id changes (to a different item), allow re-fetch next time it opens
    useEffect(() => {
        if (!show) {
            fetchedForIdRef.current = null;
            setData(null);
            setError(null);
            setIsLoading(false);
        } else {
            // If already open and the id changes (rare), reset and refetch in the effect above
            fetchedForIdRef.current = null;
            setData(null);
            setError(null);
        }
    }, [promo_id, show]);

    return (
        <Modal show={show} onHide={onClose} className="Modal_STL_PromoItem_Detail" centered>
            <Modal.Body>
                <div className={'close-btn'}
                     onClick={(e) => {
                         e.stopPropagation();
                         onClose();
                     }}
                     role="button"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="modal-close-icon"
                    />
                </div>

                {isLoading &&
                    <LoadingOverlay
                        message={'Loading Details'}
                    />
                }

                {!isLoading && error && (
                    <div className="stl-detail-error">
                        {error}
                    </div>
                )}

                {!isLoading && !error && data && (
                    <div className="stl-detail-wrap">
                        {/* Thumbnail */}
                        {data.thumbnail_url && (
                            <div className="stl-detail-thumb">
                                <img
                                    src={data.thumbnail_url}
                                    alt={data.name || "STL thumbnail"}
                                    style={{ width: "100%", height: "auto", borderRadius: 8 }}
                                />
                            </div>
                        )}

                        { data.name != '' &&
                            <h4 className={'stl-detail-name'}>
                                {data.name}
                            </h4>
                        }


                        {/* Creator */}
                        {(data.creator?.creator_name && data.creator?.creator_thumbnail_url) && (
                            <STL_Creator_Name
                                creator_name={data.creator.creator_name}
                                thumbnail_url={data.creator.creator_thumbnail_url}
                            />
                        )}

                        {/* Details link */}
                        {data.details_link && (
                            <div className="stl-detail-link-wrap">
                                <a
                                    href={data.details_link}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="btn btn-primary stl-detail-link"
                                >
                                    <FontAwesomeIcon icon={faCartShopping} className={'me-2'} />
                                    {'Go to store'}
                                </a>
                            </div>
                        )}

                        {/* Description */}
                        {data.description && (
                            <div className="stl-detail-description" style={{ marginTop: 16 }}>
                                {data.description}
                            </div>
                        )}

                        {/* Gallery */}
                        {data.gallery_urls && data.gallery_urls.length > 0 && (
                            <div className="stl-detail-gallery">
                                <h4>Gallery</h4>
                                {data.gallery_urls.map((url, idx) => (
                                    <div
                                        key={`gal-${data.id}-${idx}`}
                                        className="stl-detail-gallery-item">
                                        <img
                                            src={url}
                                            alt={`${data.name || "Gallery image"} ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default Modal_STL_PromoItem_Detail;
