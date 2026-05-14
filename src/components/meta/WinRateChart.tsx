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
  ReferenceLine,
} from "recharts";
import type { ClassStats } from "@/lib/types";
import { CLASS_COLORS, CLASS_ICONS } from "@/lib/class-colors";

interface Props {
  data: ClassStats[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-card border border-border rounded-lg p-3 text-sm shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-muted-foreground">
        勝率: <span className={`font-bold ${val >= 50 ? "text-emerald-400" : "text-red-400"}`}>{val}%</span>
      </p>
    </div>
  );
}

export function WinRateChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.className,
    label: `${CLASS_ICONS[d.className]} ${d.className}`,
    winRate: d.winRate,
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
            domain={[40, 60]}
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
          <ReferenceLine x={50} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="winRate" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {chartData.map((entry, index) => {
              const stat = data[index];
              const color = stat.winRate >= 52 ? "#4ade80" : stat.winRate >= 50 ? "#facc15" : "#f87171";
              return <Cell key={entry.name} fill={color} opacity={0.85} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
