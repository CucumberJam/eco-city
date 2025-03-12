import dynamic from 'next/dynamic'

const DynamicChart = dynamic(() => import('./Chart'), {
    loading: () => <p>Loading...</p>,
})

export default function LazyChart() {
    return <DynamicChart />
}