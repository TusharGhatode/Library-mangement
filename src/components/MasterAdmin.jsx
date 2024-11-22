// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { PiStudentFill } from "react-icons/pi";
// import { FaBookOpen } from "react-icons/fa";
// import { TiArrowForward } from "react-icons/ti";
// import { HiBuildingOffice } from "react-icons/hi2";
// import { MdManageAccounts } from "react-icons/md";
// import { IoShieldCheckmark } from "react-icons/io5";

// const MasterAdmin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [openSection, setOpenSection] = useState(null);

//   const handleToggle = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const isActive = (paths) => paths.includes(location.pathname);

//   const renderSection = (title, links, icon) => {
//     const isSectionActive = isActive(links.map((link) => link.path));

//     return (
//       <div className={`ac -ml-4 -mr-1 w-full  ${isSectionActive ? '' : ''}`}>
//         <h2 className="ac-header">
//           <button
//             type="button"
//             className="text-gray-300 ml-4 md:-mr-8  "
//             onClick={() => handleToggle(title)}
//           >
//             <span className="flex items-center w-52 p-2 mt-1">
//               {icon}
//               <span className={`ml-2 font-medium ${isSectionActive ? 'text-white ' : 'text-gray-400'}`}>
//                 {title}
//               </span>
//             </span>
//           </button>
//         </h2>
//         <div
//           className={`ac-panel overflow-hidden transition-all duration-700 ease-in-out ${
//             openSection === title ? 'max-h-40' : 'max-h-0'
//           }`}
//         >
//           <div className={`transition-opacity duration-700 ${openSection === title ? 'opacity-100' : 'opacity-0'}`}>
//             {openSection === title && (
//               <div className="py-1 px-3 border-l border-gray-500 ml-8 mr-0">
//                 {links.map((link) => {
//                   const isLinkActive = location.pathname === link.path;
//                   return (
//                     <p
//                       key={link.path}
//                       onClick={() => navigate(link.path)}
//                       className={`hover:bg-gray-700 mt-1 p-2.5 rounded-lg text-gray-400 hover:text-gray-300 flex flex-wrap items-center mr-2 cursor-pointer ${
//                         isLinkActive ? 'bg-gray-800 sm:w-40 lg:w-44' : ''
//                       }`}
//                     >
//                       <TiArrowForward className="" /> {link.label}
//                     </p>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="overflow-x-hidden w-80% rounded-lg">
//       <div className="accordion-container space-y-2">
//         {renderSection("Centers", [
//           { label: "Add Center", path: "/addCenter" },
//           { label: "Center Details", path: "/centerdetails" },
//         ], <HiBuildingOffice size={18} />)}

//         {renderSection("Manage Accounts", [
//           { label: "Administrator", path: "/addOwner" },
//           { label: "Admin", path: "/centerAdmin" },
//           { label: "Manager", path: "/AddManager" },
//         ], <MdManageAccounts size={20} />)}

//         {renderSection("Book Organizer", [
//           { label: "Explore Books", path: "/addBook" },
//         ], <FaBookOpen size={18} />)}

//         {renderSection("Student Services", [
//           { label: "Add Student", path: "/addStudentCenter" },
//         ], <PiStudentFill size={18} />)}

//         {renderSection("Approval Section", [
//           { label: "Allocation Request", path: "/approve" },
//         ], <IoShieldCheckmark size={18} />)}
//       </div>
//     </div>
//   );
// };

// export default MasterAdmin;










import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PiStudentFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import { HiBuildingOffice } from "react-icons/hi2";
import { MdManageAccounts } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { HiChevronDown } from "react-icons/hi"; // Importing the dropdown icon

const MasterAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (paths) => paths.includes(location.pathname);

  const renderSection = (title, links, icon) => {
    const isSectionActive = isActive(links.map((link) => link.path));
    // w-[90%] sm:w-[92%] md:w-[99%]
    return (
      <div className={`ac -ml-4 xl:pr-2 lg:pr-2  ${isSectionActive ? '' : ''}`}>
        <h2 className="ac-header ">
          <button
            type="button"
            className="flex items-center justify-between w-full text-gray-300 ml-4 md:-mr-8"
            onClick={() => handleToggle(title)}
          >
            <span className={`flex items-center w-52 p-2 mt-1 ${isSectionActive ? 'text-white ' : 'text-gray-400'}`}>
              {icon}
              <span className={`ml-2 md:text-md font-medium ${isSectionActive ? 'text-white ' : 'text-gray-400'}`}>
                {title}
              </span>
            </span>
            <HiChevronDown
              className={`transition-transform duration-300  sm:mr-4 ${isSectionActive ? 'text-white ' : 'text-gray-400'} font-bold ${
                openSection === title ? 'rotate-180  ' : 'rotate-0 '
              }`}
            />
          </button>
        </h2>
        <div
          className={`ac-panel overflow-hidden transition-all duration-700 ease-in-out ${
            openSection === title ? 'max-h-40 text-' : 'max-h-0'
          }`}
        >
          <div
            className={`transition-opacity duration-700 ${
              openSection === title ? 'opacity-100' : 'opacity-0'
            }`}
          >
          
          











          {openSection === title && (
  <div className="py-1 px-3 border-l border-gray-500 ml-8 mr-0">
    {links.map((link) => {
      const isLinkActive = location.pathname === link.path;
      return (
        <p
          key={link.path}
          onClick={() => navigate(link.path)}
          className={`mt-1 w-full p-2.5 rounded-lg flex flex-wrap items-center mr-2 cursor-pointer ${
            isLinkActive ? 'bg-gray-600 text-white sm:w-40 lg:w-full' : 'hover:bg-gray-500 hover:text-white text-gray-200'
          }`}
        >
          <TiArrowForward
            className={`mr-2 transition-colors duration-300 ${
              isLinkActive ? 'text-white' : 'text-gray-400 '
            }`}
          />
          <span className={`ml-2 transition-colors duration-300 ${isLinkActive ? 'text-white' : ''}`}>
            {link.label}
          </span>
        </p>
      );
    })}
  </div>
)}















          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-hidden w-full rounded-lg">
      <div className="accordion-container space-y-2">
        {renderSection("Centers", [
          { label: "Add Center", path: "/addCenter" },
          { label: "Center Details", path: "/centerdetails" },
        ], <HiBuildingOffice size={18} />)}

        {renderSection("Manage Accounts", [
          { label: "Administrator", path: "/addOwner" },
          { label: "Admin", path: "/centerAdmin" },
          { label: "Manager", path: "/AddManager" },
        ], <MdManageAccounts size={20} />)}

        {renderSection("Book Organizer", [
          { label: "Explore Books", path: "/addBook" },
        ], <FaBookOpen size={18} />)}

        {renderSection("Student Services", [
          { label: "Add Student", path: "/addStudentCenter" },
        ], <PiStudentFill size={18} />)}

        {renderSection("Approval Section", [
          { label: "Allocation Request", path: "/approve" },
        ], <IoShieldCheckmark size={18} />)}
      </div>
    </div>
  );
};

export default MasterAdmin;




