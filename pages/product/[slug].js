import React, { useState } from 'react'
import { client, urlFor } from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ product, products }) => {
    const [index, setIndex] = useState(0);
    const { decQty, incQty, qty, onAdd } = useStateContext();

    if (!product) {
        return (
            <div className="product-error-container">
                <h1>Product not found</h1>
                <p>Sorry, the product you're looking for doesn't exist or is no longer available.</p>
            </div>
        );
    }

    const { image, name, details, price } = product;

    return (
        <div>
            <div className="product-detail-container">
                <div>
                    <div className="image-container">
                        <img 
                            src={urlFor(image && image[index])} 
                            className="product-detail-image" 
                            alt={name} 
                        />
                    </div>
                    <div className="small-images-container">
                        {image?.map((item, i) => (
                            <img 
                                key={i} 
                                src={urlFor(item)}
                                className={i === index ? 'small-image selected-image' : 'small-image'}
                                onMouseEnter={() => setIndex(i)}
                                alt={`${name} image ${i+1}`} 
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
                        <button type="button" className="buy-now" onClick={() => {}}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="maylike-products-wrapper">
                <h2>You may also like</h2>
                <div className="marquee">
                    <div className="maylike-products-container track">
                        {products.map((item) => (
                            <Product key={item._id} product={item} />
                        ))}
                        {products.map((item) => (
                            <Product key={`${item._id}-duplicate`} product={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"]{
        slug{
            current
        }
    }`
    const products = await client.fetch(query)
    const paths = products.map((product) => ({
        params: { slug: product.slug.current }
    }));

    return {
        paths,
        fallback: 'blocking'
    };
}

export const getStaticProps = async ({ params: { slug } }) => {
    try {
        const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
        const product = await client.fetch(query);

        const productsQuery = '*[_type == "product"]';
        const products = await client.fetch(productsQuery);

        // If product not found, return notFound
        if (!product) {
            return {
                notFound: true
            };
        }

        return {
            props: { product, products },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            props: { product: null, products: [] }
        };
    }
}

export default ProductDetails