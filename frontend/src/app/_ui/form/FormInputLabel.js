const styles = 'text-green-50'
export default function FormInputLabel({htmlName, label, styleWide = true}){
    return (
            <label htmlFor={htmlName}
                   className={styleWide ? `whitespace-nowrap ${styles}` : ` ${styles}`}>
                {label}
            </label>
        );

}