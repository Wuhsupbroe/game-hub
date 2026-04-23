"use client";

import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const data = [
  { name: "Mon", hours: 2 },
  { name: "Tue", hours: 4 },
  { name: "Wed", hours: 3 },
  { name: "Thu", hours: 5 },
  { name: "Fri", hours: 8 },
  { name: "Sat", hours: 12 },
  { name: "Sun", hours: 10 },
];

export function PlaytimeChart() {
  return (
    <div className="w-full h-[150px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#ffffff50" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
            labelStyle={{ color: "#aaa" }}
            itemStyle={{ color: "#ff69b4" }}
          />
          <Bar 
            dataKey="hours" 
            fill="oklch(0.65 0.3 320)" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
