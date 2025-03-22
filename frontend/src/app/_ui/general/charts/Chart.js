'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {useStats} from "@/app/_context/StatsProvider";
import {useMemo} from "react";
import {advertStatuses} from "@/app/_store/constants";

export default function Chart(){
    const {
        mode, type,
        advertsRecognitionPaginatedObject,
        advertsAcceptPaginatedObject,
        advertsPerformPaginatedObject,
        advertsDeclinedPaginatedObject,
        responsesRecognitionPaginatedObject,
        responsesAcceptPaginatedObject,
        responsesPerformPaginatedObject,
        responsesDeclinedPaginatedObject,
    } = useStats();

    const data = useMemo(()=>{
        const feature = type.id === 0 ? 'count' : (type.id === 1 ? 'late': 'coming')
        return [
            {
                name: advertStatuses[0],
                value: mode === 0 ? responsesRecognitionPaginatedObject.items?.[feature] || 0
                    : advertsRecognitionPaginatedObject.items?.[feature] || 0
            },
            {
                name: advertStatuses[2],
                value: mode === 0 ? responsesAcceptPaginatedObject.items?.[feature] || 0
                    : advertsAcceptPaginatedObject.items?.[feature] || 0
            },
            {
                name: advertStatuses[3],
                value: mode === 0 ? responsesPerformPaginatedObject.items?.[feature] || 0
                    : advertsPerformPaginatedObject.items?.[feature] || 0
            },
            {
                name: advertStatuses[1],
                value: mode === 0 ? responsesDeclinedPaginatedObject.items?.[feature] || 0 :
                    advertsDeclinedPaginatedObject.items?.[feature] || 0
            },
        ]
    }, [mode, type.id])

    const COLORS = ['#FFBB28', '#00C49F', '#0088FE', '#FF8042'];
//    const COLORSLate = ['#98caf6', '#67f7dc', '#ccae6e', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}