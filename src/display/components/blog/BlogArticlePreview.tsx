import React from 'react';
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";

interface BlogArticlePreviewProps {
    post: {
        id: number;
        title: { rendered: string };
        excerpt: { rendered: string };
        slug: string;
        date: string;
        featured_media?: number;
    };
    onClick?: () => void;
}

const BlogArticlePreview: React.FC<BlogArticlePreviewProps> = ({ post, onClick }) => {
    return (
        <div
            className="BlogArticlePreview"
            onClick={onClick}
        >
            {post.featured_media &&
                <div className={'image-wrap'}>
                    <SynodImageWithCredit
                        imageId={post.featured_media}
                        className={'preview-image'}
                        imageKey={post.slug}
                        size={'large'}
                    />
                </div>
            }

            <div className={'text-wrap'}>
                <h2
                    className=""
                    dangerouslySetInnerHTML={{__html: post.title.rendered}}
                />
                <div className="mb-3">
                    {new Date(post.date).toLocaleDateString()}
                </div>
                <div
                    className="excerpt"
                    dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}
                />
            </div>
        </div>
    );
};

export default BlogArticlePreview;