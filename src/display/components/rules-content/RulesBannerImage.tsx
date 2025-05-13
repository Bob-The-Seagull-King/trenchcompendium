// RulesBannerImage.tsx
import React from 'react';
import SynodImage from "../../../utility/SynodImage";

interface RulesBannerImageProps {
    imageId: number;
    linkUrl: string;
    linkText: string;
}

const RulesBannerImage: React.FC<RulesBannerImageProps> = ({ imageId, linkUrl, linkText }) => {
    if (!imageId || !linkUrl || !linkText) return null;

    return (
        <a className={'RulesBannerImage'} href={linkUrl} >
            <SynodImage
                imageId={imageId}
                size="large"
                className="rules-banner-image-element"
            />

            <span className={'link-text'}>
                {linkText}
            </span>
        </a>
    );
};

export default RulesBannerImage;