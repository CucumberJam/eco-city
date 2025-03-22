'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const exampleData = [
    {
        name: 'Page A',
        'стоимость': 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        'стоимость': 3000,
        pv: 1398,
        amt: 2210,
    },
    ]
const margin = {
    top: 10,
    right: 30,
    left: 0,
    bottom: 0,
}
export default function AreaChartCustom({data = exampleData}){
    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart  data={data}
                        width={500} height={400} margin={margin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="стоимость"
                      stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </ResponsiveContainer>
    );
}