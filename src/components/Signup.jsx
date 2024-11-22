import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  // State for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [centerBranch, setCenterBranch] = useState("");
  const [centerAddress, setCenterAddress] = useState("");

  // Store fetched centers data and distinct branches
  const [fullCenters, setFullCenters] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Centers"));
        const centersData = querySnapshot.docs.map((doc) => doc.data());

        // Get distinct center branches
        const distinctBranches = [
          ...new Set(centersData.map((center) => center.Center_Branch)),
        ];

        // Set state for distinct branches
        setCenters(distinctBranches);

        // Store the full centers data for address filtering
        setFullCenters(centersData);
      } catch (error) {
        console.error("Error fetching centers: ", error);
      }
    };

    fetchCenters();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !password ||
      !centerBranch ||
      !centerAddress
    ) {
      alert.show("All fields are required!", { type: "error", timeout: 3000 });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert.show("Invalid email format!", { type: "error", timeout: 3000 });
      return;
    }

    try {
      // Create a query to check if the email already exists
      const emailQuery = query(
        collection(db, "Registrations"),
        where("Email", "==", email)
      );
      const querySnapshot = await getDocs(emailQuery);

      // If the email exists, show an error toast
      if (!querySnapshot.empty) {
        alert.show("Email is already registered.", {
          type: "error",
          timeout: 3000,
        });
        return;
      }

      // Proceed with registration if the email is not found
      await addDoc(collection(db, "Registrations"), {
        Name: fullName,
        Email: email,
        Number: phoneNumber,
        Password: password,
        Branch: centerBranch,
        Address: centerAddress,
        Role: "Student",
      });

      alert.show("Signup successfully!", { type: "success", timeout: 3000 });

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);

      // Reset form fields
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setCenterBranch("");
      setCenterAddress("");
    } catch (error) {
      alert.show("Failed to signup, please try again.", {
        type: "error",
        timeout: 3000,
      });
    }
  };

  // Filter addresses based on the selected center branch
  const filteredAddresses = fullCenters.filter(
    (center) => center.Center_Branch === centerBranch
  );

  return (
   <div className="bg-gray-100">
      <div className="sm:block hidden">
        <div className="relative  flex flex-wrap justify-center items-center h-screen">
          <div className="relative flex bg-white mx-1 rounded-xl shadow  sm:shadow-lg sm:shadow-gray-400 w-screen sm:w-[95vw] lg:w-[90vw] xl:w-[65vw] ">
            <div className="w-1/2 px-6 py-8">
              <h1 className="text-center font-bold sm:text-lg">Signup</h1>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="fullName"
                  >
                    Name
                  </label>
                  <input
                    className="border rounded-lg px-3 bg-gray-100 border-gray-300  py-3 mt-1 mb-2 text-sm w-full"
                    type="text"
                    id="fullName"
                    value={fullName}
                    placeholder="Name"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="email"
                  >
                  Email
                  </label>
                  <input
                    className="border rounded-lg px-3 py-3 bg-gray-100 border-gray-300  mt-1 mb-2 text-sm w-full"
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {/* Phone Number */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="phoneNumber"
                  >
                    Number
                  </label>
                  <input
                    className="border rounded-lg px-3 py-3 mt-1 mb-2 bg-gray-100 border-gray-300  text-sm w-full"
                    type="tel"
                    id="phoneNumber"
                    placeholder="Phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="password"
                  >
                  Password
                  </label>
                  <input
                  placeholder="Password"
                    className="border rounded-lg px-3 bg-gray-100 border-gray-300  py-3 mt-1 mb-2 text-sm w-full"
                    type="text"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>




                {/* Center Branch */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="centerBranch"
                  >
                    Branch
                  </label>
                  <select
                    className="select select-bordered bg-gray-100 border-gray-300  w-full  mb-2"
                    value={centerBranch}
                    onChange={(e) => {
                      setCenterBranch(e.target.value);
                      setCenterAddress(""); // Reset address when branch changes
                    }}
                  >
                    <option disabled value="">
                      Select Branch
                    </option>
                    {centers.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Center Address */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="centerAddress"
                  >
                    Address
                  </label>
                  <select
                    className="select select-bordered bg-gray-100 border-gray-300  w-full  mb-6"
                    value={centerAddress}
                    onChange={(e) => setCenterAddress(e.target.value)}
                    disabled={!centerBranch}
                  >
                    <option disabled value="">
                      Select_Address
                    </option>
                    {filteredAddresses.map((center, index) => (
                      <option key={index} value={center.Center_Address}>
                        {center.Center_Address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-1">
                <button
                  className="inline-block w-full px-6 py-3 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                  onClick={handleSubmit}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="right bg-gradient-to-tl from-orange-700 rounded-r-xl to-orange-400 w-1/2 sm:flex flex-wrap justify-center items-center flex-col">
              <div className="text-center">
                <h1 className=" text-md sm:text-xl lg:text-2xl text-white font-extrabold ">
                  Welcome to Signup
                </h1>
              </div>

              <div className=" flex flex-wrap items-center justify-center">
                <div className="">
                  <a className="text-xs sm:text-md flex sm:text-md mt-6 text-white font-bold uppercase cursor-pointer dark:text-gray-400">
                    Have an account?
                    <p
                      className="text-black font-bold  ml-1 hover:underline"
                      onClick={() => navigate("/")}
                    >
                      Login
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block sm:hidden">
        <div className="relative py-3 flex flex-wrap justify-center items-center h-screen">
          <div className="relative flex bg-white w-full mx-1 rounded-xl shadow-lg shadow-gray-400 ">
            <div className=" px-6 py-8 w-full">
              <h1 className="text-center font-bold sm:text-lg">Sign Up</h1>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="fullName"
                  >
                    Name
                  </label>
                  <input
                    className="border rounded-lg px-3 py-3 bg-gray-100 border-gray-300 mt-1 mb-2 text-sm w-full"
                    type="text"
                    id="fullName"
                    placeholder="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {/* Email */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="border rounded-lg px-3 bg-gray-100 border-gray-300 py-3 mt-1 mb-2 text-sm w-full"
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
               
                {/* Phone Number */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="phoneNumber"
                  >
                    Number
                  </label>
                  <input
                    className="border rounded-lg px-3 bg-gray-100 border-gray-300 py-3 mt-1 mb-2 text-sm w-full"
                    type="tel"
                    id="phoneNumber"
                    placeholder="Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="password"
                  >
                  Password
                  </label>
                  <input
                    className="border rounded-lg px-3 bg-gray-100 border-gray-300 py-3 mt-1 mb-2 text-sm w-full"
                    type="text"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>



                 {/* Center Branch */}
                 <div>
                  <label
                    className="font-semibold text-sm  text-gray-600 pb-1 block"
                    htmlFor="centerBranch"
                  >
                Branch
                  </label>
                  <select
                    className="select select-bordered bg-gray-100 border-gray-300 w-full  mb-6"
                    value={centerBranch}
                    onChange={(e) => {
                      setCenterBranch(e.target.value);
                      setCenterAddress(""); // Reset address when branch changes
                    }}
                  >
                    <option disabled value="">
                      Select Branch
                    </option>
                    {centers.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Center Address */}
                <div>
                  <label
                    className="font-semibold text-sm text-gray-600 pb-1 block"
                    htmlFor="centerAddress"
                  >
                    Address
                  </label>
                  <select
                    className="select select-bordered w-full bg-gray-100 border-gray-300 mb-2"
                    value={centerAddress}
                    onChange={(e) => setCenterAddress(e.target.value)}
                    disabled={!centerBranch}
                  >
                    <option disabled value="">
                      Select_Address
                    </option>
                    {filteredAddresses.map((center, index) => (
                      <option key={index} value={center.Center_Address}>
                        {center.Center_Address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                  className="inline-block w-full px-6 py-3 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                  onClick={handleSubmit}
                >
                  Sign Up
                </button>


                <div className=" flex flex-wrap items-center justify-center">
                <div className="">
                  <a className="text-xs flex mt-6 text-black font-bold uppercase cursor-pointer dark:text-gray-400">
                    Have an account?
                    <p
                      className="text-orange-500 font-bold  ml-1 hover:underline"
                      onClick={() => navigate("/")}
                    >
                      Login
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
