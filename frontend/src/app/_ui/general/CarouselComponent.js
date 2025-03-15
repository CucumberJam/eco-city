import { Carousel } from "flowbite-react";
import Image from "next/image";
import {carouselImages, slogan} from "@/app/_store/constants";
//https://www.nationalgeographic.com/environment/article/plastic-pollution
export default function CarouselComponent(){
    return  <div className="h-[30rem] relative">
        <div className="absolute z-10 font-bold text-4xl right-32 top-24
                        text-right w-[400px] text-white leading-[4rem]">
            {slogan}
        </div>
        <Carousel slide={true} slideInterval={3000} pauseOnHover>
            {carouselImages.map(el => (
                <Image key={el.id}
                       src={el.path}
                       alt={el.alt}
                       width={1000} height={1000} quality={100}/>

            ))}
        </Carousel>
    </div>;
}