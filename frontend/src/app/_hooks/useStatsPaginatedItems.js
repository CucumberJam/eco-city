import usePaginatedItems from "@/app/_hooks/usePaginatedItems";
export default function useStatsPaginatedItems(getArgsFunc, serverAction){
    const recognitionPaginatedObject = usePaginatedItems({
        fetchFunc: serverAction,
        additionalArgs: getArgsFunc('На рассмотрении')
    });
    const acceptPaginatedObject = usePaginatedItems({
        fetchFunc: serverAction,
        additionalArgs: getArgsFunc('Принято')
    });
    const performPaginatedObject = usePaginatedItems({
        fetchFunc: serverAction,
        additionalArgs: getArgsFunc('Исполнено')
    });
    // {items, fetchAndSetItems, pagination, changePagination}
    return {recognitionPaginatedObject, acceptPaginatedObject, performPaginatedObject};
}