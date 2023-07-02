import React from "react";
import PageTitle from "../Layout/PageTitle";
import AddTask from "./AddTaskButton";
import TaskFilter from "./TaskFilter";
import { SLayout, SMain } from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";
import "./TaskPage.css";
import CheckboxList from "./TaskListContainer";

const TaskPage = () => {
  return (
    <SLayout>
      <Sidebar />
      <SMain>
        <PageTitle>Tasks</PageTitle>
        <AddTask />
        <TaskFilter />
        <CheckboxList />
      </SMain>
    </SLayout>
  );
};

export default TaskPage;
