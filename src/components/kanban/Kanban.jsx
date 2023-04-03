import React, { useState } from 'react';
import './Kanban.css';

import { useSelector, useDispatch } from 'react-redux';
import {
  addColumn,
  deleteColumn,
  addTask,
  deleteTask,
  moveTask,
} from './Utils/kanbanSlice';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './Droppable';

function Kanban() {
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const columns = useSelector((state) => state.kanban.columns);

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleColumnAdd = () => {
    if (newColumnTitle !== '') {
      dispatch(addColumn(newColumnTitle));
      setNewColumnTitle('');
    }
  };

  const handleTaskAdd = (columnId) => {
    if (newTaskTitle !== '') {
      dispatch(addTask({ columnId, title: newTaskTitle }));
      setNewTaskTitle('');
    }
  };

  const handleColumnDelete = (columnId) => {
    dispatch(deleteColumn(columnId));
  };

  const handleTaskDelete = (columnId, taskId) => {
    dispatch(deleteTask({ columnId, taskId }));
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(
      (column) => column.id.toString() === source.droppableId
    );
    const destinationColumn = columns.find(
      (column) => column.id.toString() === destination.droppableId
    );
    const task = sourceColumn.tasks[source.index];

    if (sourceColumn === destinationColumn) {
      console.log('here');
      dispatch(
        moveTask({
          columnId: sourceColumn.id,
          fromIndex: source.index,
          toIndex: destination.index,
        })
      );
    } else {
      dispatch(deleteTask({ columnId: sourceColumn.id, taskId: task.id }));
      dispatch(
        addTask({
          columnId: destinationColumn.id,
          title: task.title,
          index: destination.index,
        })
      );
    }
  };

  return (
    <section id='kanban'>
      <h5>What I'm upto on my</h5>
      <h2
        className='kanban-board'
        onClick={(e) => {
          e.stopPropagation();
          setIsAdmin(!isAdmin);
        }}
      >
        Kanban Board
      </h2>
      <div className='columns-container'>
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <div key={column.id} className='column'>
              <h2>{column.title}</h2>
              <StrictModeDroppable droppableId={column.id.toString()}>
                {(provided) => (
                  <ul
                    className='task-list'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className='task'
                          >
                            {task.title}
                            {isAdmin && (
                              <button
                                className='delete-task'
                                onClick={() =>
                                  handleTaskDelete(column.id, task.id)
                                }
                              >
                                X
                              </button>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
              {isAdmin && (
                <>
                  <div className='add-task-container'>
                    <input
                      type='text'
                      placeholder='Add Task'
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button onClick={() => handleTaskAdd(column.id)}>+</button>
                  </div>
                  <button
                    className='delete-column'
                    onClick={() => handleColumnDelete(column.id)}
                  >
                    Delete Column
                  </button>
                </>
              )}
            </div>
          ))}
          {isAdmin && (
            <div className='column'>
              <h2>Add new column</h2>

              <input
                className='add-column-input'
                type='text'
                placeholder='Add Column'
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <button className='add-column-button' onClick={handleColumnAdd}>
                +
              </button>
            </div>
          )}
        </DragDropContext>
      </div>
    </section>
  );
}

export default Kanban;
