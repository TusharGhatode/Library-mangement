// import React, { useState } from 'react';
// import { Modal } from "flowbite-react";
// import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import Firestore functions
// import { db } from "../../../firebase/firebaseConfig"; // Ensure to import your Firestore configuration
// import { useAlert } from 'react-alert';

// const EditButton = ({ docId }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [status, setStatus] = useState('');
//   const alert = useAlert();

//   // Fetch document data when the modal opens
//   const fetchData = async () => {
//     const docRef = doc(db, "issueBook", docId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       setStatus(data.Status); // Set the status to the current document's status for editing
//     } else {
//       console.error("No such document!");
//       alert.show('Document not found', { type: 'error' });
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const docRef = doc(db, "issueBook", docId);
//       await updateDoc(docRef, { status: status }); // Update the document (make sure 'Status' matches your Firestore field name)
//       alert.show('Status Updated', {
//         type: 'success',
//         timeout: 3000,
//       });
//       setOpenModal(false); // Close the modal
//     } catch (error) {
//       console.error("Error updating document: ", error);
//       alert.show('Error updating status', { type: 'error' });
//     }
//   };

//   return (
//     <div>
//       <p
//         className="text-green-500 cursor-pointer font-bold"
//         onClick={() => {
//           fetchData(); // Fetch data when opening the modal
//           setOpenModal(true);
//         }}
//       >
//         Edit
//       </p>
//       <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
//         <Modal.Header className='border-none'></Modal.Header>
//         <Modal.Body>
//           <div className="pb-6 rounded-lg">
//             <div className="mb-10">
//               <div id="input" className="relative">
//                 <select
//                   className="select select-bordered w-full"
//                   value={status} // Set the selected value to status
//                   onChange={(e) => setStatus(e.target.value)} // Update status on change
//                 >
//                   <option value="" disabled>
//                     Status
//                   </option>
//                   <option value="Approve">Approve</option>
//                   <option value="Pending Approval">Pending Approval</option>
//                 </select>
//               </div>
//             </div>

//             <div className="sm:flex sm:flex-row-reverse flex gap-4">
//               <button
//                 className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
//                 onClick={handleUpdate} // Call handleUpdate on button click
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default EditButton;
