import {Carousel} from "flowbite-react";

export default function WasteAnnounces(){
    return (
        <div className="w-[40%] mx-auto
                    flex items-center justify-between
                    flex-wrap">
            <Carousel slide={true} slideInterval={3000} pauseOnHover>

            </Carousel>
        </div>
    );
}
function CarouselBlock(){
    return (
        <div>

        </div>
    );
}