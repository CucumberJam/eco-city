export default function FormHiddenInput({name, value, id = null, changeHandler}){
    return (
        <input type='hidden' name={name} value={value} id={id}
               onChange={e => changeHandler(e.target.value)}/>
    );
}