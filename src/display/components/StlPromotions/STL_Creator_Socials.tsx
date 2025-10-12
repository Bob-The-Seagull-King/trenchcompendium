import React, { useState } from "react";

interface STL_Creator_SocialsProps {
    thumbnail_url: string;
    creator_name: string;
}

const STL_Creator_Socials: React.FC<STL_Creator_SocialsProps> = ({ thumbnail_url = "", creator_name =""}) => {

    return (
        <div className="STL_Creator_Name">

        </div>
    );
};

export default STL_Creator_Socials;
