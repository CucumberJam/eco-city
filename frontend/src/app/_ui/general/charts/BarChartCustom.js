'use client';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const exampleData = [
    {
        name: 'Page A',
        'заявка': 4000,
        'отклик': 2400,
    },
    {
        name: 'Page B',
        'заявка': 3000,
        'отклик': 1398,
    },
    ]
export default function BarChartCustom({data = exampleData}){
    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}
                      width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="заявка" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                <Bar dataKey="отклик" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
        </ResponsiveContainer>
    )
}