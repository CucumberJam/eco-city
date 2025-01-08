"use client"
import {memo} from "react";

function CurrentPositionButton({isLoading, onCurrAddress}){
    return (
        <button onClick={onCurrAddress}
                disabled={isLoading}>
            <div className="relative flex items-center justify-center">
                {!isLoading ? 'Использовать текущее местоположение' :
                    (
                        <>
                            <span>Загрузка вашего местоположения</span>
                        </>
                    )
                }
            </div>

        </button>
    );
}

export default memo(CurrentPositionButton)