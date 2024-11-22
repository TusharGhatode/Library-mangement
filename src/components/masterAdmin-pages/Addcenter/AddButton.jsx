import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from 'react-alert';

const AddButton = () => {
  const [CenterName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [CenterBranch, setCenterBranch] = useState("");
  const [CenterPhone, setCenterPhone] = useState("");
  const [CenterEmail, setCenterEmail] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingCenters, setExistingCenters] = useState([]);
  const alert = useAlert();

  useEffect(() => {
    const fetchCenters = async () => {
      const centersCollection = collection(db, "Centers");
      const centersSnapshot = await getDocs(centersCollection);
      const centersData = centersSnapshot.docs.map((doc) => doc.data());
      setExistingCenters(centersData);
    };
    fetchCenters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty values
    if (!CenterName || !centerAddress || !CenterBranch || !CenterPhone || !CenterEmail) {
      alert.show('Please fill in all fields!', {
        type: 'error',
        timeout: 3000,
      });
      return;
    }

    // Only check for duplicates if there are existing centers
    if (existingCenters.length > 0) {
      const duplicateAddress = existingCenters.some(
        (center) => center.Center_Address === centerAddress
      );

      if (duplicateAddress) {
        alert.show("Center Address already exists! Use a different address.", {
          type: 'error',
          timeout: 3000,
        });
        return;
      }
    }

    try {
      await addDoc(collection(db, "Centers"), {
        Center_Name: CenterName,
        Center_Address: centerAddress,
        Center_Branch: CenterBranch,
        Center_Phone: CenterPhone,
        Center_Email: CenterEmail,
      });

      // Clear form fields after successful submission
      setCenterName("");
      setCenterAddress("");
      setCenterBranch("");
      setCenterPhone("");
      setCenterEmail("");
      setIsModalOpen(false);

      alert.show('Center added successfully!', {
        type: 'success',
        timeout: 3000,
      });

    } catch (error) {
      alert.show('Failed to add center. Please try again.', {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  const openModal = () => {
    // Reset form fields when opening the modal
    setCenterName("");
    setCenterAddress("");
    setCenterBranch("");
    setCenterPhone("");
    setCenterEmail("");
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="second bg-[#FAF7F0] rounded-md dark:bg-[#001F3F] mr-[0.5px] gap-1 h-[10vh] flex flex-wrap items-center px-2 sm:h-[8vh] sm:px-8">
        <div className="left flex justify-end w-full">
          <button
            className="inline-block w-28 px-6 py-3 sm:py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
            onClick={openModal}
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
                          Center Name
                        </label>
                        <input
                          type="text"
                          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
                          placeholder="Enter Center Name"
                          value={CenterName}
                          onChange={(e) => setCenterName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Center Phone
                        </label>
                        <input
                          type="number"
                          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
                          placeholder="Enter Center Phone"
                          value={CenterPhone}
                          onChange={(e) => setCenterPhone(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Center Email
                        </label>
                        <input
                          type="email"
                          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
                          placeholder="Enter Center Email"
                          value={CenterEmail}
                          onChange={(e) => setCenterEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Center Branch
                        </label>
                        <input
                          type="text"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border"
                          placeholder="Enter Center Branch"
                          value={CenterBranch}
                          onChange={(e) => setCenterBranch(e.target.value)}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Center Address
                        </label>
                        <input
                          type="text"
                          className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
                          placeholder="Enter Center Address"
                          value={centerAddress}
                          onChange={(e) => setCenterAddress(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        className="inline-block w-full sm:w-32 px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                        type="submit"
                      >
                        Add
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
