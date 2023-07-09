import React from "react";
import PageTitle from "../Layout/PageTitle";
import AddTask from "./AddTaskForm";
import TaskFilter from "./TaskFilter";
import { SLayout, SMain } from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";
import "./TaskPage.css";
import './TaskPage.css';
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList"
import Task from "./Task"
import TaskListContainer from "./TaskListContainer"

const TaskPage = () => {
  return (
    <SLayout>
      <Sidebar />
      <SMain>
        <PageTitle>Tasks</PageTitle>
        <AddTaskForm />
        <TaskFilter />
        <TaskListContainer />
      </SMain>
    </SLayout>
  );
};

export default TaskPage;
