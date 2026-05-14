"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CLASS_COLORS } from "@/lib/class-colors";
import { ClassIcon } from "@/components/ClassIcon";
import type { ClassStats } from "@/lib/types";

interface Props {
  data: ClassStats[];
  totalGames: number;
}

export function UsagePieChart({ data, totalGames }: Props) {
  const chartData = data.map(d => ({ name: d.className, value: d.usageRate }));

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={CLASS_COLORS[entry.name as keyof typeof CLASS_COLORS]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0d0e1a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(v) => [`${v}%`, "使用率"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <p className="text-xs text-muted-foreground">全体</p>
          <p className="text-sm font-bold leading-tight">{totalGames.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">試合</p>
        </div>
      </div>

      <div className="space-y-2 flex-1 min-w-0">
        {data.map(d => (
          <div key={d.className} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CLASS_COLORS[d.className] }}
              />
              <ClassIcon name={d.className} size={16} />
              <span className="text-muted-foreground truncate text-xs">{d.className}</span>
            </div>
            <span className="font-semibold text-sm shrink-0 ml-2">{d.usageRate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
