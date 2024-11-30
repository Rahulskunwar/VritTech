export interface Task {
  id: string;
  content: string;
}

export interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: ColumnData };
  columnOrder: string[];
}
