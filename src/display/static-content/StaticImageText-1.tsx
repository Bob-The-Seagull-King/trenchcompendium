import React from 'react'
import SynodImage from '../../utility/SynodImage'


// clasName = 'swap' -> changes image and text positions
interface StaticImageTextProps {
    content: React.ReactNode
    imageId: number
    className?: string
}

const StaticImageText1: React.FC<StaticImageTextProps> = ({ content, imageId, className = '' }) => {
    return (
        <div className={`StaticImageText1 ${className}`}>
            <div className={'image-wrap'}>
                <SynodImage imageId={imageId} size="full" />
            </div>

            <div className={'text-wrap'}>
                {content}
            </div>
        </div>
    )
}

export default StaticImageText1