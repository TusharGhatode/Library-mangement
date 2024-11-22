import React, { useState, useEffect } from "react";
import MasterAdmin from "./MasterAdmin";
import CenteralAdmin from "./center-admin/CenteralAdmin";
import Student from "./Student";
import CenterManager from "./CenterManager";
import { BiLogOut } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import ThemeToggle from "../ThemeToggle";
import { PiSelectionSlashDuotone, PiStudentFill } from "react-icons/pi";
import {
  IoMdArrowDroprightCircle,
  IoMdArrowDropleftCircle,
} from "react-icons/io";
import { BiSolidMessageSquareCheck } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { HiBuildingOffice } from "react-icons/hi2";
import { MdManageAccounts } from "react-icons/md";
import { IoShieldCheckmark } from "react-icons/io5";
import { doc, onSnapshot,collection, getDocs,query,where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const SideNav = ({ setIsSidebarExpanded, isSidebarExpanded }) => {
  const [componentToRender, setComponentToRender] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const [imageURL, setImageURL] = useState(""); // This will store the uploaded image URL
  const [userName, setUserName] = useState(""); // This will store the uploaded image URL

 

  const [email, setEmail] = useState("");

  useEffect(() => {
    const localEmail = localStorage.getItem("email");
    if (localEmail) {
      setEmail(localEmail);
    }
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const userRef = collection(db, 'Registrations');
        const q = query(userRef, where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        // Check if any documents were found
        if (!querySnapshot.empty) {
          // Assuming user data is in the first document
          const userDoc = querySnapshot.docs[0].data();
          setUserName(userDoc.Name);
        } 
      } catch (err) {
        console.error('Error fetching user data:', err);
       
      } 
    };

    if (email) {
      fetchUserData();
    }
  }, [email]); // Fetch data when




  useEffect(() => {
    if (email) {
      const unsubscribe = onSnapshot(
        doc(db, "Profiles", email),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const profileData = docSnapshot.data();
            setImageURL(profileData.imageURL || "");
            
          } 
        },
        (error) => {
          console.error("Error fetching profile data:", error);
        }
      );

      return () => unsubscribe();
    }
  }, [email]);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    determineComponent(storedRole);
  }, []);

  const determineComponent = (role) => {
    switch (role) {
      case "Master":
        setComponentToRender(<MasterAdmin />);
        break;
      case "Admin":
        setComponentToRender(<CenteralAdmin />);
        break;
      case "Manager":
        setComponentToRender(<CenterManager />);
        break;
      case "Student":
        setComponentToRender(<Student />);
        break;
      default:
        setComponentToRender(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  // Function to determine if the icon should be highlighted
  const isActive = (paths) => {
    // Ensure paths is always treated as an array
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.some((path) => location.pathname === path);
  };

  // bg-[#10192B]    dark:bg-[#001F3F]

  return (
    <div className="  overflow-y-hidden  scrollbar-hidden pb-[9px] relative transition-all duration-600 rounded-r-md bg-[#0B192C] z-10">
      <button
        onClick={toggleSidebar}
        className="absolute right-0 text-black  bg-gray-300 rounded-l-xl border-white z-10 p-1"
      >
        {isSidebarExpanded ? (
          <IoMdArrowDropleftCircle size={22} />
        ) : (
          <IoMdArrowDroprightCircle size={20} />
        )}
      </button>

      {isSidebarExpanded ? (
        <div className="flex flex-col justify-between h-[98vh] px-2">
          <div className="flex flex-col flex-wrap">
            <div
              className="cursor-pointer bg-gray-300  border-gray-400 border  w-full mt-12 rounded-md flex flex-wrap justify-center gap-4 items-center py-4"
              onClick={() => navigate("/profile")}
            >
              <div className="mravatar">
                <div className="ring-error ring-offset-base-100 w-8 h-8 rounded-full ring ring-offset-2 ">
                  <img
                    src={
                      imageURL ||
                      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    className="rounded-full object-cover w-8 h-8"
                  />
                </div>
              </div>
              <div className="">
                <p className="text-black  font-semibold text-sm ">
                  {userName}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-500  mt-2 w-full  sm:block  py-2">
              <div className="mt-4">
              {componentToRender}
              </div>
            </div>
          </div>

          <div>
            <div className="flex text-md p-4 mb-2 mx-0.5 justify-between rounded-lg mt-2 bg-gray-600 text-white items-center">
              <div className="flex items-center">
                <MdDarkMode className="mr-2" />
                <h1>Light Mode</h1>
              </div>
              <ThemeToggle />
            </div>

            <div className="cursor-pointer" onClick={handleLogout}>
              <h1 className="flex text-md p-4 mx-0.5 rounded-lg bg-orange-600 text-white items-center">
                <BiLogOut className="mr-2" /> Logout
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between h-[91vh] mb-1 overflow-hidden w-full mt-12  text-white">
          <div className="flex flex-col flex-wrap justify-center items-center mt-4 cursor-pointer">
            <div className="mravatar">
              <div className="ring-error ring-offset-base-100 w-10 h-10 rounded-full ring ring-offset-2 ">
              <img
                    src={
                      imageURL ||
                      "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    className="rounded-full object-cover w-10 h-10"
                  />
              </div>
            </div>
            {role === "Admin" && (
              <>
                {[
                  {
                    Icon: MdManageAccounts,
                    label: "Manager",
                    path: ["/AddManager"],
                  },
                  {
                    Icon: PiStudentFill,
                    label: "Students",
                    path: ["/addStudentCenter"],
                  },
                  {
                    Icon: BiSolidMessageSquareCheck,
                    label: "Approvals",
                    path: ["/approve"],
                  },
                ].map(({ Icon, label, path }, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer mt-9 tooltip tooltip-bottom ${
                      isActive(path)
                        ? "bg-gray-700 w-[15vw] lg:w-[7vw] -mb-2 xl:w-[7vw] py-3  flex flex-wrap justify-center items-center rounded-xl text-center "
                        : ""
                    }`}
                    data-tip={label}
                  >
                    <Icon
                      className={`cursor-pointer ${
                        isActive(path) ? "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5" : "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5"
                      }`}
                      size={20}
                    />
                  </div>
                ))}
              </>
            )}

            {role === "Manager" && (
              <>
                {[
                  {
                    Icon: PiStudentFill,
                    label: "Students",
                    path: ["/addStudentCenter"],
                  },
                  {
                    Icon: BiSolidMessageSquareCheck,
                    label: "Approvals",
                    path: ["/approve"],
                  },
                ].map(({ Icon, label, path }, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer mt-9 tooltip tooltip-bottom ${
                      isActive(path)
                        ? "bg-gray-700 w-[15vw] lg:w-[7vw] -mb-2 xl:w-[7vw] py-3  flex flex-wrap justify-center items-center rounded-xl text-center "
                        : ""
                    }`}
                    data-tip={label}
                  >
                    <Icon
                      className={`cursor-pointer ${
                        isActive(path) ? "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5" : "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5"
                      }`}
                      size={20}
                    />
                  </div>
                ))}
              </>
            )}

            {role === "Student" && (
              <>
                {[
                  {
                    Icon: FaBookOpen,
                    label: "Books",
                    path: ["/books"],
                  },
                  {
                    Icon: PiKeyReturnBold,
                    label: "Return",
                    path: ["/returnbook"],
                  },
                ].map(({ Icon, label, path }, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer mt-9 tooltip tooltip-bottom ${
                      isActive(path)
                        ? "bg-gray-700 w-[15vw] lg:w-[7vw] -mb-2 xl:w-[7vw] py-3  flex flex-wrap justify-center items-center rounded-xl text-center "
                        : ""
                    }`}
                    data-tip={label}
                  >
                    <Icon
                      className={`cursor-pointer  ${
                        isActive(path) ? "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5" : "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5"
                      }`}
                      size={20}
                    />
                  </div>
                ))}
              </>
            )}

            {role === "Master" && (
              <>
                {[
                  {
                    Icon: HiBuildingOffice,
                    label: "Centers",
                    path: ["/addCenter", "/centerdetails"],
                  },
                  {
                    Icon: MdManageAccounts,
                    label: "Accounts",
                    path: ["/addOwner", "/centerAdmin", "/AddManager"],
                  },
                  {
                    Icon: FaBookOpen,
                    label: "Books",
                    path: ["/addBook"],
                  },
                  {
                    Icon: PiStudentFill,
                    label: "Students",
                    path: ["/addStudentCenter"],
                  },
                  {
                    Icon: IoShieldCheckmark,
                    label: "Approvals",
                    path: ["/approve"],
                  },
                ].map(({ Icon, label, path }, index) => (
                  <div
                    key={index}
                    // className="tooltip tooltip-bottom mt-10 bg-gray-700  px-6 py-3 rounded-md "
                    className={`cursor-pointer mt-8 tooltip tooltip-bottom ${
                      isActive(path)
                        ? "bg-gray-700 w-[15vw] lg:w-[7vw] -mb-2 xl:w-[7vw] py-3  flex flex-wrap justify-center items-center rounded-xl text-center "
                        : ""
                    }`}
                    data-tip={label}
                  >
                    <Icon
                      className={`cursor-pointer ${
                        isActive(path)
                          ? "text-white sm:h-5 sm:w-5 xl:h-5 lg:h-5 lg:w-5 xl:w-5"
                          : "text-white sm:h-5 sm:w-5 lg:h-5 lg:w-5 xl:h-5 xl:w-5"
                      }`}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="bottom ">
            <label className="tooltip tooltip-bottom  flex bg-gray-800 justify-center w-[15vw] lg:w-[7vw]  xl:w-[7vw] py-3 rounded-lg border-2 border-gray-600">
              <ThemeToggle />
            </label>

            <div
              className="flex flex-wrap justify-center items-center bg-orange-600 rounded-lg cursor-pointer w-[15vw] lg:w-[7vw]  xl:w-[7vw] py-3 mt-2 mb-2"
              onClick={handleLogout}
            >
              <TbLogout2 className=" cursor-pointer" size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
