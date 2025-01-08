import PageContainer from "@/app/_ui/PageContainer";
import CarouselComponent from "@/app/_ui/CarouselComponent";
import MapContainer from "@/app/_ui/map/MapContainer";
import WasteContainer from "@/app/_ui/waste/WasteContainer";
export default async function Page() {
  return (
      <div>
          <div className="relative w-full">
              <CarouselComponent/>
          </div>
          <PageContainer>
              <WasteContainer/>
              <MapContainer/>
          </PageContainer>
      </div>
  );
}
