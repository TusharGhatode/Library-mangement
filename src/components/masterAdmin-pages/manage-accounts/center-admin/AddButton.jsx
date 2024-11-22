import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { useAlert } from 'react-alert';

const AddButton = () => {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminNumber, setAdminNumber] = useState("");
  const [branch, setBranch] = useState("All");
  const [centerBranch, setCenterBranch] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const alert = useAlert(); // Initialize alert

  // Fetch center branches from Firestore
  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(
      centersCollection,
      (snapshot) => {
        const centersNamesSet = new Set(
          snapshot.docs.map((doc) => doc.data().Center_Branch)
        );
        setCenterBranch(Array.from(centersNamesSet));
      },
      (error) => {
        console.error("Error fetching centers: ", error);
        alert.show("Failed to load centers data", { type: 'error', timeout: 3000 }); // Using alert.show
      }
    );

    return () => unsubscribe();
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !adminName ||
      !adminEmail ||
      !adminPassword ||
      !adminNumber ||
      branch === "All"
    ) {
      alert.show("All fields are required!", { type: 'error', timeout: 3000 }); // Using alert.show
      return;
    }

    // Check if the branch already exists
    const branchQuery = query(
      collection(db, "Registrations"),
      where("Branch", "==", branch),
      where("Role", "==", "Admin")
    );
    const querySnapshot = await getDocs(branchQuery);

    if (!querySnapshot.empty) {
      alert.show("Center branch already exists!", { type: 'error', timeout: 3000 }); // Using alert.show
      return;
    }

    try {
      await addDoc(collection(db, "Registrations"), {
        Name: adminName,
        Email: adminEmail,
        Password: adminPassword,
        Number: adminNumber,
        Branch: branch,
        Role:"Admin"
      });

      setIsModalOpen(false);
      setAdminName("");
      setAdminEmail("");
      setAdminPassword("");
      setAdminNumber("");
      setBranch("All");

      alert.show("Added successfully!", {
        type: 'success',
        timeout: 3000,
      }); // Using alert.show
    } catch (error) {
      console.error("Error adding center: ", error);
      alert.show("Failed to add center account", { type: 'error', timeout: 3000 }); // Using alert.show
    }
  };

  return (
    <div>
  <div className="second bg-gray-200 dark:bg-[#001F3F] gap-1 h-[10vh] flex flex-wrap items-center px-2 sm:h-[8vh] sm:px-8">
    <div className="left flex justify-end w-full">
      <button
        className="inline-block w-28 px-6 py-3 sm:py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
        onClick={() => setIsModalOpen(true)} // Toggle modal visibility
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
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Admin Name
                    </label>
                    <input
                      type="text"
                      className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-xl border border-gray-400"
                      placeholder="Enter Admin Name"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-xl border border-gray-400"
                      placeholder="Enter Admin Email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Admin Password
                    </label>
                    <input
                      type="text"
                      className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-xl border border-gray-400"
                      placeholder="Enter Admin Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Admin Number
                    </label>
                    <input
                      type="number"
                      className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-xl border border-gray-400"
                      placeholder="Enter Admin Number"
                      value={adminNumber}
                      onChange={(e) => setAdminNumber(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Select Branch
                    </label>
                    <select
                      className="select select-bordered w-full border-gray-400"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      <option value="All">Select Branch</option>
                      {centerBranch.map((branch, index) => (
                        <option key={index} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    className="inline-block w-full sm:w-32 px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
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
