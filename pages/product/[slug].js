import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client';
import Image from 'next/image';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {
    const [index, setIndex] = useState(0);
    const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

    if (!product) {
        return (
            <div className="product-error-container">
                <h1>Product not found</h1>
                <p>Don&apos;t see what you&apos;re looking for?</p>
            </div>
        );
    }

    const { image, name, details, price } = product;
    
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
                    <p className="price">KSH{price}</p>
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

        return {
            paths,
            fallback: 'blocking'
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return {
            paths: [],
            fallback: 'blocking'
        };
    }
}

export const getStaticProps = async ({ params }) => {
    try {
        // Safely access slug parameter
        const slug = params?.slug || '';
        
        const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
        const product = await client.fetch(query).catch(error => {
            console.error(`Error fetching product with slug ${slug}:`, error);
            return null;
        });

        const productsQuery = '*[_type == "product"]';
        const products = await client.fetch(productsQuery).catch(error => {
            console.error('Error fetching related products:', error);
            return [];
        });

        // If product not found, return notFound
        if (!product) {
            return {
                notFound: true
            };
        }

        return {
            props: { 
                product, 
                products: products || [] 
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: { 
                product: null, 
                products: [] 
            }
        };
    }
}

export default ProductDetails