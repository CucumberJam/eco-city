"use client";
import {wasteArticles} from "@/app/_store/constants";
import {Card, Carousel} from "flowbite-react";
import Link from "next/link";

export default function WasteArticles(){
    const articleBlocks = [wasteArticles.slice(0, 4), wasteArticles.slice(4, 8), wasteArticles.slice(8, 12), wasteArticles.slice(12)]
    return (
        <div className="h-[30rem] relative mt-10">
            <Carousel slide={false} slideInterval={3000} pauseOnHover>
                {articleBlocks.map((el, index) => (
                    <WasteArticlesBlock key={index}
                                        articles={el}/>
                ))}
            </Carousel>
        </div>
    )
}
function WasteArticlesBlock({articles}){
    return (
        <ul className='flex items-center justify-between space-x-3'>
            {articles.map(el => (
                <li key={el.id}
                    className='cursor-pointer hover:brightness-75 transition-colors'>
                    <Link target='_blank' href={el.urlPath}>
                        <article>
                            <Card className='max-w-sm h-[480px]'
                                  imgAlt={el.imgPath + '-' + el.id}
                                  imgSrc={el.imgPath + el.id + '.png'}>
                                <span>{el.date}</span>
                                <h5 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                                    {el.title}
                                </h5>
                                <p className='max-h-[100px] overflow-y-hidden
                                              pb-3
                                               font-normal text-gray-700 dark:text-gray-400'>
                                    {el.text}
                                </p>
                            </Card>
                        </article>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
/*                                  renderImage={()=> (<Image width={293} height={150}
                                                            className='object-scale-down'
                                                            quality={100}
                                                           src={el.imgPath + el.id + '.png'}
                                                           alt={el.imgPath + '-' + el.id}/>)}>*/