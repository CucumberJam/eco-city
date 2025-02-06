"use client"
import {Popover} from "flowbite-react";
const styles = "text-base text-gray-400 cursor-not-allowed ";
export default function DisabledButton({label, alternativeName, withBorder = false}){
    return (
        <Popover placement="top"
                 trigger="hover"
                 content={
                     <div className="w-44 text-gray-500 text-sm
                mx-0 my-auto flex justify-center py-1 px-2 text-center
                dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                         <p className="mb-0 text-center">{alternativeName}</p>
                     </div>
                 }>
            <a href="#" className={withBorder ? `${styles} border border-primary-300 mt-8 py-4 px-20` : `${styles}`}>
                {label}
            </a>
        </Popover>
    );
}