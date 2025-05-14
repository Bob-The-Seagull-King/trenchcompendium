// RulesBannerImage.tsx
import React from 'react';
import SynodImage from "../../../utility/SynodImage";
import { useNavigate } from 'react-router-dom';

interface RulesBannerImageProps {
    imageId: number;
    linkUrl: string;
    linkText: string;
}

const RulesBannerImage: React.FC<RulesBannerImageProps> = ({ imageId, linkUrl, linkText }) => {
    if (!imageId || !linkUrl || !linkText) return null;

    const navigate = useNavigate();
    return (
        <CustomNavLink link={linkUrl}
                        runfunc={() => {
                            navigate(linkUrl)
                        }}
                        classes={'RulesBannerImage'}  >
            <SynodImage
                imageId={imageId}
                size="large"
                className="rules-banner-image-element"
            />

            <span className={'link-text'}>
                {linkText}
            </span>
        </CustomNavLink>
    );
};

export default RulesBannerImage;