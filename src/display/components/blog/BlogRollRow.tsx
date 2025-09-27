import React, { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LoadingOverlay from "../generics/Loading-Overlay";
import SynodImageWithCredit from "../../../utility/SynodImageWithCredits";
import BlogArticlePreview from "./BlogArticlePreview";
import CustomNavLink from "../subcomponents/interactables/CustomNavLink";
import SynodImage from "../../../utility/SynodImage";
import {ROUTES} from "../../../resources/routes-constants";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";


interface BlogRollPost {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    featured_media: number | null;
}

const BlogRollRow: React.FC = () => {
    const [posts, setPosts] = useState<BlogRollPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const response = await fetch(
                    "https://synod.trench-companion.com/wp-json/synod/v1/blog/latest"
                );
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error("Failed to fetch latest posts", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="BlogRollRow my-4">
                <LoadingOverlay message="Loading latest posts..." />
            </div>
        );
    }

    if (posts.length === 0) {
        return <div className="BlogRollRow my-4">No recent posts available.</div>;
    }

    return (
        <div className="BlogRollRow my-5">
            <h2 className="BlogRollRow-headline mb-4">
                {'Trench Companion News'}
            </h2>

            <div className="row">
                {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="BlogRollRow-item col-12 col-md-6 mb-4">
                        <BlogArticlePreview
                            post={{
                                id: post.id,
                                title: { rendered: post.title },
                                excerpt: { rendered: post.excerpt },
                                slug: post.slug,
                                date: post.date,
                                featured_media: post.featured_media ?? undefined
                            }}
                            onClick={() => navigate(`${ROUTES.PAGE_BLOG_BASE}/${post.slug}`)}
                        />
                    </div>
                ))}
            </div>
            <CustomNavLink
                classes={'BlogRollRow-all btn btn-primary'}
                link={ROUTES.PAGE_BLOG_BASE}
                runfunc={() => {
                    navigate(ROUTES.PAGE_BLOG_BASE)
                }}>
                {'All Blog Posts'}
                <FontAwesomeIcon icon={faChevronRight} className={'ms-2'}/>
            </CustomNavLink>
        </div>
    );
};

export default BlogRollRow;
