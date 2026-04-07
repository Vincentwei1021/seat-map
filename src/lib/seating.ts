import { Student, Seat, LayoutConfig } from "./types";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateSeats(config: LayoutConfig): Seat[] {
  const seats: Seat[] = [];
  if (config.mode === "traditional") {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        seats.push({ row: r, col: c, studentId: null });
      }
    }
  } else if (config.mode === "ushape") {
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const isInterior = r > 0 && r < config.rows - 1 && c > 0 && c < config.cols - 1;
        if (!isInterior) {
          seats.push({ row: r, col: c, studentId: null });
        }
      }
    }
  } else if (config.mode === "group") {
    const groupSize = config.groupSize;
    const groupCols = Math.ceil(config.cols / 2);
    const groupRows = Math.ceil(config.rows / Math.ceil(groupSize / 2));
    for (let gr = 0; gr < groupRows; gr++) {
      for (let gc = 0; gc < groupCols; gc++) {
        const seatsPerSide = Math.ceil(groupSize / 2);
        for (let s = 0; s < seatsPerSide; s++) {
          seats.push({ row: gr * (seatsPerSide + 1) + s, col: gc * 3, studentId: null });
          seats.push({ row: gr * (seatsPerSide + 1) + s, col: gc * 3 + 1, studentId: null });
        }
      }
    }
  }
  return seats;
}

export function randomAssign(students: Student[], seats: Seat[]): Seat[] {
  const shuffled = shuffle(students);
  return seats.map((seat, i) => ({
    ...seat,
    studentId: i < shuffled.length ? shuffled[i].id : null,
  }));
}

export function genderAlternate(students: Student[], seats: Seat[]): Seat[] {
  const males = shuffle(students.filter((s) => s.gender === "male"));
  const females = shuffle(students.filter((s) => s.gender === "female"));
  const unknowns = shuffle(students.filter((s) => s.gender === "unknown"));

  const interleaved: Student[] = [];
  let mi = 0,
    fi = 0;
  let lastGender: "male" | "female" | null = null;

  while (mi < males.length || fi < females.length) {
    if (mi < males.length && (lastGender !== "male" || fi >= females.length)) {
      interleaved.push(males[mi++]);
      lastGender = "male";
    } else if (fi < females.length) {
      interleaved.push(females[fi++]);
      lastGender = "female";
    }
  }

  interleaved.push(...unknowns);

  return seats.map((seat, i) => ({
    ...seat,
    studentId: i < interleaved.length ? interleaved[i].id : null,
  }));
}

export function parseStudents(text: string): Student[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => {
      let name = line;
      let gender: "male" | "female" | "unknown" = "unknown";

      const matchParen = line.match(/^(.+?)[（(](男|女)[）)]$/);
      const matchSpace = line.match(/^(.+?)\s+(男|女)$/);

      if (matchParen) {
        name = matchParen[1].trim();
        gender = matchParen[2] === "男" ? "male" : "female";
      } else if (matchSpace) {
        name = matchSpace[1].trim();
        gender = matchSpace[2] === "男" ? "male" : "female";
      }

      return {
        id: `student-${index}-${Date.now()}`,
        name,
        gender,
        marker: "none" as const,
      };
    });
}

export const SAMPLE_STUDENTS = `张三(男)
李四(女)
王五(男)
赵六(女)
孙七(男)
周八(女)
吴九(男)
郑十(女)
钱十一(男)
冯十二(女)
陈十三(男)
褚十四(女)
卫十五(男)
蒋十六(女)
沈十七(男)
韩十八(女)
杨十九(男)
朱二十(女)
秦二一(男)
尤二二(女)
许二三(男)
何二四(女)
吕二五(男)
施二六(女)
马二七(男)
苗二八(女)
凤二九(男)
花三十(女)
方三一(男)
任三二(女)
袁三三(男)
柳三四(女)
邓三五(男)
萧三六(女)
唐三七(男)
费三八(女)
廉三九(男)
岑四十(女)`;
