import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  addColumn,
  deleteColumn,
  addTask,
  deleteTask,
} from "./Utils/kanbanSlice";

import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./Droppable";

function Kanban() {
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const columns = useSelector((state) => state.kanban.columns);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleColumnAdd = () => {
    if (newColumnTitle !== "") {
      dispatch(addColumn(newColumnTitle));
      setNewColumnTitle("");
    }
  };

  const handleTaskAdd = (columnId) => {
    if (newTaskTitle !== "") {
      dispatch(addTask({ columnId, title: newTaskTitle }));
      setNewTaskTitle("");
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

    dispatch(deleteTask({ columnId: sourceColumn.id, taskId: task.id }));
    dispatch(
      addTask({
        columnId: destinationColumn.id,
        title: task.title,
        index: destination.index,
      })
    );
  };

  return (
    <section id="kanban">
      <h5>What I'm upto on my</h5>
      <h2
        className="flex flex-col items-center font-sans"
        onClick={(e) => {
          e.stopPropagation();
          setIsAdmin(!isAdmin);
        }}
      >
        Kanban Board
      </h2>
      <div className="m-1 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DragDropContext onDragEnd={handleDragEnd}>
          {columns.map((column) => (
            <div
              key={column.id}
              className="m-2.5 flex min-w-[300px] flex-grow flex-col items-center justify-center rounded-3xl border border-transparent bg-[#2c2c6c] transition-all duration-400 ease-in-out hover:border-[#4db5ff66] hover:bg-transparent"
            >
              <h2 className="p-2.5 text-center">{column.title}</h2>
              <StrictModeDroppable droppableId={column.id.toString()}>
                {(provided) => (
                  <ul
                    className="flex w-1/2 flex-col flex-wrap"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {column.tasks.map((task, index) => {
                      return (
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
                              className="m-2.5 min-w-[40px] cursor-grab list-none rounded-2xl border border-white bg-[#4db5ff66] p-2.5 text-center text-[#2c2c6c] transition-all duration-400 ease-in-out hover:border-transparent hover:bg-white"
                            >
                              {task.title}
                              {isAdmin && (
                                <button
                                  className="float-right cursor-pointer rounded-full bg-red-500 p-2 text-white"
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
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </StrictModeDroppable>
              {isAdmin && (
                <>
                  <div className="m-1 flex flex-grow flex-col items-center justify-center">
                    <input
                      type="text"
                      placeholder="Add Task"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="h-8 max-h-8 w-68 flex-1 rounded-md border-2 border-[#4db5ff66] bg-transparent p-1 text-white"
                    />
                    <button
                      onClick={() => handleTaskAdd(column.id)}
                      className="m-4 cursor-pointer rounded-md bg-green-600 p-2.5 text-white hover:bg-green-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="mb-2.5 cursor-pointer rounded-md bg-red-500 p-2.5 text-white hover:bg-red-600"
                    onClick={() => handleColumnDelete(column.id)}
                  >
                    Delete Column
                  </button>
                </>
              )}
            </div>
          ))}
          {isAdmin && (
            <div className="m-2.5 flex min-w-[300px] flex-grow flex-col items-center justify-center rounded-3xl border border-transparent bg-[#2c2c6c] p-2.5 hover:border-[#4db5ff66] hover:bg-transparent">
              <h2>Add new column</h2>
              <input
                className="w-76 rounded-md border-2 border-[#4db5ff66] bg-transparent p-1 text-white"
                type="text"
                placeholder="Add Column"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <button
                className="m-2.5 cursor-pointer rounded-md bg-green-600 p-2.5 text-white hover:bg-green-700"
                onClick={handleColumnAdd}
              >
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
