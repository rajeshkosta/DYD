import "../../assets/styles/theme.css"
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "./Slider.css";
// Import Swiper styles
import 'swiper/css';
import "swiper/css/effect-coverflow";
import 'swiper/css/navigation';
import { Autoplay, EffectCoverflow, A11y, Navigation } from 'swiper/modules';
import img1 from "../../assets/img/1.jpg";
import img2 from "../../assets/img/2.jpg";
import img3 from "../../assets/img/3.jpg";
import img4 from "../../assets/img/4.jpg";
import img5 from "../../assets/img/5.jpg";
import img6 from "../../assets/img/2.jpg";
import img7 from "../../assets/img/3.jpg";
import img8 from "../../assets/img/4.jpg";
import img9 from "../../assets/img/5.jpg";
const Slider = () => {

    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
    const duplicates = [...images, ...images.slice(0, 3)];
    const breakpoints = {
        // when window width is >= 992px (large devices), show 3 images per view
        992: {
            slidesPerView: 3
        },
        // when window width is >= 768px (medium devices) and < 992px, show 2 images per view
        768: {
            slidesPerView: 1
        },
        // when window width is < 768px (small devices), show 1 image per view
        0: {
            slidesPerView: 1
        }
    };

    return (
        <section className="py-16 md:py-24 bg-primary  overflow-hidden slider">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-8xl font-normal text-[#BDDD63] text-center mb-16">
                    Design created by our
                    customers
                </h2>
                <div className="">
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        loop={true}
                        
                        slidesPerView={"auto"}
                        centeredSlides={true}
                        spaceBetween={20}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false
                        }}
                        // autoplay={false}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 3,
                        }}
                        breakpoints={breakpoints}
                        loopAdditionalSlides={2}
                        loopFillGroupWithBlank={true}
                        modules={[Autoplay, A11y, EffectCoverflow, Navigation]}
                        navigation={{ nextEl: ".next-btn", prevEl: ".prev-btn" }}
                        className="mySwiper"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} style={{ width: "auto" }}>
                                <img src={image} alt={`Slide ${index}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>


                    <div className="flex justify-center items-center mt-4">
                        <button
                            // onClick={handlePrev}
                            className="prev-btn w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors mx-2"
                        >
                            <ArrowLeft />
                        </button>
                        <button
                            // onClick={handleNext}
                            className="next-btn w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors mx-2"
                        >
                            <ArrowRight />
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Slider;