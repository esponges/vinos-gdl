import React from "react";
import { Container, Jumbotron } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

const MastHead = () => {
    const carouselData = {
        title: ["masthead1.png", "masthead2.png", "masthead3.png"],
        header: ["Primer argumento", "Segundo argumento", "Tercer Argumento"],
        description: [
            "Qui minim nostrud minim aute adipisicing proident fugiat quis fugiat officia eu aliqua ipsum laboris.",
            "Culpa minim dolor exercitation mollit incididunt.",
            "Ea exercitation pariatur in officia proident cillum anim.",
        ],
    };

    const images = ["carrusel1.png", "carrusel2.png", "carrusel3.png"];

    return (
        <>
            <div className="container mb-4" style={{ textAlign: "center", marginTop: "-10%" }}>
                <img
                    src="/img/vinoreologo.png"
                    alt=""
                    id="vinoreo-logo-header"
                />
            </div>
            <div className="container">
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlay
                    autoPlaySpeed={3000}
                    centerMode={false}
                    classNameName=""
                    containerclassName="container-with-dots"
                    dotListclassName=""
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemclassName=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    renderButtonGroupOutside={true}
                    renderDotsOutside={false}
                    responsive={{
                        desktop: {
                            breakpoint: {
                                max: 3000,
                                min: 1024,
                            },
                            items: 1,
                            partialVisibilityGutter: 40,
                        },
                        mobile: {
                            breakpoint: {
                                max: 464,
                                min: 0,
                            },
                            items: 1,
                            partialVisibilityGutter: 30,
                        },
                        tablet: {
                            breakpoint: {
                                max: 1024,
                                min: 464,
                            },
                            items: 1,
                            partialVisibilityGutter: 30,
                        },
                    }}
                    showDots={true}
                    sliderclassName=""
                    slidesToSlide={1}
                    swipeable
                >
                    {images.map((imageName, i) => {
                        return (
                            <img
                                src={`img/${imageName}`}
                                key={i}
                                style={{
                                    display: "block",
                                    maxHeight: "350px",
                                    margin: "auto",
                                    maxWidth: "100%",
                                }}
                            />
                        );
                    })}
                </Carousel>
                <Jumbotron id="ship_pay_banner">
                    <Container>
                        <h5 style={{ textAlign: "center" }}>
                            <Link to="/about">
                                <b>Más información sobre pagos y envíos</b>
                            </Link>
                        </h5>
                    </Container>
                </Jumbotron>
            </div>
        </>
    );
};

export default MastHead;
