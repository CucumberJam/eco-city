import DisabledButton from "@/app/_ui/DisabledButton";

export default function FormButton({title = 'Вход в личный кабинет',
                                   isDisabled = false,
                                    disableTip = '',
                                   typeBtn = 'submit',
                                   clickHandler = null}){
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
                className='mt-8 py-4 px-20 self-center
                bg-inherit border border-primary-300 hover:border-white
                rounded flex justify-center items-center cursor-pointer'
                onClick={clickHandler}>
            {title}
        </button>
        /* style={{cursor: isDisabled ? 'not-allowed' : 'pointer'}}*/
    );
}