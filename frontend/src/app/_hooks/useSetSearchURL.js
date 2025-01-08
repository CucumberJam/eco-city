import {usePathname, useRouter, useSearchParams} from "next/navigation";
export default function useSetSearchURL(initialFilterName = '', initialFilterValue = ''){
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();
    let activeFilter =  (initialFilterName && initialFilterValue ) ? (searchParams.get(initialFilterName) ?? initialFilterValue) : null;
    const getParams =  (initialFilterName) => searchParams.get(initialFilterName) ?? null;
    const setParams = (name, value, name2 = null, value2 = null) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        if(name2 && value2) params.set(name2, value2);
        router.replace(`${pathName}?${params.toString()}`, {scroll: false});
    }
    const removeParamsByName = (name)=> {
        const params = new URLSearchParams(searchParams);
        params.delete(name);
    }
    return {setParams, activeFilter, getParams, removeParamsByName};
}