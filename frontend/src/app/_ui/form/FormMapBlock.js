import FormItemMap from "@/app/_ui/form/FormItemMap";

export default function FormMapBlock({latitude, latitudeHandler,
                              longitude, longitudeHandler}){
    return <div className="w-[90%]">
        <FormItemMap isPosSet={latitude && longitude}
                     pickedUpPos={(latitude && longitude) ? [latitude, longitude] : []}
                     changePositionHandler={chosenPos => {
                         latitudeHandler(+chosenPos?.lat || 0);
                         longitudeHandler(+chosenPos?.lng  || 0)
                     }}/>
    </div>
};
