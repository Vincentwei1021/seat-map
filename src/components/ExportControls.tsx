"use client";

import { useCallback } from "react";
import { Student, Seat, LayoutConfig } from "@/lib/types";

interface ExportControlsProps {
  students: Student[];
  seats: Seat[];
  config: LayoutConfig;
  seatGridRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportControls({
  students,
  seats,
  config,
  seatGridRef,
}: ExportControlsProps) {
  const handleExportPNG = useCallback(async () => {
    if (!seatGridRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(seatGridRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "座位表.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [seatGridRef]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopyText = useCallback(() => {
    const studentMap = new Map(students.map((s) => [s.id, s]));
    const maxRow = Math.max(...seats.map((s) => s.row), 0);
    const maxCol = Math.max(...seats.map((s) => s.col), 0);

    const lines: string[] = [];
    const modeLabels = { traditional: "秧田式", ushape: "马蹄形", group: "小组式" };
    lines.push(`【${modeLabels[config.mode]}座位表】`);
    lines.push("┌─────────── 讲 台 ───────────┐");
    lines.push("");

    for (let r = 0; r <= maxRow; r++) {
      const row: string[] = [];
      for (let c = 0; c <= maxCol; c++) {
        const seat = seats.find((s) => s.row === r && s.col === c);
        if (seat && seat.studentId) {
          const student = studentMap.get(seat.studentId);
          const name = student ? student.name : "空";
          row.push(name.padEnd(4, "　"));
        } else if (seat) {
          row.push("____");
        }
      }
      if (row.length > 0) lines.push(row.join("  "));
    }

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      alert("座位表已复制到剪贴板！");
    });
  }, [students, seats, config]);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleExportPNG}
        className="px-4 py-2 bg-teal-primary text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors"
      >
        导出为图片
      </button>
      <button
        onClick={handlePrint}
        className="px-4 py-2 border border-teal-primary text-teal-primary rounded-lg text-sm font-medium hover:bg-teal-primary/5 transition-colors"
      >
        打印座位表
      </button>
      <button
        onClick={handleCopyText}
        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:border-gray-400 transition-colors"
      >
        复制为文本
      </button>
    </div>
  );
}
