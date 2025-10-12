import React, { useState } from "react";
import Modal_STL_PromoItem_Detail from "./Modal_STL_PromoItem_Detail";

interface STL_PromoItemProps {
    thumbnail_url: string;
    name: string;
    creator_name: string;
    promo_id: number;
}

const STL_PromoItem: React.FC<STL_PromoItemProps> = ({ thumbnail_url = "", name= "", creator_name ="", promo_id = 0 }) => {
    // Controls the detail modal visibility
    const [showDetails, setShowDetails] = useState(false);

    // NOTE: Open modal on card click
    const handleOpen = () => setShowDetails(true);
    const handleClose = () => setShowDetails(false);

    return (
        <div className="STL_PromoItem" onClick={handleOpen}>
            <div className="promo-thumbnail-wrap">
                <img src={thumbnail_url} className="promo-thumbnail" alt={name} />
            </div>

            <div className="name">{name}</div>
            <div className="creator-name">{creator_name}</div>

            {/* Controlled modal */}
            <Modal_STL_PromoItem_Detail
                promo_id={promo_id}
                show={showDetails}
                onClose={handleClose}
            />
        </div>
    );
};

export default STL_PromoItem;
