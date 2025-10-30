import React from 'react';
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import { ROUTES } from '../../../resources/routes-constants'
import CustomNavLink from '../subcomponents/interactables/CustomNavLink'
import { useNavigate } from 'react-router-dom'

interface BlogArticlePreviewProps {
    post: {
        id: number;
        title: { rendered: string };
        excerpt: { rendered: string };
        slug: string;
        date: string;
        featured_media?: number;
    };
}

const BlogArticlePreview: React.FC<BlogArticlePreviewProps> = ({ post }) => {

    const navigate = useNavigate();

    return (
        <CustomNavLink
            classes={'BlogArticlePreview'}
            link={`${ROUTES.PAGE_BLOG_BASE}/${post.slug}`}
            runfunc={() => {
                navigate(`${ROUTES.PAGE_BLOG_BASE}/${post.slug}`);
            }}>

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
        </CustomNavLink>
    );
};

export default BlogArticlePreview;