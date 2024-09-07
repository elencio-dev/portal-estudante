export interface Document {
    id: string
    name: string
    fileUrl: string | null
    fileName: string
    institute: { name: string }
    course: { name: string }
    professor: string
    semester: { name: string }
    discipline: { name: string }
  }

  export interface DocumentDataInterface {
    name: string;
    professor: string;
    semester: string;
    discipline: string;
    fileUrl?: string;
    fileName: string;
    file?: File;
  }

export interface Institute { name: string }
export interface Course { id: string; name: string }
export interface Semester { id: string; name: string }
export interface Discipline { id: string; name: string }