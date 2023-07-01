import React from "react";
import PageTitle from "../../components/Dashboard/PageTitle";
import AddTask from "../../components/Dashboard/AddTaskButton";
import TaskFilter from "../../components/Dashboard/TaskFilter";
import { SLayout, SMain } from "../../components/Dashboard/Layout/styles.js";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar.js";
import "./TaskPage.css";
import ListContainer from "../../components/TaskListContainer";
import CheckboxList from "../../components/TaskListContainer";

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
