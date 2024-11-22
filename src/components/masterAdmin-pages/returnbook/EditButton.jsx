

import React, { useEffect, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../../firebase/firebaseConfig"; // Ensure to import your Firestore configuration
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const EditButton = ({ docId }) => {
  const [status, setStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
  const [openModal, setOpenModal] = useState(false);

  const handleUpdate = async () => {
    const docRef = doc(db, "issuebook", docId); // Get the document reference
    await updateDoc(docRef, {
      Status: status,
      Return_Date: selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : null, // Format date to ISO string
    });
    setOpenModal(false); // Close the modal
    setStatus(""); // Reset status after closing
    setSelectedDate(null); // Reset selected date after closing
  };

  return (
    <div>
      <p
        className="text-green-500 cursor-pointer font-bold"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Return
      </p>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header className="border-none"></Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4 cursor-pointer">
            <DatePicker
              id="returnDate"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-gray-400 rounded-lg cursor-pointer p-3 w-full text-center" // Added 'text-center' class
              placeholderText="📅 Select Date"
              minDate={new Date()}
            />

            <button
              className="w-full px-6 py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditButton;
