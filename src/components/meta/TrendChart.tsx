"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CLASS_COLORS } from "@/lib/class-colors";
import type { ClassName } from "@/lib/types";

interface Props {
  data: Record<string, number | string>[];
  classes: ClassName[];
}

export function TrendChart({ data, classes }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="week"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 35]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value}%`]}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>}
        />
        {classes.map((cls) => (
          <Line
            key={cls}
            type="monotone"
            dataKey={cls}
            stroke={CLASS_COLORS[cls]}
            strokeWidth={2}
            dot={{ fill: CLASS_COLORS[cls], r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
