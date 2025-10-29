// src/display/components/Promotion.tsx
import React from "react";

export type PromotionApiItem = {
    post_id: number;
    is_valid: boolean;
    content_id: string;
    image_id: number;
    image_urls: Record<string, string>;
    link: string;
};


type PromotionProps = {
    item: PromotionApiItem;
    className?: string;
};


const Promotion: React.FC<PromotionProps> = ({ item, className }) => {

    return (
        <a className={'Promotion'} href={item.link} target="_blank" rel="noopener noreferrer nofollow">
            <img src={item.image_urls.medium_large} />
        </a>
    );
};

export default Promotion;
