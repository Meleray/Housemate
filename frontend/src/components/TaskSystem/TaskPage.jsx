import React from "react";
import PageTitle from "../Layout/PageTitle";
import { SLayout, SMain } from "../Layout/styles";
import Sidebar from "../Sidebar/Sidebar";
import TaskListContainer from "./TaskListContainer"

const TaskPage = () => {
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
