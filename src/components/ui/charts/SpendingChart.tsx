'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function SpendingChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full glass p-4 rounded-3xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Monthly Spending</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ background: '#121212', border: '1px solid #333', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
