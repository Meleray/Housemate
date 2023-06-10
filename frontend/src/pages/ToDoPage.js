import React from "react";
import PageTitle from "../components/PageTitle";
import AddTask from "../components/AddTaskButton";
import TaskFilter from "../components/TaskFilter";
import { SLayout, SMain } from "../components/Layout/styles.js";
import Sidebar from "../components/Sidebar/Sidebar.js";


import './styles.ToDoPage.css';

const ToDoPage = () => {
  return (
    <SLayout>
      <Sidebar />
      <SMain>
        <PageTitle>To-Do List</PageTitle>
        <AddTask />
        <TaskFilter />
      </SMain>
    </SLayout>
  );
};

export default ToDoPage;
