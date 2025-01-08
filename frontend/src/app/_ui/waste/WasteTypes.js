'use client';
import Image from "next/image";
export default function WasteTypes({wasteTypes = [], imgPath = 'plastic'}) {
    return (
        <div className="space-y-6 text-base leading-relaxed
                        text-gray-500 dark:text-gray-400">
            <h4 className="text-center text-[24px]">Описание видов отходов:</h4>
            <ul className="w-[700px] flex flex-col items-center justify-between">
                {wasteTypes.map(el => (
                    <WasteItem key={el.code}
                               type={el}
                               path={imgPath}/>
                ))}
            </ul>
        </div>
    );
}
function WasteItem({type, path}){
        const pathPics = `../../../../public/articles/${path}/pics/${type.code}.png`;
        const pathLabels = `../../../../public/articles/${path}/labels/${type.code}.png`;

        return (
            <li className="w-full m-auto
                            flex
                            items-center justify-center
                            gap-[16px]">
                <WasteTypeImage imgPath={pathPics}
                                alt={type?.codeName || 'waste-type'}/>
                <WasteTypeDescription imgPath={pathLabels}
                                        wasteType={type}/>

            </li>
        );
}
function WasteTypeImage({imgPath, alt, width = '273px', height = 'auto'}){
    return (
    <div className="relative aspect-square
                    rounded-lg"
                    style={{width: width, height: height}}>
        <Image src={imgPath}
               placeholder='blur'
               quality={90}
               alt={alt}/>
    </div>
    );
}
function WasteTypeDescription({wasteType, imgPath}){
    return (
        <div className="border-gray-400 rounded-md
                        flex flex-col">
            <h4 className="text-blue-500">{wasteType.codeName}</h4>
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <h5>{wasteType.name}</h5>
                    <p>{wasteType.description}</p>
                </div>
                <WasteTypeImage imgPath={imgPath}
                                width="100px" height="100px"
                                style={{marginTop: '10px'}}/>
            </div>
        </div>
    );
}