import UserRoleCircle from "@/app/_ui/general/userRoleCircle";
import Subtitle from "@/app/_ui/general/Subtitle";
export default function DialogAnnounceItem({dialog, clickHandler, isOpen}){
    return (
        <article className={`text-center w-full cursor-pointer border-b flex items-center justify-center md:justify-between 
        py-2 px-1 text-xs ${dialog.isRead || isOpen ? 'text-gray-500' : 'text-black'} 
        hover:bg-gray-100 transition-colors`}
            onClick={()=> clickHandler(dialog.id)}>
            <div className='flex space-x-1'>
                <UserRoleCircle role={dialog.user.role} width='w-8' height='h-8' withAvtar={true}/>
            </div>
            <div className='hidden md:block'>
                <Subtitle
                          label={dialog.user.name.length > 16 ?
                              (dialog.user.name.substring(0,14)+ "...") : dialog.user.name}/>
            </div>
            <div className='hidden md:block'>
                <Subtitle className='hidden md:block'
                        subTitle={new Date(dialog.updatedAt).toLocaleDateString()}/>
            </div>
            </article>
    );
}