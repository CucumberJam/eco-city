import { Carousel } from "flowbite-react";
import Image from "next/image";
import {carouselImages, slogan, slogStyle} from "@/app/_store/constants";
export default function CarouselComponent(){
    const CarouselImages = () => (<Carousel slide={true}
                                            slideInterval={3000} pauseOnHover>
        {carouselImages.map(el => (
            <Image key={el.id}
                   src={el.path}
                   alt={el.alt}
                   width={1500} height={1200}
                   quality={100}/>

        ))}
    </Carousel>);
    return  (
    <>
        <div className='h-[30rem] relative w-full hidden md:block'>
            <div className={` text-4xl ${slogStyle}`}>{slogan}</div>
            <CarouselImages/>
        </div>
        <div className='h-[20rem] relative w-[768px] hidden sm:block md:hidden'>
            <div className={` text-2xl ${slogStyle}`}>{slogan}</div>
            <CarouselImages/>
        </div>
        <div className='h-[18rem] relative w-[640px] block sm:hidden'>
            <div className={` text-xl ${slogStyle}`}>{slogan}</div>
            <CarouselImages/>
        </div>
    </>
    );
}