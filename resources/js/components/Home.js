import React, { useEffect, useState } from "react";
import IndexNavbar from "./index/IndexNavbar";
import MastHead from "./index/MastHead";
import MainJumbo from "./index/MainJumbo";
import ProductGrid from "./index/ProductGrid";
import Footer from "./index/Footer";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const countItems = () => {
        axios
        .get('/cart/count')
        .then( res => {
            console.log('counting items!')
        })
    }


    useEffect(() => {
        axios.get("/categories")
            .then((res) => {
                setData( res.data );
            })
            .catch( err => {
                setError( err.message )
            });
    }, []);

    return (
        <div>
            <IndexNavbar />
            <MainJumbo />
            <MastHead />
            <ProductGrid products={data} countItems={countItems}/>
            <Footer />
        </div>
    );
};

export default Home;
