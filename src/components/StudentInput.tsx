"use client";

import { useState } from "react";
import { Student } from "@/lib/types";
import { parseStudents, SAMPLE_STUDENTS } from "@/lib/seating";

interface StudentInputProps {
  onStudentsChange: (students: Student[]) => void;
}

const PRESET_SIZES = [20, 30, 40, 50];

export default function StudentInput({ onStudentsChange }: StudentInputProps) {
  const [text, setText] = useState("");

  function handleTextChange(value: string) {
    setText(value);
    const students = parseStudents(value);
    onStudentsChange(students);
  }

  function handlePreset(size: number) {
    const lines = SAMPLE_STUDENTS.split("\n").slice(0, size);
    const value = lines.join("\n");
    setText(value);
    onStudentsChange(parseStudents(value));
  }

  function handleSampleFill() {
    setText(SAMPLE_STUDENTS);
    onStudentsChange(parseStudents(SAMPLE_STUDENTS));
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">学生名单</h2>
      <textarea
        className="w-full h-40 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary resize-y"
        placeholder={"每行一个学生姓名，可标注性别：\n张三(男)\n李四(女)\n王五 男\n赵六"}
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 leading-8">预设人数：</span>
        {PRESET_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => handlePreset(size)}
            className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:border-teal-primary hover:text-teal-primary transition-colors"
          >
            {size}人
          </button>
        ))}
        <button
          onClick={handleSampleFill}
          className="px-3 py-1 text-sm rounded-md bg-teal-primary text-white hover:bg-teal-dark transition-colors"
        >
          填充示例数据
        </button>
      </div>
      <p className="text-xs text-gray-400">
        已输入 {parseStudents(text).length} 名学生
        {" · "}
        支持格式：姓名(男)、姓名(女)、姓名 男、姓名 女
      </p>
    </div>
  );
}
