import DisabledButton from "@/app/_ui/general/DisabledButton";

export default function FormButton({title = 'Вход в личный кабинет',
                                   isDisabled = false,
                                   disableTip = '',
                                   typeBtn = 'submit',
                                   clickHandler = null,
                                   size = ' py-4 px-20 ',
                                   position = ' self-center ',
                                   }){
    if(isDisabled) return (
        <div className='my-0 mx-auto flex justify-center cursor-not-allowed'>
            <DisabledButton label={title}
                            withBorder={true}
                            alternativeName={disableTip}>
            </DisabledButton>
        </div>
    );

    return (
        <button type={typeBtn}
                disabled={isDisabled}
                className={`${size} transition-colors mt-8 ${position}
                border border-primary-300 hover:border-white
                rounded flex justify-center items-center cursor-pointer 
                ${typeBtn === 'submit' ? 'bg-accent-10 text-white hover:bg-primary-10' : 'bg-inherit hover:bg-grey-3 hover:text-white'}`}
                onClick={clickHandler}>
            {title}
        </button>
        /* style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}*/
    );
}