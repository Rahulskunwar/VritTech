import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from './Column';
import { BoardData, Task } from '../types';

const initialData: BoardData = {
  tasks: {},
  columns: {},
  columnOrder: [],
};

const Board: React.FC = () => {
  const [data, setData] = useState<BoardData>(() => {
    const saved = localStorage.getItem('kanbanData');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('kanbanData', JSON.stringify(data));
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        columnOrder: newColumnOrder,
      });
    } else {
      const startColumn = data.columns[source.droppableId];
      const endColumn = data.columns[destination.droppableId];

      if (startColumn === endColumn) {
        const newTaskIds = Array.from(startColumn.taskIds);
        newTaskIds.splice(source.index, 1);
        newTaskIds.splice(destination.index, 0, draggableId);

        const newColumn = { ...startColumn, taskIds: newTaskIds };
        setData({
          ...data,
          columns: { ...data.columns, [newColumn.id]: newColumn },
        });
      } else {
        const startTaskIds = Array.from(startColumn.taskIds);
        startTaskIds.splice(source.index, 1);

        const newStart = { ...startColumn, taskIds: startTaskIds };

        const endTaskIds = Array.from(endColumn.taskIds);
        endTaskIds.splice(destination.index, 0, draggableId);

        const newEnd = { ...endColumn, taskIds: endTaskIds };

        setData({
          ...data,
          columns: { ...data.columns, [newStart.id]: newStart, [newEnd.id]: newEnd },
        });
      }
    }
  };

  const addColumn = () => {
    if (!newColumnName.trim()) {
      alert('Please enter a column name!');
      return;
    }

    const newColumnId = `column-${Object.keys(data.columns).length + 1}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnName.trim(),
      taskIds: [],
    };

    setData({
      ...data,
      columns: { ...data.columns, [newColumnId]: newColumn },
      columnOrder: [...data.columnOrder, newColumnId],
    });

    setNewColumnName('');
  };

  const addTask = () => {
    if (!newTaskContent.trim() || !selectedColumnId) {
      alert('Please enter a task and select a column!');
      return;
    }

    const newTaskId = `task-${Object.keys(data.tasks).length + 1}`;
    const newTask: Task = {
      id: newTaskId,
      content: newTaskContent.trim(),
    };

    setData({
      ...data,
      tasks: { ...data.tasks, [newTaskId]: newTask },
      columns: {
        ...data.columns,
        [selectedColumnId]: {
          ...data.columns[selectedColumnId],
          taskIds: [...data.columns[selectedColumnId].taskIds, newTaskId],
        },
      },
    });

    setNewTaskContent('');
  };

  const deleteTask = (taskId: string, columnId: string) => {
    const updatedTasks = { ...data.tasks };
    delete updatedTasks[taskId];

    const updatedColumn = {
      ...data.columns[columnId],
      taskIds: data.columns[columnId].taskIds.filter((id) => id !== taskId),
    };

    setData({
      ...data,
      tasks: updatedTasks,
      columns: {
        ...data.columns,
        [columnId]: updatedColumn,
      },
    });
  };

  const deleteColumn = (columnId: string) => {
    const { [columnId]: _, ...remainingColumns } = data.columns;

    const updatedTasks = { ...data.tasks };
    data.columns[columnId].taskIds.forEach((taskId) => {
      delete updatedTasks[taskId];
    });

    setData({
      tasks: updatedTasks,
      columns: remainingColumns,
      columnOrder: data.columnOrder.filter((id) => id !== columnId),
    });
  };

  return (
    <div style={{ backgroundColor: '#f4f7fc', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginRight: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <input
          type="text"
          placeholder="New column name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginRight: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <button
          onClick={addColumn}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c5ce7',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Add Column
        </button>
      </div>

      {}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', justifyContent: 'space-between' }}>
        <select
          value={selectedColumnId || ''}
          onChange={(e) => setSelectedColumnId(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            marginRight: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <option value="">Select Column</option>
          {data.columnOrder.map((columnId) => (
            <option key={columnId} value={columnId}>
              {data.columns[columnId].title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New task content"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          style={{
            padding: '8px',
            flex: 1,
            borderRadius: '4px',
            marginRight: '16px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: '8px 16px',
            backgroundColor: '#00b894',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Add Task
        </button>
      </div>

      {}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px', padding: '16px', flexWrap: 'wrap' }}>
          {data.columnOrder.map((columnId, index) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds
              .map((taskId) => data.tasks[taskId])
              .filter((task) => task.content.toLowerCase().includes(searchTerm.toLowerCase()));

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                index={index}
                onDeleteColumn={() => deleteColumn(column.id)}
                onDeleteTask={deleteTask}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
