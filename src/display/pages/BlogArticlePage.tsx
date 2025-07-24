import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingOverlay from "../components/generics/Loading-Overlay";

interface WPPost {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    date: string;
    _embedded?: {
        author?: { name: string }[];
    };
}

const BlogArticlePage: React.FC = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<WPPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`https://synod.trench-companion.com/wp-json/wp/v2/posts?slug=${slug}&_embed=author`);
                const data = await response.json();
                if (data.length > 0) {
                    setPost(data[0]);
                } else {
                    setPost(null);
                }
            } catch (err) {
                console.error('Failed to fetch post', err);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);


    if (loading) return (

        <div className={'BlogArticlePage'}>
            <div className={'LoadingOverlay-wrap-50vh'}>
                <LoadingOverlay
                    message={'Loading article'}
                />
            </div>
        </div>

    );

    if (!post) return <div>Article not found.</div>;

    const authorName = post._embedded?.author?.[0]?.name || 'Trench Companion Team';

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title.rendered.replace(/<[^>]+>/g, ''),
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": authorName
        },
        "publisher": {
            "@type": "Organization",
            "name": "Trench Companion",
            "logo": {
                "@type": "ImageObject",
                "url": "https://trench-companion.com/static/media/trench-companion-logo-white-v2.e60c2cc5740a76d1e2ad.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://trench-companion.com/blog/${slug}`
        },
        "articleBody": post.content.rendered.replace(/<[^>]+>/g, '')
    };

    return (
        <div className="BlogArticlePage container">

            <article className={'article-wrap'}>
                <h1 className="" dangerouslySetInnerHTML={{__html: post.title.rendered}}/>

                <div className="post-date-author">
                    <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
                    {' - '}
                    <span className="post-author">{authorName}</span>
                </div>


                <div
                    className=""
                    dangerouslySetInnerHTML={{__html: post.content.rendered}}
                />
            </article>

            <script type="application/ld+json">
            {JSON.stringify(schemaMarkup)}
            </script>
        </div>
    );
};

export default BlogArticlePage;