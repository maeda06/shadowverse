"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { ClassStats } from "@/lib/types";
import { CLASS_COLORS, CLASS_ICONS } from "@/lib/class-colors";

interface Props {
  data: ClassStats[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const stat = payload[0];
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-muted-foreground">
        {stat.name === "usageRate" ? "使用率" : "勝率"}:{" "}
        <span className="text-foreground font-bold">{stat.value}%</span>
      </p>
    </div>
  );
}

export function ClassUsageChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.className,
    label: `${CLASS_ICONS[d.className]} ${d.className}`,
    usageRate: d.usageRate,
    diff: +(d.usageRate - d.prevUsageRate).toFixed(1),
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 35]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="usageRate" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={CLASS_COLORS[entry.name as keyof typeof CLASS_COLORS]}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
