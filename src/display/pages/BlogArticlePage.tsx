import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import LoadingOverlay from "../components/generics/Loading-Overlay";
import SynodImageWithCredit from "../../utility/SynodImageWithCredits";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

interface WPPost {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    date: string;
    slug: string;
    featured_media?: number;
    _embedded?: {
        author?: { name: string }[];
    };
}


interface NavPost {
    id: number;
    slug: string;
    title: string;
    featured_media: number;
    date: string;
    excerpt: string;
}

const BlogArticlePage: React.FC = () => {
    const { slug } = useParams();
    const [post, setPost] = useState<WPPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [nextPost, setNextPost] = useState<NavPost | null>(null);
    const [previousPost, setPreviousPost] = useState<NavPost | null>(null);


    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://synod.trench-companion.com/wp-json/wp/v2/posts?slug=${slug}&_embed=author`);
                const data = await response.json();
                if (data.length > 0) {
                    const currentPost = data[0];
                    setPost(currentPost);

                    // load post navigation
                    const [prevRes, nextRes] = await Promise.all([
                        fetch(`https://synod.trench-companion.com/wp-json/synod/v1/blog/previous/${currentPost.id}`),
                        fetch(`https://synod.trench-companion.com/wp-json/synod/v1/blog/next/${currentPost.id}`)
                    ]);

                    const prevData = await prevRes.json();
                    const nextData = await nextRes.json();

                    setPreviousPost(prevData || null);
                    setNextPost(nextData || null);
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
                {post.featured_media &&
                    <div className={'blog-hero-image-wrap'}>
                        <SynodImageWithCredit
                            imageId={post.featured_media}
                            className={'blog-hero-image'}
                            size={'full'}
                            imageKey={post.slug}
                        />
                    </div>
                }

                <div className={'article-content'}>
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
                </div>

                <div className="blog-adjacent-navigation">
                    {(nextPost && nextPost.slug) ? (
                        <Link to={`/blog/${nextPost.slug}`}
                              className="blog-adjacent-navigation_element blog-adjacent-navigation_previous"
                        >
                        <span className={'page-link-label'}>
                            <FontAwesomeIcon icon={faChevronLeft} className="icon-inline-left-l"/>
                            {'Newer'}
                        </span>

                            <span className={'page-name'}
                                  dangerouslySetInnerHTML={{__html: nextPost.title}}
                            >
                        </span>

                        </Link>
                    ) : <span></span>}

                    {(previousPost && previousPost.slug ) ? (
                        <Link to={`/blog/${previousPost.slug}`}
                              className="blog-adjacent-navigation_element blog-adjacent-navigation_next"
                        >
                        <span className={'page-link-label'}>
                            {'Older'}
                            <FontAwesomeIcon icon={faChevronRight} className="icon-inline-right-l"/>
                        </span>

                            <span className={'page-name'}
                                  dangerouslySetInnerHTML={{__html: previousPost.title}}
                            >

                        </span>
                        </Link>
                    ) : <span></span>}
                </div>
            </article>


            <script type="application/ld+json">
                {JSON.stringify(schemaMarkup)}
            </script>
        </div>
    );
};

export default BlogArticlePage;