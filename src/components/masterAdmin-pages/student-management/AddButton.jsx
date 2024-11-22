import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, onSnapshot, addDoc, query, where, getDocs } from "firebase/firestore";
import { useAlert } from 'react-alert'; // Import useAlert from the alert library

const AddButton = () => {
  const alert = useAlert(); // Initialize the alert hook
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleEmailCheck = async (email) => {
    const studentCollection = collection(db, "Registrations");
    const q = query(
      studentCollection,
      where("Email", "==", email),
      where("Role", "==", "Student") // Check for Role "Student"
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if email exists
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check for empty fields
    if (!studentName || !studentEmail || !studentPassword || !studentPhone || !selectedBranch || !selectedAddress) {
      alert.show('Please fill in all fields.', {
        type: 'error',
        timeout: 3000,
      });
      return;
    }

    // Check if email already exists with role "Student"
    const emailExists = await handleEmailCheck(studentEmail);
    if (emailExists) {
      alert.show('Email exists with the role "Student".', {
        type: 'error',
        timeout: 3000,
      });
      return;
    }

    try {
      await addDoc(collection(db, "Registrations"), {
        Name: studentName,
        Email: studentEmail,
        Password: studentPassword,
        Number: studentPhone,
        Branch: selectedBranch,
        Address: selectedAddress,
        Role: "Student",
      });

      // Reset form fields
      setStudentName("");
      setStudentEmail("");
      setStudentPhone("");
      setSelectedBranch("");
      setSelectedAddress("");
      setStudentPassword("");

      document.getElementById("my_modal_3").close();
      alert.show('Added successfully!', {
        type: 'success',
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error adding student: ", error);
      alert.show('Error adding student.', {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  return (
    <div>
  {/* Error Modal */}
  <dialog id="error_modal" className="modal ">
    <div className="modal-box ">
      <h2 className="text-red-600">{errorMessage}</h2>
      <div className="modal-action">
        <button
          className="btn"
          onClick={() => document.getElementById("error_modal").close()}
        >
          Close
        </button>
      </div>
    </div>
  </dialog>

  <div className="second bg-gray-200 dark:bg-[#001F3F] gap-1 h-[10vh] flex flex-wrap items-center justify-between px-2 sm:h-[8vh] sm:px-4">
    <div className="left flex flex-wrap justify-end w-full">
      <div>
        <button
          className="inline-block w-28 px-6 py-3 sm:py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Add
        </button>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-full max-w-4xl p-8"> {/* Increase width */}
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              type="button"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </button>
          </form>

          <div className="pt-8 rounded-sm">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4"
                    placeholder="Enter Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4"
                    placeholder="Enter Student Email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />
                </div>

                
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Student Password
                  </label>
                  <input
                    type="text"
                    className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4"
                    placeholder="Enter Student Password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                  </label>
                  <input
                    type="number"
                    className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4"
                    placeholder="Enter Phone Number"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                  />
                </div>



                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Center Branch
                  </label>
                  <select
                    className="select border-gray-400 rounded-xl select-bordered w-full"
                    value={selectedBranch}
                    onChange={(e) => {
                      setSelectedBranch(e.target.value);
                      setSelectedAddress(""); // Reset address when branch changes
                    }}
                  >
                    <option value="" disabled>
                      Select Center Branch
                    </option>
                    {centerBranch.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Center Address
                  </label>
                  <select
                    className="select border-gray-400 rounded-xl select-bordered w-full"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Center Address
                    </option>
                    {selectedBranch &&
                      branchAddresses[selectedBranch]?.map((address, index) => (
                        <option key={index} value={address}>
                          {address}
                        </option>
                      ))}
                  </select>
                </div>

              </div>

              <button
                className="inline-block w-full bg-gradient-to-tl from-orange-700 to-orange-400 px-6 py-3 text-sm font-bold text-center text-white uppercase rounded-lg"
                type="submit"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</div>

  );
};

export default AddButton;
