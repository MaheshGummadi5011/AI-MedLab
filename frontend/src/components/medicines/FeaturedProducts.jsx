import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay } from "swiper/modules";
import medicinesData from "../../data/medicinesData";

import "swiper/scss";
import "swiper/scss/autoplay";
import "swiper/scss/pagination";
import "swiper/scss/effect-coverflow";

const FeaturedSlider = () => {
  return (
    <Swiper
      modules={[EffectCoverflow, Pagination, A11y, Autoplay]}
      loop={true}
      speed={400}
      spaceBetween={100}
      slidesPerView={"auto"}
      pagination={{ clickable: true }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 70,
        modifier: 3,
        slideShadows: false,
      }}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween: 120,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 200,
        },
      }}
      className="!pt-12 !pb-20 dark:[&_.swiper-pagination-bullet]:bg-gray-400 "
    >
      {medicinesData.slice(0, 5).map((item) => {
        const { id, images, title, price } = item;

        return (
          // featured_slides
          <SwiperSlide
            key={id}
            className="text-center overflow-hidden shadow-[0_0_20px_1px_#B3B8D0] p-4 text-blue-7 max-md:w-[16rem] rounded-[12px] dark:text-white-8 md:w-[24rem]"
          >
            {/* featured_title */}
            <div className="">{title}</div>
            {/* featured_img */}
            <figure className="my-8 overflow-hidden">
              <Link to={`/all-medicines/medicine-details/${id}`}>
                <img
                  src={images[0]}
                  alt=""
                  className="w-full object-contain rounded-[12px] h-[13rem]"
                />
              </Link>
            </figure>
            {/* products_price */}
            <h2 className="">₹ {price} /- &nbsp;</h2>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FeaturedSlider;