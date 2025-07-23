import React from 'react';

interface BlogArticlePreviewProps {
    post: {
        id: number;
        title: { rendered: string };
        excerpt: { rendered: string };
        slug: string;
        date: string;
    };
    onClick?: () => void;
}

const BlogArticlePreview: React.FC<BlogArticlePreviewProps> = ({ post, onClick }) => {
    return (
        <div
            className="BlogArticlePreview"
            onClick={onClick}
        >
            <h2
                className=""
                dangerouslySetInnerHTML={{__html: post.title.rendered}}
            />
            <div className="mb-4">
                {new Date(post.date).toLocaleDateString()}
            </div>
            <div
                className="excerpt"
                dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}
            />
        </div>
    );
};

export default BlogArticlePreview;