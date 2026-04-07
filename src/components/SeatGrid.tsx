"use client";

import { useState, useCallback, DragEvent } from "react";
import { Student, Seat, Marker, LayoutConfig } from "@/lib/types";

interface SeatGridProps {
  students: Student[];
  seats: Seat[];
  config: LayoutConfig;
  onSeatsChange: (seats: Seat[]) => void;
  onStudentMarkerChange: (studentId: string, marker: Marker) => void;
  gridRef: React.RefObject<HTMLDivElement | null>;
}

const MARKER_CYCLE: Marker[] = ["none", "monitor", "rep", "attention"];
const MARKER_INFO: Record<Marker, { symbol: string; label: string; bg: string }> = {
  none: { symbol: "", label: "", bg: "" },
  monitor: { symbol: "★", label: "班长", bg: "bg-amber-100 border-amber-400" },
  rep: { symbol: "●", label: "课代表", bg: "bg-blue-100 border-blue-400" },
  attention: { symbol: "▲", label: "需关注", bg: "bg-red-100 border-red-400" },
};

export default function SeatGrid({
  students,
  seats,
  config,
  onSeatsChange,
  onStudentMarkerChange,
  gridRef,
}: SeatGridProps) {
  const [draggedStudentId, setDraggedStudentId] = useState<string | null>(null);
  const [dragSourceType, setDragSourceType] = useState<"seat" | "unassigned" | null>(null);
  const [dragSourceSeatIdx, setDragSourceSeatIdx] = useState<number | null>(null);

  const studentMap = new Map(students.map((s) => [s.id, s]));
  const assignedIds = new Set(seats.map((s) => s.studentId).filter(Boolean));
  const unassigned = students.filter((s) => !assignedIds.has(s.id));

  const handleDragStartFromSeat = useCallback(
    (e: DragEvent, seatIndex: number, studentId: string) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", studentId);
      setDraggedStudentId(studentId);
      setDragSourceType("seat");
      setDragSourceSeatIdx(seatIndex);
    },
    []
  );

  const handleDragStartFromUnassigned = useCallback(
    (e: DragEvent, studentId: string) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", studentId);
      setDraggedStudentId(studentId);
      setDragSourceType("unassigned");
      setDragSourceSeatIdx(null);
    },
    []
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDropOnSeat = useCallback(
    (e: DragEvent, targetSeatIdx: number) => {
      e.preventDefault();
      const studentId = e.dataTransfer.getData("text/plain");
      if (!studentId) return;

      const newSeats = [...seats];
      const targetSeat = newSeats[targetSeatIdx];
      const existingStudentId = targetSeat.studentId;

      if (dragSourceType === "seat" && dragSourceSeatIdx !== null) {
        // Swap: put target seat's student into source seat
        newSeats[dragSourceSeatIdx] = {
          ...newSeats[dragSourceSeatIdx],
          studentId: existingStudentId,
        };
      }

      newSeats[targetSeatIdx] = { ...targetSeat, studentId };
      onSeatsChange(newSeats);
      setDraggedStudentId(null);
      setDragSourceType(null);
      setDragSourceSeatIdx(null);
    },
    [seats, onSeatsChange, dragSourceType, dragSourceSeatIdx]
  );

  const handleDropOnUnassigned = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      const studentId = e.dataTransfer.getData("text/plain");
      if (!studentId || dragSourceType !== "seat" || dragSourceSeatIdx === null) return;

      const newSeats = [...seats];
      newSeats[dragSourceSeatIdx] = {
        ...newSeats[dragSourceSeatIdx],
        studentId: null,
      };
      onSeatsChange(newSeats);
      setDraggedStudentId(null);
      setDragSourceType(null);
      setDragSourceSeatIdx(null);
    },
    [seats, onSeatsChange, dragSourceType, dragSourceSeatIdx]
  );

  const handleSeatClick = useCallback(
    (seatIdx: number) => {
      const seat = seats[seatIdx];
      if (!seat.studentId) return;
      const student = studentMap.get(seat.studentId);
      if (!student) return;

      const currentIndex = MARKER_CYCLE.indexOf(student.marker);
      const nextMarker = MARKER_CYCLE[(currentIndex + 1) % MARKER_CYCLE.length];
      onStudentMarkerChange(student.id, nextMarker);
    },
    [seats, studentMap, onStudentMarkerChange]
  );

  const maxRow = seats.length > 0 ? Math.max(...seats.map((s) => s.row)) : 0;
  const maxCol = seats.length > 0 ? Math.max(...seats.map((s) => s.col)) : 0;
  const seatLookup = new Map<string, number>();
  seats.forEach((s, i) => seatLookup.set(`${s.row}-${s.col}`, i));

  function renderTraditionalGrid() {
    const rows: React.ReactNode[] = [];
    for (let r = 0; r <= maxRow; r++) {
      const cols: React.ReactNode[] = [];
      for (let c = 0; c <= maxCol; c++) {
        const seatIdx = seatLookup.get(`${r}-${c}`);
        if (seatIdx !== undefined) {
          cols.push(renderSeatCell(seatIdx, c));
        }
      }
      rows.push(
        <div key={r} className="flex gap-1 justify-center">
          {cols}
        </div>
      );
    }
    return rows;
  }

  function renderUShapeGrid() {
    const rows: React.ReactNode[] = [];
    for (let r = 0; r <= maxRow; r++) {
      const cols: React.ReactNode[] = [];
      for (let c = 0; c <= maxCol; c++) {
        const seatIdx = seatLookup.get(`${r}-${c}`);
        if (seatIdx !== undefined) {
          cols.push(renderSeatCell(seatIdx, c));
        } else {
          const isInterior = r > 0 && r < maxRow && c > 0 && c < maxCol;
          if (isInterior) {
            cols.push(
              <div
                key={`empty-${r}-${c}`}
                className="w-16 h-14 sm:w-20 sm:h-16"
              />
            );
          }
        }
      }
      rows.push(
        <div key={r} className="flex gap-1 justify-center">
          {cols}
        </div>
      );
    }
    return rows;
  }

  function renderGroupGrid() {
    if (seats.length === 0) return null;
    const groupSize = config.groupSize;
    const seatsPerSide = Math.ceil(groupSize / 2);
    const rowSpan = seatsPerSide + 1;
    const groupCols = Math.ceil(config.cols / 2);
    const groupRows = Math.ceil(config.rows / Math.ceil(groupSize / 2));

    const groups: React.ReactNode[] = [];
    for (let gr = 0; gr < groupRows; gr++) {
      const groupRow: React.ReactNode[] = [];
      for (let gc = 0; gc < groupCols; gc++) {
        const groupSeats: React.ReactNode[] = [];
        for (let s = 0; s < seatsPerSide; s++) {
          const leftIdx = seatLookup.get(`${gr * rowSpan + s}-${gc * 3}`);
          const rightIdx = seatLookup.get(`${gr * rowSpan + s}-${gc * 3 + 1}`);
          groupSeats.push(
            <div key={s} className="flex gap-0.5">
              {leftIdx !== undefined ? renderSeatCell(leftIdx, gc * 3) : <div className="w-16 h-14 sm:w-20 sm:h-16" />}
              {rightIdx !== undefined ? renderSeatCell(rightIdx, gc * 3 + 1) : <div className="w-16 h-14 sm:w-20 sm:h-16" />}
            </div>
          );
        }
        groupRow.push(
          <div
            key={gc}
            className="border-2 border-dashed border-teal-primary/30 rounded-lg p-1.5 flex flex-col gap-0.5"
          >
            {groupSeats}
          </div>
        );
      }
      groups.push(
        <div key={gr} className="flex gap-3 justify-center">
          {groupRow}
        </div>
      );
    }
    return groups;
  }

  function renderSeatCell(seatIdx: number, _col: number) {
    const seat = seats[seatIdx];
    const student = seat.studentId ? studentMap.get(seat.studentId) : null;
    const marker = student ? MARKER_INFO[student.marker] : null;
    const hasMarker = marker && student && student.marker !== "none";

    return (
      <div
        key={`seat-${seatIdx}`}
        className={`w-16 h-14 sm:w-20 sm:h-16 rounded-md flex flex-col items-center justify-center text-xs cursor-pointer select-none transition-all ${
          student
            ? hasMarker
              ? `${marker.bg} border-2`
              : "bg-white border border-gray-300 hover:border-teal-primary"
            : "border-2 border-dashed border-gray-300 hover:border-teal-primary/50"
        } ${draggedStudentId ? "hover:bg-teal-primary/10" : ""}`}
        draggable={!!student}
        onDragStart={(e) =>
          student && handleDragStartFromSeat(e, seatIdx, student.id)
        }
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnSeat(e, seatIdx)}
        onClick={() => handleSeatClick(seatIdx)}
        title={
          student
            ? `${student.name}${hasMarker ? ` (${marker.label})` : ""} - 点击切换标记`
            : "空座位 - 拖入学生"
        }
      >
        {student ? (
          <>
            <span className="font-medium text-gray-800 truncate max-w-[56px] sm:max-w-[72px]">
              {hasMarker && (
                <span className="mr-0.5">{marker.symbol}</span>
              )}
              {student.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {student.gender === "male" ? "男" : student.gender === "female" ? "女" : ""}
            </span>
          </>
        ) : (
          <span className="text-gray-300 text-lg">+</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={gridRef} className="seat-grid-container bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        {/* Podium */}
        <div className="text-center mb-4">
          <div className="inline-block px-8 py-2 bg-teal-primary/10 border border-teal-primary/30 rounded-md text-sm font-medium text-teal-primary">
            讲 台
          </div>
        </div>

        {/* Seat Grid */}
        <div className="flex flex-col gap-1">
          {config.mode === "traditional" && renderTraditionalGrid()}
          {config.mode === "ushape" && renderUShapeGrid()}
          {config.mode === "group" && renderGroupGrid()}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-3 text-xs text-gray-500">
          <span>★ 班长</span>
          <span>● 课代表</span>
          <span>▲ 需关注</span>
          <span className="text-gray-400">| 点击座位切换标记</span>
        </div>
      </div>

      {/* Unassigned Students */}
      {unassigned.length > 0 && (
        <div
          className="bg-white rounded-xl p-4 border border-gray-200"
          onDragOver={handleDragOver}
          onDrop={handleDropOnUnassigned}
        >
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            未分配学生（{unassigned.length}人）- 拖拽到座位上
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((student) => (
              <div
                key={student.id}
                draggable
                onDragStart={(e) => handleDragStartFromUnassigned(e, student.id)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs cursor-grab hover:border-teal-primary hover:bg-teal-primary/5 transition-colors"
              >
                {student.name}
                {student.gender !== "unknown" && (
                  <span className="ml-1 text-gray-400">
                    {student.gender === "male" ? "♂" : "♀"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
