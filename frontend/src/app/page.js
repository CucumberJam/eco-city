import PageContainer from "@/app/_ui/general/PageContainer";
import CarouselComponent from "@/app/_ui/general/CarouselComponent";
import WasteContainer from "@/app/_ui/waste/WasteContainer";
import MapPanel from "@/app/_ui/map/MapPanel";
import LazyMap from "@/app/_ui/map/LazyMap";
import {PublicMapProvider} from "@/app/_context/PublicMapProvider";
import PaginatedCardsLayout from "@/app/_ui/general/PaginatedCardsLayout";
import UserModal from "@/app/_ui/user/UserModal";
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
                  <LazyMap/>
                  <PaginatedCardsLayout/>
                  <UserModal/>
              </PublicMapProvider>
          </PageContainer>
      </div>
  );
}
