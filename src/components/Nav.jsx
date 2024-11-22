import React, { useState, useEffect } from "react";
import { Navbar } from "flowbite-react";
import ThemeToggle from "../ThemeToggle";
import { useNavigate } from "react-router-dom";
import { RiMenu5Fill } from "react-icons/ri";
import MasterAdmin from "./MasterAdmin";
import CenteralAdmin from "./center-admin/CenteralAdmin";
import CenterManager from "./CenterManager";
import Student from "./Student";
import { ImCross } from "react-icons/im";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


const Nav = () => {
  const [componentToRender, setComponentToRender] = useState(null);
  const navigate = useNavigate();

  const [imageURL, setImageURL] = useState(""); // This will store the uploaded image URL
  const [email, setEmail] = useState("");

  useEffect(() => {
    const localEmail = localStorage.getItem("email");
    if (localEmail) {
      setEmail(localEmail);
    }
  }, []);

  useEffect(() => {
    if (email) {
      const unsubscribe = onSnapshot(
        doc(db, "Profiles", email),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const profileData = docSnapshot.data();
            setImageURL(profileData.imageURL || "");
          } else {
            console.log("No profile data found.");
          }
        },
        (error) => {
          console.error("Error fetching profile data:", error);
        }
      );

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [email]);

  const determineComponent = () => {
    const role = localStorage.getItem("role");

    if (role === "Master") {
      setComponentToRender(<MasterAdmin />);
    } else if (role === "Admin") {
      setComponentToRender(<CenteralAdmin />);
    } else if (role === "Manager") {
      setComponentToRender(<CenterManager />);
    } else if (role === "Student") {
      setComponentToRender(<Student />);
    } else {
      setComponentToRender(null);
    }
  };

  useEffect(() => {
    determineComponent();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <Navbar className="bg-[#0B192C] dark:bg-gray-800 mb-0.5">
        <div className="px-4 flex w-full py-2 flex-wrap justify-between">
          <Navbar.Brand>
            <img
              src="https://i.pinimg.com/474x/44/a3/fd/44a3fd7c72db93b9e50d95f67c35792a--library-logo-school-logo.jpg"
              className="mr-3 h-8 w-10 sm:h-9"
              alt="Logo"
            />
            <span className="self-center whitespace-nowrap md:text-xl font-semibold text-white dark:text-white">
              𝗕𝗼𝗼𝗸𝗡𝗲𝘀𝘁
            </span>
          </Navbar.Brand>
          <div className="flex items-center ">
            <div className="mr-4">
              <ThemeToggle />
            </div>
            <div className="drawer">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              {/* drawer-button bg-white p-2.5 rounded-lg cursor-pointe */}
            
            
              <div className="drawer-content flex items-center bg-white p-2.5 rounded-lg cursor-pointer">
                {/* Page content here */}
                <label
                  htmlFor="my-drawer"
                  className=" mrdrawer-button"
                >
                  <RiMenu5Fill className="font-bold text-md" />
                </label>


                
              </div>


              <div className="drawer-side w-[100vw] z-20">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu bg-[#10192B] text-base-content min-h-full w-[100vw] p-4 relative">

                  <div className="absolute right-0 cursor-pointer" onClick={() => (document.getElementById('my-drawer').checked = false)}>
                    <p className="bg-red-500 text-white p-2  mr-4 rounded-xl "><ImCross /></p>
                  </div>


                  {/* <div className="mt-8">
                  {componentToRender}
                  </div> */}










<div className="flex flex-col flex-wrap">
            <div
              className="cursor-pointer bg-gray-200 mt-12 rounded-md flex flex-wrap justify-center gap-4 items-center py-4"
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
                  Tushar Ghatode
                </p>
              </div>
            </div>

            <div className="border-t-2 border-gray-600 mt-2 sm:block  py-2">
              {componentToRender}
            </div>
          </div>
                 

                  <button
                    className="inline-block rounded-xl mt-4 w-full border-2 py-4 border-orange-500 text-orange-500 hover:borange-rose-600 hover:bg-orange-400 hover:bg-opacity-10 hover:text-orange-600 focus:border-rose-700 focus:text-orange-700 active:border-orange-800 active:text-orange-800 dark:border-orange-300 dark:text-orange-300   font-bold  text-xs  uppercase transition duration-150 ease-in-out"
                    type="button"
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </button>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Nav;













