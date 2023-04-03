import { createSlice } from '@reduxjs/toolkit';

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: {
    columns: [
      {
        id: 1,
        title: 'Going to do',
        tasks: [
          { id: 1, title: 'Mastering Rust' },
          { id: 2, title: 'Mastering WebAssembly' },
          { id: 3, title: 'Learning Networking Essentials ' },
        ],
      },
      {
        id: 2,
        title: 'Doing',
        tasks: [
          { id: 4, title: 'Mastering NodeJS' },
          { id: 5, title: 'Learning Rust' },
          { id: 10, title: 'Learning WebAssembly' },
          { id: 6, title: 'Mastering DSA (Hard)' },
        ],
      },
      {
        id: 3,
        title: 'Done',
        tasks: [
          { id: 7, title: 'Learning NodeJS' },
          { id: 8, title: 'Mastering DSA (Medium)' },
          { id: 9, title: 'Mastering DSA (Easy)' },
        ],
      },
    ],
    columnCount: 3,
  },
  reducers: {
    addColumn: (state, action) => {
      const title = action.payload;
      const newColumn = {
        id: state.columnCount + 1,
        title: title,
        tasks: [],
      };
      state.columns.push(newColumn);
      state.columnCount++;
    },
    deleteColumn: (state, action) => {
      const columnId = action.payload;
      state.columns = state.columns.filter((column) => column.id !== columnId);
    },
    addTask: (state, action) => {
      const { columnId, title, index } = action.payload;
      const newTask = {
        id: Date.now(),
        title: title,
      };
      console.log(newTask);
      state.columns.forEach((column) => {
        if (column.id === columnId) {
          column.tasks.splice(index, 0, newTask);
        }
      });
    },
    deleteTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      state.columns.forEach((column) => {
        if (column.id === columnId) {
          column.tasks = column.tasks.filter((task) => task.id !== taskId);
        }
      });
    },
    moveTask: (state, action) => {
      const { columnId, sourceIndex, destIndex } = action.payload;
      const taskToMove = state.columns[columnId - 1].tasks[sourceIndex];
      state.columns[columnId - 1].tasks.splice(sourceIndex, 1);
      state.columns[columnId - 1].tasks.splice(destIndex, 0, taskToMove);
    },
  },
});

export const { addColumn, deleteColumn, addTask, deleteTask, moveTask } =
  kanbanSlice.actions;

export default kanbanSlice.reducer;
