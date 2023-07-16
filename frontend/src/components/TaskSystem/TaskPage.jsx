import React from "react";
import PageTitle from "../Layout/PageTitle";
import AddTask from "./AddTaskForm";
import TaskFilter from "./TaskFilter";
import { SLayout, SMain } from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";
import TaskList from "./TaskList"
import Task from "./Task"
import TaskListContainer from "./TaskListContainer"

const TaskPage = () => {
  localStorage.setItem("userId", "64b2f227528b9a0b3e1903a3");  // TODO during the registration

  return (
    <SLayout>
      <Sidebar />
      <SMain>
        <PageTitle>Tasks</PageTitle>
        <TaskListContainer />
      </SMain>
    </SLayout>
  );
};

export default TaskPage;
