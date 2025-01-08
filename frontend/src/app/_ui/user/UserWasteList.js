export default function UserWasteList({wastes}){
    return (
        <>
        {wastes.map((el) => (
                <p key={el.id} className="text-black">
                    <span className="font-semibold">
                        {el.name.substring(0,1).toUpperCase() + el.name.substring(1).toLowerCase()}
                        {el.children.length > 0 && ': '}</span>
                    {el.children.length > 0 && el.children.map((child, inx) => (
                        <span key={child.id} className="italic ">
                            {child.name}
                            {inx !== el.children.length - 1 ? ', ' : '.'}</span>
                    ))}
                </p>
            ))}
        </>
    );
}