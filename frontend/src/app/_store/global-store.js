import { createStore } from 'zustand/vanilla'

export const defaultInitState = {
    cities: [],
    currentCity: null,
    roles: [],
    currentRole: null,
    wastes: [],
    currentWaste: null,
    wasteTypes: [],
    currentWasteType: null,
    users: {count: 0, rows: []},
    query: '',
    currentUser: null,
    dimensions: [],
}

export const createGlobalUIStore = (initState = defaultInitState) => {
    return createStore()((set) => ({
        ...initState,
        setCurrentCity: (payload) => set(() => ({ currentCity: payload})),
        setCities: (payload) => set((state) => ({...state, cities: [...payload]})),
        setRoles: (payload) => set((state) => ({...state, roles: [...payload]})),
        setCurrentRole: (payload) => set(() => ({ currentRole: payload})),
        setWastes: (payload) => set((state) => ({ ...state, wastes: [...payload]})),
        setCurrentWaste: (payload) => set(() => ({ currentWaste: payload})),
        setWasteTypes: (payload) => set((state) => ({ ...state, wasteTypes: [...payload]})),
        setCurrentWasteType: (payload) => set(() => ({ currentWasteType: payload})),
        setUsers: (payload) => set((state) => ({users: {...payload}})),
        setQuery: (payload) => set(() => ({ query: payload})),
        setCurrentUser: (payload) => set(() => ({ currentUser: payload})),
        setDimensions: (payload) => set((state) => ({ ...state, dimensions: [...payload]})),
        reset: ()=> { set(defaultInitState)}
    }))
}

