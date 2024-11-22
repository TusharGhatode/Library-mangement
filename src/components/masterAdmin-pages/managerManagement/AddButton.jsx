import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAlert } from 'react-alert';

const AddButton = () => {
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerMobile, setManagerMobile] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal state
  const alert = useAlert();

  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(
        centersData.map((doc) => doc.Center_Branch)
      );
      setCenterBranch(Array.from(centersNamesSet));

      const addressesMap = {};
      centersData.forEach((doc) => {
        if (!addressesMap[doc.Center_Branch]) {
          addressesMap[doc.Center_Branch] = [];
        }
        addressesMap[doc.Center_Branch].push(doc.Center_Address);
      });
      setBranchAddresses(addressesMap);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!managerName || !managerMobile || !managerEmail || !managerPassword || !selectedAddress) {
      alert.show("Please fill all fields", { type: "error", timeout: 3000 });
      return;
    }

    if (managerMobile.length < 10) {
      alert.show("Mobile number must be at least 10 digits", { type: "error", timeout: 3000 });
      return;
    }

    try {
      const managersCollection = collection(db, "Registrations");
      const emailQuery = query(managersCollection, where("Email", "==", managerEmail));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        alert.show("Email already exists!", { type: "error", timeout: 3000 });
        return;
      }

      const addressRoleQuery = query(
        managersCollection,
        where("Branch", "==", selectedBranch),
        where("Address", "==", selectedAddress),
        where("Role", "==", "Manager")
      );
      const addressRoleSnapshot = await getDocs(addressRoleQuery);

      if (!addressRoleSnapshot.empty) {
        alert.show("This address is already assigned to a Manager within this branch!", { type: "error", timeout: 3000 });
        return;
      }

      await addDoc(managersCollection, {
        Name: managerName,
        Mobile: managerMobile,
        Branch: selectedBranch,
        Email: managerEmail,
        Password: managerPassword, // Consider using Firebase Auth for secure password storage
        Address: selectedAddress,
        Role: "Manager",
      });

      setManagerName("");
      setManagerMobile("");
      setManagerEmail("");
      setManagerPassword("");
      setSelectedAddress("");
      setIsModalOpen(false); // Close the modal

      alert.show("Manager added successfully!", { type: "success", timeout: 3000 });
    } catch (error) {
      console.error("Error adding manager: ", error);
      alert.show("Failed to add manager. Try again.", { type: "error", timeout: 3000 });
    }
  };

  return (
    <div>
      <div className="second bg-gray-200 dark:bg-[#001F3F] gap-1 h-[10vh] flex flex-wrap items-center justify-between px-2 sm:h-[8vh] sm:px-5">
        <div className="left flex flex-wrap justify-end w-full">
          <button
            className="inline-block w-28 px-6 py-3 sm:py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
            onClick={() => setIsModalOpen(true)}
          >
            Add
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="modal-box w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <form onSubmit={handleSubmit}>
                  <button
                    type="button"
                    className="btn btn-sm btn-circle border-gray-400 rounded-xl btn-ghost absolute right-2 top-2"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>

                  <div className="pt-12 rounded-lg">
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="relative">
                        <label htmlFor="managerName" className="block mb-1 text-sm font-semibold text-gray-700">Manager Name</label>
                        <input
                          type="text"
                          id="managerName"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
                          placeholder="Manager Name"
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="managerEmail" className="block mb-1 text-sm font-semibold text-gray-700">Manager Email</label>
                        <input
                          type="email"
                          id="managerEmail"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
                          placeholder="Manager Email"
                          value={managerEmail}
                          onChange={(e) => setManagerEmail(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="managerPassword" className="block mb-1 font-semibold text-sm text-gray-700">Manager Password</label>
                        <input
                          type="password" // Change type to password for security
                          id="managerPassword"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
                          placeholder="Manager Password"
                          value={managerPassword}
                          onChange={(e) => setManagerPassword(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="managerMobile" className="block mb-1 font-semibold text-sm text-gray-700">Manager Mobile</label>
                        <input
                          type="text" // Use text for better handling of mobile numbers
                          id="managerMobile"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
                          placeholder="Manager Mobile"
                          value={managerMobile}
                          onChange={(e) => setManagerMobile(e.target.value)}
                        />
                      </div>

                      <div className="relative">
                        <label htmlFor="managerBranch" className="block font-semibold mb-1 text-sm text-gray-700"> Center_Branch</label>
                        <select
                          id="managerBranch"
                          className="select select-bordered w-full "
                          value={selectedBranch}
                          onChange={(e) => {
                            setSelectedBranch(e.target.value);
                            setSelectedAddress(""); // Reset address when branch changes
                          }}
                        >
                          <option value="" disabled>Select Center_Branch</option>
                          {centerBranch.map((branch, index) => (
                            <option key={index} value={branch}>{branch}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <label htmlFor="managerAddress" className="block mb-1 text-sm font-semibold text-gray-700">Select Address</label>
                        <select
                          id="managerAddress"
                          className="select select-bordered w-full "
                          value={selectedAddress}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                        >
                          <option value="" disabled>Select Address</option>
                          {branchAddresses[selectedBranch]?.map((address, index) => (
                            <option key={index} value={address}>{address}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-block w-full px-6 py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                    >
                      Add Manager
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddButton;
