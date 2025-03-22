import {debounce, getNameAddress} from "@/app/_lib/helpers";
import {fetchCompanyByOGRN} from "@/app/_lib/actions/global";
import {useState} from "react";

export default function useDebounce(errorCallbackFunc){
    const [isFetchingOGRN, setIsFetchingOGRN] = useState(false);
    const [ogrnUserName, setOgrnUserName] = useState('');
    const [ogrnUserAddress, setOgrnUserAddress] = useState('');

    function hasError(typeCheck, payload){
        if(errorCallbackFunc(typeCheck, payload)) {
            setOgrnUserName('');
            setOgrnUserAddress('');
            return true;
        }
    }

    const debounceCheck = {
        'website': debounce((event)=>{
            if(event.target.name !== 'website') return;
            errorCallbackFunc('form', {type:'website', payload: {website: event.target.value}});
        }, 2000),
        'email': debounce((event)=>{
            if(event.target.name !== 'email') return;
            errorCallbackFunc('form', {type: 'email', payload: {email: event.target.value}});
        }, 2000),
        'phone': debounce((event)=>{
            if(event.target.name !== 'phone') return;
            errorCallbackFunc('form',{type:'phone', payload: {phone: event.target.value}});
        }, 2000),
        'ogrn': debounce(async(event, useApiFNS = true) => {
            if(event.target.name !== 'ogrn') return;
            const userTypedOGRN = event.target.value.trim();
            if(hasError('length', userTypedOGRN)) return;
            try{
                if(hasError('type', userTypedOGRN)) return;
                setIsFetchingOGRN(prev => true);
                const res = await fetchCompanyByOGRN(userTypedOGRN, useApiFNS);
                setIsFetchingOGRN(prev => false);
                if(hasError('api', res)) return;
                if(hasError('status', res)) return;
                const [name, address] = getNameAddress(res.data, userTypedOGRN.length === 13, useApiFNS);
                if(name) setOgrnUserName(prev => name);
                if(address) setOgrnUserAddress(prev => address);
            }catch (e) {
                hasError('default', e?.message || 'Ошибка получения данных о компании');
            }
        }, 1000),
    }

    return {isFetchingOGRN, ogrnUserName, ogrnUserAddress, debounceCheck};
}