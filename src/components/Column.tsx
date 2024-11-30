import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ColumnData, Task } from '../types';

interface ColumnProps {
  column: ColumnData;
  tasks: Task[];
  index: number;
  onDeleteColumn: () => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, index, onDeleteColumn, onDeleteTask }) => {
  return (
    <div
      style={{
        width: '300px',
        padding: '16px',
        border: '1px solid lightgray',
        borderRadius: '8px',
        backgroundColor: '#f4f4f4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3>{column.title}</h3>
        <button onClick={onDeleteColumn} style={{ padding: '8px', cursor: 'pointer' }}>
          Delete Column
        </button>
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              backgroundColor: snapshot.isDraggingOver ? 'lightblue' : 'inherit',
              padding: '8px',
              minHeight: '100px',
            }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      padding: '12px',
                      marginBottom: '8px',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      ...provided.draggableProps.style,
                    }}
                  >
                    {task.content}
                    <button
                      onClick={() => onDeleteTask(task.id, column.id)}
                      style={{
                        marginLeft: '90px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete Task
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
