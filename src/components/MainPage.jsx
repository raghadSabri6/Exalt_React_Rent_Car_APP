import React from "react";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

function MainPage() {
  return (
    <>
      <section>
        <Navbar/>
      </section>
      <section>
        <div className="d-flex w-100 ">
          <div className="w-25 p-0">
            <SideBar />
          </div>
          <div className="bg-primary-subtle w-75 p-0">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}

export default MainPage;
