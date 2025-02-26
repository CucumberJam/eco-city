"use client";
import useSetSearchURL from "@/app/_hooks/useSetSearchURL";
import {Dropdown, DropdownItem} from "flowbite-react";
import {prepareName} from "@/app/_lib/helpers";
import DisabledButton from "@/app/_ui/general/DisabledButton";
export default function Filter({
                                    withAll = true,
                                   data = [],
                                   dataName = 'role',
                                   dataLabel = 'Статус участника',
                                   alternativeName = '',
                                   isDisabled = false,
                                   setItem = null,
                                   setAddItem  = null,
                                   addDataName = 'wasteType',
                                   itemValue = ''
                               }){
    const {setParams} = useSetSearchURL(dataName, 'all');
    function clickHandler(item){
        setItem?.(item);
        if(item){
            if(setAddItem && itemValue !== item?.name) {
                setAddItem(null);
                setParams(dataName, item.name, addDataName, 'all');
            }else setParams(dataName, item ? item.name : 'all');
        }else{
            if(setAddItem && itemValue !== item?.name) {
                setAddItem(null);
                setParams(dataName, 'all', addDataName, 'all');
            }else setParams(dataName, 'all');
        }
    }
    if(!data.length || isDisabled) return (
        <DisabledButton label={dataLabel}
                alternativeName={alternativeName}>
        </DisabledButton>
    );
    return (
            <Dropdown label={itemValue? prepareName(itemValue) : prepareName(dataLabel)}
                      inline size="sm"
                      dismissOnClick={true}
                      placement="top">
                {withAll && itemValue.length > 0 &&
                    <DropdownItem key={0}
                               value='all'
                               onClick={() => clickHandler(null)}>
                    Все
                </DropdownItem>}
                {data.map(item => (
                    <DropdownItem key={item.id}
                                  value={item.name}
                                  onClick={() => clickHandler(item)}>
                        {item?.label ? prepareName(item.label) : prepareName(item.name)}
                    </DropdownItem>
                ))}
            </Dropdown>
    );
}