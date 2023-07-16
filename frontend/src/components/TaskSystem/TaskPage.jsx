import React from "react";
import PageTitle from "../Layout/PageTitle";
import AddTask from "./AddTaskForm";
import TaskFilter from "./TaskFilter";
import { SLayout, SMain } from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";
<<<<<<< HEAD
=======
import AddTaskForm from "./AddTaskForm";
>>>>>>> origin/master
import TaskList from "./TaskList"
import Task from "./Task"
import TaskListContainer from "./TaskListContainer"

const TaskPage = () => {
<<<<<<< HEAD
  localStorage.setItem("userId", "64b2f227528b9a0b3e1903a3");  // TODO during the registration
=======
  localStorage.setItem("userId", "64afecf85395545a174c5803");  // TODO during the registration
>>>>>>> origin/master

  return (
    <SLayout>
      <Sidebar />
      <SMain>
        <PageTitle>Tasks</PageTitle>
<<<<<<< HEAD
=======
        <AddTaskForm />
>>>>>>> origin/master
        <TaskListContainer />
      </SMain>
    </SLayout>
  );
};

export default TaskPage;
