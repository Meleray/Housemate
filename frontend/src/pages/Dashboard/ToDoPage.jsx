import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle";
import AddTask from "../../components/Dashboard/AddTaskButton";
import TaskFilter from "../../components/Dashboard/TaskFilter";
import { SLayout, SMain } from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.js";
import "./ToDoPage.css";

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
