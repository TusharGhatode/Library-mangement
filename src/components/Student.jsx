// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaBookOpen, FaClipboardList } from "react-icons/fa";
// import { TiArrowForward } from "react-icons/ti";
// import { HiChevronDown } from "react-icons/hi"; // Importing the dropdown icon

// const Student = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // State to keep track of the currently open section
//   const [openSection, setOpenSection] = useState(null);

//   // Function to toggle the opened section
//   const handleToggle = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   // Function to check if the current route is active for a specific section
//   const isActive = (paths) => paths.includes(location.pathname);

//   // Render individual sections with navigation links
//   const renderSection = (title, links, icon) => {
//     const isSectionActive = isActive(links.map(link => link.path)); // Check if any link in this section is active
//     return (
//       <div className={`ac bg-red-500 -mx-4 ${isSectionActive ? '' : ''}`}> {/* Change parent color to red if active */}
//       <h2 className="ac-header">
//         <button
//           type="button"
//           className="text-gray-300 ml-4"
//           onClick={() => handleToggle(title)}
//         >
//           <span className="flex items-center w-52 p-2 mt-2">
//             {icon} {/* Render the icon here */}
//             <span className={`ml-2 font-medium ${isSectionActive ? 'text-white ' : 'text-gray-400'}`}>{title}</span> {/* Change text color */}
//           </span>

//           <HiChevronDown
//               className={`transition-transform duration-300 mr-4 font-bold ${
//                 openSection === title ? 'rotate-180' : 'rotate-0'
//               }`}
//             />
//         </button>
//       </h2>
//       <div
//         className={`ac-panel overflow-hidden transition-max-height duration-500 ease-in-out ${
//           openSection === title ? 'max-h-40' : 'max-h-0'
//         }`}
//       >
//         {openSection === title && (
//           <div className="py-1 px-3 border-l border-gray-500 ml-8 mr-0 ">
//             {links.map(link => {
//               const isLinkActive = location.pathname === link.path; // Check if the link is active
//               return (
//                 <p
//                   key={link.path}
//                   onClick={() => navigate(link.path)}
//                   className={`hover:bg-gray-700 mt-1 p-2.5 rounded-lg text-gray-400 hover:text-gray-300 flex flex-wrap items-center mr-2 cursor-pointer  ${
//                     isLinkActive ? 'bg-gray-800 ' : ''
//                   }`} // Add active styles
//                 >
//                   <TiArrowForward className="mr-1" /> {link.label}
//                 </p>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//     );
//   };

//   return (
//     <div className="bg-[#10192B] dark:bg-[#001F3F] py-6 px-2 rounded-lg shadow-md">
//       <div className="accordion-container space-y-2">
//         {renderSection("Books", [
//           { label: "Browse Books", path: "/books" }
//         ], <FaBookOpen size={18}/>)} {/* Icon for Book Management */}

//         {renderSection("Return", [
//           { label: "Return Book", path: "/returnbook" }
//         ], <FaClipboardList size={18}/>)} {/* Icon for Return Management */}
//       </div>
//     </div>
//   );
// };

// export default Student;












import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBookOpen, FaClipboardList } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import { HiChevronDown } from "react-icons/hi";

const Student = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (paths) => paths.includes(location.pathname);

  const renderSection = (title, links, icon) => {
    const isSectionActive = isActive(links.map((link) => link.path));
    return (
      <div className={`ac  -ml-4 ${isSectionActive ? "" : ""}`}>
        <h2 className="ac-header">
          <button
            type="button"
            className="flex items-center justify-between w-full text-gray-300 ml-4" // Ensure items are properly aligned
            onClick={() => handleToggle(title)}
          >
            <span className="flex  items-center  w-52 p-2 mt-2">
              {icon}
              <span
                className={`ml-2 font-medium ${
                  isSectionActive ? "text-white " : "text-gray-400"
                }`}
              >
                {title}
              </span>
            </span>

            <HiChevronDown
              className={`transition-transform duration-300 mr-4 font-bold ${
                openSection === title ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </h2>
        <div
          className={`ac-panel overflow-hidden transition-max-height duration-500 ease-in-out ${
            openSection === title ? "max-h-40" : "max-h-0"
          }`}
        >
          {openSection === title && (
            <div className="py-1 px-3 border-l border-gray-500 ml-8 mr-0 ">
              {links.map((link) => {
                const isLinkActive = location.pathname === link.path;
                return (
                  <p
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`hover:bg-gray-700 mt-1 p-2.5 rounded-lg text-gray-400 hover:text-gray-300 flex flex-wrap items-center mr-2 cursor-pointer  ${
                      isLinkActive ? "bg-gray-800 " : ""
                    }`}
                  >
                    <TiArrowForward className="mr-1" /> {link.label}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#10192B] dark:bg-[#001F3F] py-6 px-2 rounded-lg shadow-md">
      <div className="accordion-container space-y-2">
        {renderSection(
          "Books",
          [{ label: "Browse Books", path: "/books" }],
          <FaBookOpen size={18} />
        )}
        {/* {renderSection(
          "Return",
          [{ label: "Return Book", path: "/returnbook" }],
          <FaClipboardList size={18} />
        )} */}
      </div>
    </div>
  );
};

export default Student;
