import {useState} from "react";

export default function useFormWastes(initialWastes = [], initialWasteTypes = []){
    const [showedWasteTypes, setShowedWasteTypes] = useState(initialWasteTypes);
    const [chosenWastes, setChosenWastes] = useState([]);
    const [chosenWasteTypes, setChosenWasteTypes] = useState([]);

    const pickWaste = (item, res, wasteTypes)=>{
        if(item.hasTypes){
            if(res){
                // add waste to chosen wastes:
                setChosenWastes(prev => [...prev, item]);

                // add all wasteTypes to list by waste id:
                const allWasteTypesByWasteId = wasteTypes.filter(type => type.typeId === item.id);
                setShowedWasteTypes(prev => [...prev, ...allWasteTypesByWasteId]);
            }else{
                // remove all wasteTypes to list by waste id
                const updatedWasteTypes = showedWasteTypes.filter(type => type.typeId !== item.id);
                setShowedWasteTypes(prev => [...updatedWasteTypes]);

                //remove all wasteTypes from chosenWasteTypes:
                const updatedChosenWasteTypes = chosenWasteTypes.filter(type => type.typeId !== item.id);
                setChosenWasteTypes(prev => [...updatedChosenWasteTypes]);

                // remove waste from chosen wastes by waste id
                const updatedChosenWastes = chosenWastes.filter(waste => waste.id !== item.id);
                setChosenWastes(prev => [...updatedChosenWastes]);
            }
        }else{
            if(res){
                setChosenWastes(prev => [...prev, item]);
            }
        }
    };

    const pickWasteType =(item, res) => {
        if(res){
            // add to chosenWasteTypes
            setChosenWasteTypes(prev => [...prev, item]);
            // check if chosenWasteType chosenWaste has its wasteParentId:
            const existChosenWaste = chosenWastes.find(el => el.id === item.typeId);
            if(!existChosenWaste) {
                const found = initialWastes.find(el => el.id === item.typeId);
                if(found) setChosenWastes(prev => [...prev, found]);
            }
        }else{
            //remove from chosenWasteTypes
            const updatedWasteTypes = chosenWasteTypes.filter(wasteType => wasteType.id !== item.id);
            //check if chosenWasteTypes has np longer any with the same typeId, if so remove waste with id = typeId from chosenWastes
            const typeId = item.typeId;
/*            const hasOthers = updatedWasteTypes?.some(wasteType => wasteType.typeId === typeId);
            if(!hasOthers){
                const updatedChosenWastes = chosenWastes.filter(waste => waste.id !== typeId);
                setChosenWastes(prev => [...updatedChosenWastes]);
            }*/
            setChosenWasteTypes(prev => [...updatedWasteTypes]);
        }
    };

    const resetFormWastesData= () => {
        setShowedWasteTypes([]);
        setChosenWastes([]);
        setChosenWasteTypes([]);
    }

    const getChosenWastesAndTypes = () => {
        const wastes = [...chosenWastes].map(el => el?.id);
        const wasteTypes = [...chosenWasteTypes].map(el => el?.id);

        return {wastes, wasteTypes};
    }

    return {showedWasteTypes, pickWaste, pickWasteType,getChosenWastesAndTypes,
        chosenWastes, chosenWasteTypes, resetFormWastesData};
}