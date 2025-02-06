export default function UserRoleCircle({role, height = 'h-20', width = 'w-20'}){
    return (
        <div className={`rounded-full ${height} ${width}`}
             style={{backgroundColor: role === 'PRODUCER' ? '#FFC833': (role === 'RECYCLER' ? '#53D1B6' : '#60b6ff')}}></div>
    );
}