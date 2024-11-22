import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from "react-alert"; // Import useAlert from react-alert
import { Button, Modal } from "flowbite-react";

const EditButton = ({ docId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerMobile, setManagerMobile] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const alert = useAlert(); // Initialize the alert

  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(centersData.map((doc) => doc.Center_Branch));
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

  const handleOpenModal = async () => {
    setOpenModal(true);

    const docRef = doc(db, "Registrations", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setManagerName(data.Name || "");
      setManagerMobile(data.Mobile || "");
      setManagerEmail(data.Email || "");
      setManagerPassword(data.Password || "");
      setSelectedBranch(data.Branch || "");
      setSelectedAddress(data.Address || ""); // Set existing address
    } else {
      alert.show("No such document exists!", { 
        type: 'error', 
        timeout: 3000 
      }); // Use alert.show for error message
    }
  };

  const handleUpdate = async () => {
    if (
      managerName === "" ||
      managerEmail === "" ||
      managerPassword === "" ||
      managerMobile === "" ||
      selectedBranch === "" ||
      selectedAddress === ""
    ) {
      alert.show("All fields are required!", { 
        type: 'error', 
        timeout: 3000 
      }); // Use alert.show for error message
      return;
    }

    const docRef = doc(db, "Registrations", docId);
    const dataToUpdate = {
      Name: managerName,
      Mobile: managerMobile,
      Branch: selectedBranch,
      Email: managerEmail,
      Password: managerPassword,
      Address: selectedAddress,
    };

    const existingDoc = await getDoc(docRef);
    const existingData = existingDoc.data();

    if (JSON.stringify(existingData) !== JSON.stringify(dataToUpdate)) {
      await updateDoc(docRef, dataToUpdate);
      alert.show("Update successfully!", { 
        type: 'success', 
        timeout: 3000 
      }); // Use alert.show for success message
    } else {
      alert.show("No changes detected.", { 
        type: 'info', 
        timeout: 3000 
      }); // Use alert.show for info message
    }
    setOpenModal(false);
  };

  return (
    <div>
  <p className="text-green-500 cursor-pointer font-bold" onClick={handleOpenModal}>
    Edit
  </p>
  <Modal dismissible show={openModal} size="3xl" onClose={() => setOpenModal(false)}>
    <Modal.Header className="border-none"></Modal.Header>
    <Modal.Body>
      <div className="pb-6 rounded-lg">
        <div className="grid grid-cols-2 gap-2 mb-10">
          <div id="input" className="relative mb-3">
            <label htmlFor="managerName" className="block text-sm font-semibold text-gray-700 mb-1">Manager Name</label>
            <input
              id="managerName"
              type="text"
              className="block w-full text-sm h-[50px] px-4 border-gray-400 rounded-xl text-slate-900 bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer"
              placeholder="Manager Name"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
            />
          </div>

          <div id="input" className="relative">
            <label htmlFor="managerEmail" className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
            <input
              id="managerEmail"
              type="email"
              className="block w-full text-sm h-[50px] px-4 text-slate-900 border-gray-400 rounded-xl bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer"
              placeholder="Manager Email"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
            />
          </div>

          <div id="input" className="relative mb-3">
            <label htmlFor="managerPassword" className="block text-sm font-semibold text-gray-700 mb-1">Manager Password</label>
            <input
              id="managerPassword"
              type="text"
              className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4 text-slate-900 bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer"
              placeholder="Manager Password"
              value={managerPassword}
              onChange={(e) => setManagerPassword(e.target.value)}
            />
          </div>

          <div id="input" className="relative">
            <label htmlFor="managerMobile" className="block text-sm font-semibold text-gray-700 mb-1">Manager Mobile</label>
            <input
              id="managerMobile"
              type="number"
              className="block border-gray-400 rounded-xl w-full text-sm h-[50px] px-4 text-slate-900 bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer"
              placeholder="Manager Mobile"
              value={managerMobile}
              onChange={(e) => setManagerMobile(e.target.value)}
            />
          </div>

          <div id="input" className="relative">
            <label htmlFor="centerBranch" className="block text-sm font-semibold text-gray-700 mb-1">Select Center Branch</label>
            <select
              id="centerBranch"
              className="select select-bordered border-gray-400 rounded-xl w-full "
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedAddress(""); // Clear selected address when branch changes
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

          <div id="input" className="relative">
            <label htmlFor="branchAddress" className="block text-sm font-semibold text-gray-700 mb-1">Select Branch Address</label>
            <select
              id="branchAddress"
              className="select select-bordered w-full border-gray-400 rounded-xl "
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            >
              <option value="" disabled>
                Select Branch Address
              </option>
              {(branchAddresses[selectedBranch] || []).map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sm:flex sm:flex-row-reverse flex gap-4">
          <button
            className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
            onClick={handleUpdate}
            type="button"
          >
            Update
          </button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
</div>

  );
};

export default EditButton;
