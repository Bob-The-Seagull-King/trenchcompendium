// FighterCardImageWrap.tsx
import React from 'react';
import SynodModelImage from "../../../../utility/SynodModelImage";

interface FighterCardImageWrapProps {
    model_slug?: string;
}

const FighterCardImageWrap: React.FC<FighterCardImageWrapProps> = ({ model_slug }) => {
    if (!model_slug) return null;

    return (
        <div className={'fighter-image-wrap'}>
            <SynodModelImage
                key={model_slug}
                modelSlug={model_slug}
                size="medium"
                className="fighter-image"
            />
        </div>
    );
};

export default FighterCardImageWrap;
