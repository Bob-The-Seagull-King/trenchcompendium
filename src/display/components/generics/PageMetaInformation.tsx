/**
 * This uses Helmet node module to set page title and meta information
 */

import React from 'react';
import { Helmet } from 'react-helmet';

interface PageMetaInformationProps {
    title: string;
    description?: string;
    keywords?: string;
    author?: string;
    ogImage?: string;
    ogUrl?: string;
}

const PageMetaInformation: React.FC<PageMetaInformationProps> = ({
     title,
     description = '',
     keywords = '',
     author = '',
     ogImage,
     ogUrl,
 }) => {

    // construct the title
    if( !title || title == '' || title == 'undefined' ) {
        title = 'Trench Companion - The official Trench Crusade resource';
    } else {
        title = title + ' | Trench Companion';

    }

    // Create Description Fallback
    if( description == '' ) {
        description = 'Trench Companion - The official resource for the tabletop game Trench Crusade.';
    }

    // Create ogImage Fallback
    if( ogImage == '' ) {
        ogImage = 'https://synod.trench-companion.com/wp-content/uploads/2025/05/Trench-Companion-Share.png';
    }


    return (
        <Helmet>
            <title>{title}</title>

            {description &&
                <meta name="description" content={description}/>
            }
            {description &&
                <meta property="og:description" content={description}/>
            }

            {keywords &&
                <meta name="keywords" content={keywords}/>
            }

            {author &&
                <meta name="author" content={author}/>
            }

            <meta property="og:title" content={title}/>

            {/* @TODO: add fallback image */}
            {ogImage &&
                <meta property="og:image" content={ogImage}/>
            }


            {ogUrl && <meta property="og:url" content={ogUrl}/>}

            <meta property="og:type" content="website"/>
        </Helmet>
    );
};

export default PageMetaInformation;