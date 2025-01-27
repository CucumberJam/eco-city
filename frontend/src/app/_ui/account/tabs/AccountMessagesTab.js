export default function AccountMessagesTab({mode, tabOption, tabAction}){
    return (
        <div>
            Messages tab content
            <p>{mode}</p>
            <p>{tabOption?.name}</p>
            <p>{tabAction}</p>
        </div>
    );
}