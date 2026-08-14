import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination,Autoplay } from "swiper/modules";


export default function BannerSlider() {
  return (
    <>
      <Swiper pagination={true} modules={[Pagination, Autoplay]} className="mySwiper" autoplay={{ delay: 1000 }} speed={1000}>
        <SwiperSlide>
          <img src="bi1.jpg" className="w-full h-[40vh] md:h-[95vh]" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="bi5.jpg" className="w-full h-[40vh] md:h-[95vh]" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="bi3.jpg" className="w-full h-[40vh] md:h-[95vh]" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
