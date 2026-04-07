"use client";

import { LayoutMode, LayoutConfig } from "@/lib/types";

interface LayoutSelectorProps {
  config: LayoutConfig;
  onConfigChange: (config: LayoutConfig) => void;
}

const LAYOUT_OPTIONS: { mode: LayoutMode; label: string; desc: string }[] = [
  { mode: "traditional", label: "秧田式", desc: "标准行列排列" },
  { mode: "ushape", label: "马蹄形", desc: "U型座位排列" },
  { mode: "group", label: "小组式", desc: "分组围坐排列" },
];

export default function LayoutSelector({
  config,
  onConfigChange,
}: LayoutSelectorProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">布局模式</h2>
      <div className="grid grid-cols-3 gap-2">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            onClick={() => onConfigChange({ ...config, mode: opt.mode })}
            className={`p-3 rounded-lg border-2 text-center transition-colors ${
              config.mode === opt.mode
                ? "border-teal-primary bg-teal-primary/5 text-teal-primary"
                : "border-gray-200 hover:border-gray-300 text-gray-600"
            }`}
          >
            <div className="font-medium text-sm">{opt.label}</div>
            <div className="text-xs mt-0.5 opacity-70">{opt.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-sm text-gray-600">行数</span>
          <input
            type="number"
            min={1}
            max={15}
            value={config.rows}
            onChange={(e) =>
              onConfigChange({ ...config, rows: Math.max(1, Math.min(15, Number(e.target.value))) })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-gray-600">列数</span>
          <input
            type="number"
            min={1}
            max={15}
            value={config.cols}
            onChange={(e) =>
              onConfigChange({ ...config, cols: Math.max(1, Math.min(15, Number(e.target.value))) })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary"
          />
        </label>
      </div>

      {config.mode === "group" && (
        <label className="space-y-1 block">
          <span className="text-sm text-gray-600">每组人数</span>
          <input
            type="number"
            min={4}
            max={6}
            value={config.groupSize}
            onChange={(e) =>
              onConfigChange({
                ...config,
                groupSize: Math.max(4, Math.min(6, Number(e.target.value))),
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary"
          />
        </label>
      )}
    </div>
  );
}
