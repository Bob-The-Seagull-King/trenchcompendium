import '../../../resources/styles/vendor/bootstrap.css'
import React, { useEffect, useState } from 'react'

// Classes
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

function runToast( anchor = "" )
{
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + "#"+anchor)

    toast.success("Link Copied!");
}

interface RulesHeadlineProps {
    content: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
}

const RulesHeadlineDisplay: React.FC<RulesHeadlineProps> = ({ content, level = 1, className = "" }) => {
    const Tag: `h${1 | 2 | 3 | 4 | 5 | 6}` = `h${level}`;

    // Set anchor id fallback
    const idName = encodeURIComponent(content);

    return (
        <Tag id={idName} className={className + " headline-rules"}>
            {content}

            {idName && (
                <span className='icon-inline-right-s headline-link-btn' onClick={() => (
                        runToast( idName )
                    )}>
                    <FontAwesomeIcon icon={faLink} />
                </span>
            )}
        </Tag>
    )
};

export default RulesHeadlineDisplay;
