import React, { useEffect, useState } from 'react';
import Layout from "../components/layout/layout.jsx";
import Slides from "../components/product/slides.jsx";
import Features from "../components/feature/features.jsx";
import Categories from "../components/product/categories.jsx";
import Products from "../components/product/products.jsx";
import Brands from "../components/product/brands.jsx";
import featureStore from "../store/featureStore.js";
import productStore from "../store/productStore.js";
import Loading from "../components/loading/loading.jsx";

const HomePage = () => {
    const {
        ProductSliderList,
        ProductSliderListRequest,
        ProductCategoryListRequest,
        ProductListByRemarkRequest,
        ProductBrandListRequest
    } = productStore();

    const {FeaturesListRequest } = featureStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await ProductSliderListRequest();
                await FeaturesListRequest();
                await ProductCategoryListRequest();

                const remark = "featured"; // Ensure this is a valid remark
                await ProductListByRemarkRequest(remark);

                await ProductBrandListRequest();
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <Slides />
            <Features />
            <Categories />
            <Products />
            <Brands />

            {/* Display Loading overlay if still loading or features list is empty */}
            {loading || !ProductSliderList ? (
                <div className="loading-overlay">
                    <Loading />
                </div>
            ) : null}
        </Layout>
    );
};

export default HomePage;
