"use client";
import {wasteArticles} from "@/app/_store/constants";
import {Card, Carousel} from "flowbite-react";
import Link from "next/link";
const stylesLink = 'cursor-pointer hover:brightness-75 transition-colors';
export default function WasteArticles(){
    const articleBlocks = [wasteArticles.slice(0, 4), wasteArticles.slice(4, 8), wasteArticles.slice(8, 12), wasteArticles.slice(12)]
    const articleBlocksSmall = [wasteArticles.slice(0, 3), wasteArticles.slice(3, 6), wasteArticles.slice(6, 9), wasteArticles.slice(9,12), wasteArticles.slice(12, 15)]
    return (
        <>
            <div className="hidden md:block h-[30rem] relative mt-10">
                <Carousel slide={true} slideInterval={3000} pauseOnHover>
                    {articleBlocks.map((el, index) => (
                        <WasteArticlesBlock key={index}
                                            articles={el}/>
                    ))}
                </Carousel>
            </div>
            <div className="hidden sm:block md:hidden h-[30rem] relative mt-10">
                <Carousel slide={true} slideInterval={3000} pauseOnHover>
                    {articleBlocksSmall.map((el, index) => (
                        <WasteArticlesBlock key={index}
                                            articles={el}/>
                    ))}
                </Carousel>
            </div>
            <div className="max-w-[580px] block sm:hidden h-[30rem] relative mt-10">
                <Carousel slide={true} slideInterval={3000} pauseOnHover>
                    {wasteArticles.map((el, index) => (
                        <Article key={index}
                                 el={el}
                                 style={stylesLink + ' flex w-[90%] justify-center '}/>
                    ))}
                </Carousel>
            </div>
        </>
    )
}
function WasteArticlesBlock({articles}){
    return (
        <ul className='flex md:px-6
        items-center justify-between space-x-3'>
            {articles.map(el => (
                <li key={el.id}
                    className={`${stylesLink}`}>
                    <Article el={el}/>
                </li>
            ))}
        </ul>
    );
}
function Article({el, style = ''}){
    return (
        <Link className={style} target='_blank' href={el.urlPath}>
            <article>
                <Card className='max-w-sm
                                 h-[420px] md:h-[480px] overflow-y-hidden'
                      imgAlt={el.imgPath + '-' + el.id}
                      imgSrc={el.imgPath + el.id + '.png'}>
                    <span className='text-sm lg:text-base'>{el.date}</span>
                    <h5 className='text-base md:text-lg lg:text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                        {el.title}
                    </h5>
                    <p className='max-h-[65px] lg:max-h-[100px] overflow-y-hidden
                                              pb-2 lg:pb-3
                                              text-gray-700 dark:text-gray-400'>
                        {el.text}
                    </p>
                </Card>
            </article>
        </Link>
    );
}