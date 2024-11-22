import React, { useState, useEffect } from "react";
import { collection, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import { Button, Modal } from "flowbite-react";
import { useAlert } from 'react-alert';

const OwnerUpdate = ({ docId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminNumber, setAdminNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [centerBranch, setCenterBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const alert = useAlert();

  

  const handleOpenModal = async () => {
    setOpenModal(true);
    try {
      const docRef = doc(db, "Registrations", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAdminName(data.Name || "");
        setAdminEmail(data.Email || "");
        setAdminPassword(data.Password || "");
        setAdminNumber(data.Number || "");
       
      } else {
        alert.show("No such document found", { type: 'error', timeout: 3000 });
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      alert.show("Error fetching document", { type: 'error', timeout: 3000 });
    }
  };

  const handleUpdate = async () => {
    if (!adminName || !adminEmail || !adminNumber  || !adminPassword) {
      alert.show("Please fill in all fields", { type: 'error', timeout: 3000 });
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "Registrations", docId);
      await updateDoc(docRef, {
        Name: adminName,
        Email: adminEmail,
        Password: adminPassword,
        Number: adminNumber,
      });
      setOpenModal(false);
      alert.show("Updated successfully!", { type: 'success', timeout: 3000 });
    } catch (error) {
      console.error("Error updating document:", error);
      alert.show("Error updating document", { type: 'error', timeout: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <p className="text-green-500 cursor-pointer font-bold" onClick={handleOpenModal}>
      Edit
    </p>
    <Modal dismissible show={openModal} size='3xl' onClose={() => setOpenModal(false)}>
      <Modal.Header className="border-none"></Modal.Header>
      <Modal.Body>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div className="grid grid-cols-2 gap-2 mb-10">
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-gray-400 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
                placeholder="Owner_Name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Owner Phone
              </label>
              <input
                type="number"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-gray-400 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
                placeholder="Owner_Phone"
                value={adminNumber}
                onChange={(e) => setAdminNumber(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-gray-400 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
                placeholder="Owner_Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Owner Password
              </label>
              <input
                type="text"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-gray-400 focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
                placeholder="Owner_Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:flex sm:flex-row-reverse flex gap-4">
            <button
              className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
              type="submit"
              disabled={loading}
            >
              {loading ? "Update" : "Update"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  </div>
  
  );
};

export default OwnerUpdate;
