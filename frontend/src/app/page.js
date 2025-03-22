import PageContainer from "@/app/_ui/general/PageContainer";
import CarouselComponent from "@/app/_ui/general/CarouselComponent";
import WasteContainer from "@/app/_ui/waste/WasteContainer";
import MapPanel from "@/app/_ui/map/MapPanel";
import {PublicMapProvider} from "@/app/_context/PublicMapProvider";
import PaginatedCardsLayout from "@/app/_ui/general/PaginatedCardsLayout";
import Modal from "@/app/_ui/general/Modal";
import MapContainer from "@/app/_ui/map/MapContainer";
import WasteArticles from "@/app/_ui/waste/WasteArticles";
export default async function Page() {
  return (
      <div className='w-full'>
          <CarouselComponent/>
          <PageContainer>
              <WasteContainer/>
              <PublicMapProvider>
                  <MapPanel/>
                  <MapContainer/>
                  <PaginatedCardsLayout/>
                  <Modal/>
              </PublicMapProvider>
              <WasteArticles/>
          </PageContainer>
      </div>
  );
}
