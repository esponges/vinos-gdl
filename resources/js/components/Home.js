import React from "react";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import MainJumbo from './index/MainJumbo';
import ProductGrid from "./index/ProductGrid";
import Footer from './index/Footer';

const Home = () => {
    return (
        <div>
            <IndexNavbar />
            <MainJumbo />
            <MastHead />
            <ProductGrid />
            <Footer />
        </div>
    );
};

export default Home;
