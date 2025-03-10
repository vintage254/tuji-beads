import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaWhatsapp } from 'react-icons/fa';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { decQty, incQty, qty, onAdd, setShowCart, currency, convertPrice, isLoadingExchangeRate } = useStateContext();
    
    // Handle loading state for fallback pages
    React.useEffect(() => {
        if (product) {
            setIsLoading(false);
        }
    }, [product]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="product-loading-container">
                <h2>Loading product information...</h2>
            </div>
        );
    }

    // Handle case where product is not found
    if (!product) {
        return (
            <div className="product-error-container">
                <h1>Product not found</h1>
                <p>Don&apos;t see what you&apos;re looking for?</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="btn"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const { image, name, details, price, negotiable } = product;
    
    // Generate image URLs safely
    const getImageUrl = (img) => {
        if (!img) return '';
        const url = urlFor(img);
        return url || '';
    };

    const handleBuyNow = () => {
        onAdd(product, qty);
        setShowCart(true);
    };

    // Handle WhatsApp negotiation
    const handleNegotiate = () => {
        const message = `Hello, I'm interested in negotiating the price for ${name} (KSH${price}). Can we discuss?`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/+254712345678?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    // Display price based on selected currency
    const displayPrice = () => {
        if (isLoadingExchangeRate) {
            return <span className="loading-price">Loading price...</span>;
        }
        
        if (currency === 'USD') {
            return <span>${convertPrice(price)}</span>;
        }
        
        return <span>KSh {price}</span>;
    };

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        {image && image[index] && (
                            <Image 
                                src={getImageUrl(image[index])} 
                                alt={name || 'Product image'} 
                                width={400}
                                height={400}
                                className="product-detail-image" 
                            />
                        )}
                    </div>
                    <div className="small-images-container">
                        {image?.map((item, i) => (
                            <Image 
                                key={i} 
                                src={getImageUrl(item)}
                                alt={`Product ${i+1}`} 
                                width={200}
                                height={200}
                                className={i === index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-detail-desc">
                    <h1>{name}</h1>
                    <div className="reviews">
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiOutlineStar />
                        <p>(20)</p>
                    </div>
                    <h4>Details:</h4>
                    <p>{details}</p>
                    
                    <div className="price-container">
                        <p className="price">{displayPrice()}</p>
                        {negotiable && (
                            <span className="negotiable-badge">Negotiable</span>
                        )}
                    </div>
                    
                    <div className="quantity">
                        <h3>Quantity:</h3>
                        <p className="quantity-desc">
                            <span className="minus" onClick={() => decQty()}>
                                <AiOutlineMinus />
                            </span>
                            <span className="num">{qty}</span>
                            <span className="plus" onClick={() => incQty()}>
                                <AiOutlinePlus />
                            </span>
                        </p>
                    </div>
                    <div className="buttons">
                        <button type="button" className="add-to-cart" onClick={() => onAdd(product, qty)}>
                            Add to Cart
                        </button>
                        <button type="button" className="buy-now" onClick={handleBuyNow}>
                            Order Now
                        </button>
                        {negotiable && (
                            <button type="button" className="negotiate-button" onClick={handleNegotiate}>
                                <FaWhatsapp /> Negotiate Price
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products?.map((item) => (
                            <Product key={item._id} product={item} />
                        ))}
                        {products?.map((item) => (
                            <Product key={`${item._id}-duplicate`} product={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    try {
        const query = `*[_type == "product"]{
            slug{
                current
            }
        }`;
        
        const products = await client.fetch(query).catch(error => {
            console.error('Error fetching products for paths:', error);
            return [];
        });
        
        const paths = products.map((product) => ({
            params: { 
                slug: product?.slug?.current || 'unknown-product' 
            }
        }));

        console.log('Generated product paths:', paths.map(p => p.params.slug));

        return {
            paths,
            // Change to true to allow fallback to client-side rendering
            // This will help with 404 errors by showing a loading state instead
            fallback: true
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return {
            paths: [],
            fallback: true
        };
    }
}

export const getStaticProps = async ({ params }) => {
    try {
        // Handle case where params might be undefined
        if (!params || !params.slug) {
            console.error('Missing slug parameter in getStaticProps');
            return {
                notFound: true,
                revalidate: 60
            };
        }

        const slug = params.slug;
        console.log('Fetching product data for slug:', slug);

        // Use parameterized query to prevent injection
        const query = `*[_type == "product" && slug.current == $slug][0]`;
        const product = await client.fetch(query, { slug }).catch(error => {
            console.error(`Error fetching product with slug ${slug}:`, error);
            return null;
        });

        // Log product fetch result
        console.log(`Product fetch result for ${slug}:`, product ? 'Found' : 'Not found');

        // Get related products
        const productsQuery = '*[_type == "product"]';
        const products = await client.fetch(productsQuery).catch(error => {
            console.error('Error fetching related products:', error);
            return [];
        });

        // If product not found, return notFound
        if (!product) {
            console.log(`Product not found for slug: ${slug}, returning 404`);
            return {
                notFound: true,
                revalidate: 60 // Check again after a minute
            };
        }

        return {
            props: { 
                product, 
                products: products || [] 
            },
            revalidate: 3600, // Revalidate every hour
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true,
            revalidate: 60
        };
    }
}

export default ProductDetails