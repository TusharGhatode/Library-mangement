import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TiArrowForward } from "react-icons/ti"; 
import { FaClipboardList } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { MdManageAccounts } from "react-icons/md";
import { HiChevronDown } from "react-icons/hi";

const CenteralAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSection, setOpenSection] = useState(null);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isActive = (paths) => paths.includes(location.pathname);

  const renderSection = (title, links, icon) => {
    const isSectionActive = isActive(links.map(link => link.path));
    return (
      <div className={`ac -mx-4 ${isSectionActive ? '' : ''}`}>
        <h2 className="ac-header">
          <button
            type="button"
            className="text-gray-300 w-full flex justify-between items-center px-4"
            onClick={() => handleToggle(title)}
          >
            <span className="flex items-center p-2 mt-2">
              {icon} {/* Render the icon */}
              <span className={`ml-2 font-medium ${isSectionActive ? 'text-white' : 'text-gray-400'}`}>
                {title}
              </span>
            </span>
            <HiChevronDown
              className={`transition-transform duration-300 font-bold ${
                openSection === title ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>
        </h2>
        <div
          className={`ac-panel overflow-hidden transition-max-height duration-500 ease-in-out ${
            openSection === title ? 'max-h-40' : 'max-h-0'
          }`}
        >
          {openSection === title && (
            <div className="py-1 px-3 border-l border-gray-500 ml-8 mr-0 ">
              {links.map(link => {
                const isLinkActive = location.pathname === link.path;
                return (
                  <p
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`hover:bg-gray-700 mt-1 p-2.5 rounded-lg text-gray-400 hover:text-gray-300 flex items-center cursor-pointer ${
                      isLinkActive ? 'bg-gray-800' : ''
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
        {renderSection("Manager Accounts", [
          { label: "Add Manager", path: "/AddManager" }
        ], <MdManageAccounts size={18} />)}

        {renderSection("Student Services", [
          { label: "Add Student", path: "/addStudentCenter" }
        ], <PiStudentFill size={18} />)}

        {renderSection("Approval Section", [
          { label: "Allocation Request", path: "/approve" }
        ], <FaClipboardList size={18} />)}
      </div>
    </div>
  );
};

export default CenteralAdmin;
