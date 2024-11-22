

// import React, { useState } from "react";
// import SideNav from "./SideNav";
// import Nav from "./Nav";
// import { useNavigate } from "react-router-dom";

// const Dashboard = ({ table, addButton }) => {
//   const navigate = useNavigate();
//   const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

//   return (
//     <div className="sm:grid sm:grid-cols-12 h-screen overflow-hidden z-10">
//       <div className="block sm:hidden">
//         <Nav />
//       </div>
//       {/* Sidebar */}
//       <div
//         className={`left ${
//           isSidebarExpanded ? "sm:col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2 2xl:col-span-2" : "sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
//         } overflow-y-scroll overflow-x-hidden scrollbar-hidden transition-all duration-800`}
//       >
//         <div className="top sm:h-[10vh] h-[10vh] hidden sm:block mr-0 z-10">
//           <SideNav
//             isSidebarExpanded={isSidebarExpanded}
//             setIsSidebarExpanded={setIsSidebarExpanded}
//           />
//         </div>
//       </div>

//       {/* Main content area */}
//       <div
//         className={`right ${
//           isSidebarExpanded ? "sm:col-span-8 md:col-span-9 lg:col-span-9 xl:col-span-10 2xl:col-span-10" : "sm:col-span-10 md:col-span-10 lg:col-span-11 xl:col-span-11  2xl:col-span-11"
//         } mx-0.5 transition-all duration-300 z-10`}
//       >
//         <div className="first justify-center items-center flex flex-wrap h-[10vh] bg-[#edede9] dark:bg-[#001F3F] mb-0.5 sm:h-[11vh] sm:flex sm:flex-wrap sm:items-center sm:px-8">
//           <h1 className="sm:text-xl md:text-2xl text-xl text-black dark:text-white font-semibold">
//             ᴡᴇʟʟᴄᴏᴍᴇ ᴛᴏ, <span className="text-orange-500"> ᴅᴀsʜʙᴏᴀʀᴅ</span>
//           </h1>
//         </div>

//         {addButton}

//         <div className="bg-gray-100 dark:bg-[#001F3F] mt-0.5 sm:h-[81vh] h-[67vh] hide-scrollbar overflow-y-scroll z-10">
//           {table}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






import React, { useState, useEffect } from "react";
import SideNav from "./SideNav";
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ table, addButton }) => {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    // Check the role from local storage when the component mounts
    const role = localStorage.getItem("role");
    if (role === "Student") {
      setIsStudent(true);
    }
  }, []);

  return (
    <div className="sm:grid sm:grid-cols-12 h-screen bg-white overflow-hidden z-10">
      <div className="block sm:hidden">
        <Nav />
      </div>
      {/* Sidebar */}
      <div
        className={`left ${
          isSidebarExpanded
            ? "sm:col-span-4 md:col-span-3 lg:col-span-3 xl:col-span-2 2xl:col-span-2"
            : "sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1 2xl:col-span-1"
        } overflow-y-scroll overflow-x-hidden scrollbar-hidden transition-all duration-800`}
      >
        {/* sm:h-[10vh] h-[10vh] */}
        <div className="top  hidden sm:block mr-0 z-10 mt-0.5 rounded-r-md">
          <SideNav
            isSidebarExpanded={isSidebarExpanded}
            setIsSidebarExpanded={setIsSidebarExpanded}
          />
        </div>
      </div>

      {/* Main content area */}
      <div
        className={`right  ${
          isSidebarExpanded
            ? "sm:col-span-8 md:col-span-9 lg:col-span-9 xl:col-span-10 2xl:col-span-10"
            : "sm:col-span-10 md:col-span-10 lg:col-span-11 xl:col-span-11  2xl:col-span-11"
        } mx-0.5 transition-all duration-300 z-10`}
      >
        {/* Conditionally render the welcome area and add button if the role is not "student"  bg-[#edede9] */}
        {!isStudent && (
          <>
            <div className="first justify-center items-center mt-1 rounded-md mr-[0.5px] flex flex-wrap bg-[#FAF7F0] dark:bg-[#001F3F] mb-0.5 sm:h-[11vh] sm:flex sm:flex-wrap sm:items-center sm:px-8">
              <h1 className="sm:text-xl md:text-2xl text-xl text-black dark:text-white font-semibold">
                ᴡᴇʟʟᴄᴏᴍᴇ ᴛᴏ, <span className="text-orange-500"> ᴅᴀsʜʙᴏᴀʀᴅ</span>
              </h1>
            </div>
            
            {addButton}
          </>
        )}

        {/* Main table content area with full screen height for students */}
        <div
          className={`bg-[#FAF7F0] h-[79.2vh] rounded-md mr-[0.5px] mt-0.5  dark:bg-[#001F3F] ${
            isStudent ? "  h-[46rem]" : "h-[80vh]"
          }  hide-scrollbar overflow-y-scroll z-10`}
        >
          {table}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

 