import { Carousel } from "flowbite-react";
import Image from "next/image";
import banner from "../../../../public/baner/banner.jpg";
import glasses from "../../../../public/baner/bottles.jpg";
import carton from "../../../../public/baner/carton.jpg";
import plastic from "../../../../public/baner/plastic.avif";
//https://www.nationalgeographic.com/environment/article/plastic-pollution
export default function CarouselComponent(){
    return  <div className="h-[30rem] relative">
        <div className="absolute z-10 font-bold text-4xl right-32 top-24
                        text-right w-[400px] text-white leading-[4rem]">
            Переработка отходов в каждом городе
        </div>
        <Carousel slide={true} slideInterval={3000} pauseOnHover>
            <Image src={banner} placeholder='blur' quality={100} alt="trash cans"/>
            <Image src={carton} placeholder='blur' quality={100} alt="carton"/>
            <Image src={glasses} placeholder='blur' quality={100} alt="glasses"/>
            <Image src={plastic} placeholder='blur' quality={100} alt="plastic"/>
        </Carousel>
    </div>;
}