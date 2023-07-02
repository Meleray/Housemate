import React from "react";
import Sidebar from "../Dashboard/Sidebar/Sidebar";
import { SLayout, SMain } from "./styles";

const Layout = ({ children }) => {
  return (
    <SLayout>
      <Sidebar />
      <SMain>{children}</SMain>
    </SLayout>
  );
};

export default Layout;