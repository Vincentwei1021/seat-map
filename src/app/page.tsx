"use client";

import { useState, useRef, useCallback } from "react";
import { Student, Seat, LayoutConfig, Marker } from "@/lib/types";
import { generateSeats, randomAssign, genderAlternate } from "@/lib/seating";
import StudentInput from "@/components/StudentInput";
import LayoutSelector from "@/components/LayoutSelector";
import SeatGrid from "@/components/SeatGrid";
import ExportControls from "@/components/ExportControls";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [config, setConfig] = useState<LayoutConfig>({
    mode: "traditional",
    rows: 6,
    cols: 8,
    groupSize: 4,
  });
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats({ mode: "traditional", rows: 6, cols: 8, groupSize: 4 }));
  const [genderAlt, setGenderAlt] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleConfigChange = useCallback(
    (newConfig: LayoutConfig) => {
      setConfig(newConfig);
      const newSeats = generateSeats(newConfig);
      if (students.length > 0) {
        if (genderAlt) {
          setSeats(genderAlternate(students, newSeats));
        } else {
          setSeats(randomAssign(students, newSeats));
        }
      } else {
        setSeats(newSeats);
      }
    },
    [students, genderAlt]
  );

  const handleRandomAssign = useCallback(() => {
    const freshSeats = generateSeats(config);
    setSeats(randomAssign(students, freshSeats));
  }, [students, config]);

  const handleGenderAlternate = useCallback(() => {
    const newGenderAlt = !genderAlt;
    setGenderAlt(newGenderAlt);
    const freshSeats = generateSeats(config);
    if (newGenderAlt) {
      setSeats(genderAlternate(students, freshSeats));
    } else {
      setSeats(randomAssign(students, freshSeats));
    }
  }, [students, config, genderAlt]);

  const handleStudentMarkerChange = useCallback(
    (studentId: string, marker: Marker) => {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, marker } : s))
      );
    },
    []
  );

  const handleStudentsChange = useCallback(
    (newStudents: Student[]) => {
      setStudents(newStudents);
    },
    []
  );

  return (
    <>
      <header className="no-print bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-primary rounded-lg flex items-center justify-center text-white text-lg">
            座
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">座位表生成器</h1>
            <p className="text-xs text-gray-500">在线班级座位编排工具</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Sidebar */}
          <aside className="no-print space-y-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <StudentInput onStudentsChange={handleStudentsChange} />
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <LayoutSelector config={config} onConfigChange={handleConfigChange} />
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">座位分配</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRandomAssign}
                  disabled={students.length === 0}
                  className="px-4 py-2 bg-teal-primary text-white rounded-lg text-sm font-medium hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  随机排座
                </button>
                <button
                  onClick={handleGenderAlternate}
                  disabled={students.length === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    genderAlt
                      ? "bg-teal-primary text-white"
                      : "border border-teal-primary text-teal-primary hover:bg-teal-primary/5"
                  }`}
                >
                  {genderAlt ? "男女间隔 ✓" : "男女间隔"}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                座位总数：{seats.length} · 已分配：{seats.filter((s) => s.studentId).length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">导出</h2>
              <ExportControls
                students={students}
                seats={seats}
                config={config}
                seatGridRef={gridRef}
              />
            </div>
          </aside>

          {/* Main Content */}
          <section>
            <SeatGrid
              students={students}
              seats={seats}
              config={config}
              onSeatsChange={setSeats}
              onStudentMarkerChange={handleStudentMarkerChange}
              gridRef={gridRef}
            />
          </section>
        </div>
      </main>

      <footer className="no-print border-t border-gray-200 py-3 min-h-[44px]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between text-xs text-gray-400">
          <span>&copy; 2026 ToolboxLite</span>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-gray-600 transition-colors py-3 min-h-[44px] inline-flex items-center">
              隐私政策
            </a>
            <a href="/terms" className="hover:text-gray-600 transition-colors py-3 min-h-[44px] inline-flex items-center">
              使用条款
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
