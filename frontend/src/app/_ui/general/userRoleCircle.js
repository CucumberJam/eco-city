export default function UserRoleCircle({role = null, height = 'h-20', width = 'w-20'}){
    return (
        <div className={`rounded-full ${height} ${width}`}
             style={{backgroundColor: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : (!role ? 'red' : '#60b6ff'))}}></div>
    );
}