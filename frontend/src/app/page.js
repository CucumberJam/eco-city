import PageContainer from "@/app/_ui/general/PageContainer";
import CarouselComponent from "@/app/_ui/general/CarouselComponent";
import WasteContainer from "@/app/_ui/waste/WasteContainer";
import MapPanel from "@/app/_ui/map/MapPanel";
import {PublicMapProvider} from "@/app/_context/PublicMapProvider";
import PaginatedCardsLayout from "@/app/_ui/general/PaginatedCardsLayout";
import Modal from "@/app/_ui/general/Modal";
import MapContainer from "@/app/_ui/map/MapContainer";
export default async function Page() {
  return (
      <div>
          <div className="relative w-full">
              <CarouselComponent/>
          </div>
          <PageContainer>
              <WasteContainer/>
              <PublicMapProvider>
                  <MapPanel/>
                  <MapContainer/>
                  <PaginatedCardsLayout/>
                  <Modal/>
              </PublicMapProvider>
          </PageContainer>
      </div>
  );
}
