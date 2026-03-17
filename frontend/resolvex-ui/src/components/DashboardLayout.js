import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout(){

return(

<div className="flex h-screen">

<Sidebar/>

<div className="flex-1 overflow-y-auto bg-gray-50 p-8">

<Outlet/>

</div>

</div>

);

}

export default DashboardLayout;