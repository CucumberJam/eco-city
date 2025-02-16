export default function UserRoleCircle({role = null,
                                           height = 'h-20',
                                           width = 'w-20',
                                       withAvtar = false}){
    return (
        <div className={`rounded-full ${height} ${width}`}
             style={{backgroundColor: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : (!role ? 'red' : '#60b6ff'))}}>
            {withAvtar && <div className='relative'>
                <div className={`rounded-full relative overflow-hidden ${height} ${width}`}
                     data-testid="flowbite-avatar-img">
                    <svg className="absolute -bottom-1 h-auto w-auto text-gray-500"
                         fill="currentColor"
                         viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd">

                        </path>
                    </svg>
                </div>
            </div>}
        </div>
    );
}