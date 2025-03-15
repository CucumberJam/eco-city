'use client';
import Image from "next/image";
import {prepareName} from "@/app/_lib/helpers";
export default function WasteTypes({waste = {}}) {
    return (
        <div className="space-y-6 text-base leading-relaxed
                        text-gray-500 dark:text-gray-400">
            <h4 className="text-center text-[24px]">Подвиды, описание:</h4>
            <ul className="w-[600px] flex flex-col items-center justify-between space-y-3">
                {waste?.types?.map(el => (
                    <WasteItem key={el.code}
                               type={el}
                               hasLabels={waste.hasLabels}
                               path={waste.picturesPath}/>
                ))}
            </ul>
        </div>
    );
}
function WasteItem({type, path, hasLabels = false}){
        const pathPics = `/articles/${path}/pics/${type.code}.png`;
        const pathLabels = hasLabels ? `/articles/${path}/labels/${type.code}.png` : null;

        return (
            <li className="w-full m-auto
                            flex space-x-5
                            items-start justify-center
                            py-2 px-3
                            border-gray-200 border-2 rounded-xl">
                <WasteTypeImage imgPath={pathPics}
                                alt={type?.codeName || 'waste-type'}/>
                <WasteTypeDescription imgPath={pathLabels}
                                        wasteType={type}/>

            </li>
        );
}
function WasteTypeImage({imgPath, alt}){
    return (
    <div className="relative aspect-square
                    rounded-lg">
        <Image src={imgPath}
               width={300} height={300}
               quality={90}
               alt={alt}/>
    </div>
    );
}
function WasteTypeDescription({wasteType, imgPath = null}){
    return (
        <div className="border-gray-400 rounded-md
                        flex flex-col w-[440px]">
            <h4 className="text-blue-500">{prepareName(wasteType.codeName)}</h4>
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <h5>{prepareName(wasteType.name)}</h5>
                    <p>{wasteType.description}</p>
                </div>
                {imgPath && <Image src={imgPath}
                        width={100} height={100}
                        quality={90}
                        alt={wasteType.name}
                        style={{marginTop: '10px'}}/>}
            </div>
        </div>
    );
}