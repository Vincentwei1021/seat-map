export type Gender = "male" | "female" | "unknown";

export type Marker = "none" | "monitor" | "rep" | "attention";

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  marker: Marker;
}

export interface Seat {
  row: number;
  col: number;
  studentId: string | null;
}

export type LayoutMode = "traditional" | "ushape" | "group";

export interface LayoutConfig {
  mode: LayoutMode;
  rows: number;
  cols: number;
  groupSize: number;
}
