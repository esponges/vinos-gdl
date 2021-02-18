import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

    const images = ["masthead1.png", "masthead2.png", "masthead3.png"];

    return (
        <>
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlay
                autoPlaySpeed={2100}
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
                renderButtonGroupOutside={false}
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
                                height: "100%",
                                margin: "auto",
                                width: "100%",
                            }}
                        />
                    );
                })}
            </Carousel>
        </>
    );
};

export default MastHead;
