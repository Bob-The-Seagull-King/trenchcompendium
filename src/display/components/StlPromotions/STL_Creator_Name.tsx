import React, { useState } from "react";

interface STL_Creator_NameProps {
    thumbnail_url: string;
    creator_name: string;
}

const STL_Creator_Name: React.FC<STL_Creator_NameProps> = ({ thumbnail_url = "", creator_name =""}) => {

    return (
        <div className="STL_Creator_Name">
            <div className={'creator-image-wrap'}>
                <img src={thumbnail_url} alt={`${creator_name}-logo`}
                />
            </div>

            <div className={'creator-name'}>
                {creator_name}
            </div>
        </div>
    );
};

export default STL_Creator_Name;
