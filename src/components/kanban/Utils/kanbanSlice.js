import { createSlice } from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
  name: "kanban",
  initialState: {
    columns: [
      {
        id: 1,
        title: "Going to do",
        tasks: [
          { id: 1, title: "Bring Order out of Chaos" },
          { id: 2, title: "Prove p = np" },
          { id: 3, title: "Attempt to solve the Collatz Conjecture" },
        ],
      },
      {
        id: 2,
        title: "Doing",
        tasks: [
          { id: 4, title: "Realise the Truth with Code" },
          { id: 5, title: "Yoga" },
          { id: 6, title: "DSA practice" },
        ],
      },
      {
        id: 3,
        title: "Done",
        tasks: [
          { id: 7, title: "Learn Japanese" },
          { id: 8, title: "Smile at a cat" },
          { id: 9, title: "Feed the birds" },
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
      state.columnCount = state.columns.length;
    },
    addTask: (state, action) => {
      const { columnId, title, index } = action.payload;
      const newTask = {
        id: Date.now(),
        title: title,
      };
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
    // moveTask: (state, action) => {
    //   return;
    //   // fix this...
    //   // const { columnId, sourceIndex, destIndex } = action.payload;
    //   // const taskToMove = state.columns[columnId - 1].tasks[sourceIndex]
    //   // state.columns[columnId - 1].tasks.splice(sourceIndex, 1);
    //   // state.columns[columnId - 1].tasks.splice(destIndex, 0, taskToMove);
    // },
  },
});

export const { addColumn, deleteColumn, addTask, deleteTask } =
  kanbanSlice.actions;

export default kanbanSlice.reducer;
