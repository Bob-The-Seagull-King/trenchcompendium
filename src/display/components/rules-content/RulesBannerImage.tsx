// RulesBannerImage.tsx
import React from 'react';
import SynodImage from "../../../utility/SynodImage";
import { useNavigate } from 'react-router-dom';
import CustomNavLink from '../subcomponents/interactables/CustomNavLink';

interface RulesBannerImageProps {
    imageId: number;
    linkUrl: string;
    linkText: string;
}

const RulesBannerImage: React.FC<RulesBannerImageProps> = ({ imageId, linkUrl, linkText }) => {
    if (!imageId || !linkUrl || !linkText) return null;

    const navigate = useNavigate();
    
    function SpecificNavigtateOut(item : any) {
        navigate(item, {state: Date.now().toString()});
    }
    return (
        <CustomNavLink link={linkUrl}
                        runfunc={() => {
                            SpecificNavigtateOut(linkUrl)
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