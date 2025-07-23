import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../resources/routes-constants';
import BlogArticlePreview from "../components/blog/BlogArticlePreview";
import LoadingOverlay from "../components/generics/Loading-Overlay";

interface WPPost {
    id: number;
    title: { rendered: string };
    excerpt: { rendered: string };
    slug: string;
    date: string;
    featured_media: number;
}

const BlogListPage: React.FC = () => {
    const [posts, setPosts] = useState<WPPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://synod.trench-companion.com/wp-json/wp/v2/posts?_embed');
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error('Failed to fetch blog posts', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return (

        <div className={'BlogListPage'}>

            <div className={'LoadingOverlay-wrap-50vh'}>
                <LoadingOverlay
                    message={'Loading your posts'}
                />
            </div>
        </div>

    );

    return (
        <div className="BlogListPage container">
            <h1 className="mb-4">Developer Blog</h1>

            <p className={'mb-4'}>
                {'Stay up to date with the latest progress on the Trench Companion project.\n' +
                    'Here we share development updates, feature previews, design insights, and community news — all straight from the trenches.'}
            </p>

            <div className={'spacer-20'}></div>


            <div className="row">
                {posts.map(post => (
                    <div key={post.id} className={'col-12 col-md-6 col-lg-4'}>

                        <BlogArticlePreview
                            post={post}
                            onClick={() => navigate(`/blog/${post.slug}`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogListPage;