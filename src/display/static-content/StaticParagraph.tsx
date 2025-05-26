import React from 'react'

interface StaticParagraphProps {
    content: React.ReactNode
    className?: string
}

const StaticParagraph: React.FC<StaticParagraphProps> = ({ content, className = '' }) => {
    return (
        <p className={`StaticParagraph ${className}`}>
            {content}
        </p>
    )
}

export default StaticParagraph