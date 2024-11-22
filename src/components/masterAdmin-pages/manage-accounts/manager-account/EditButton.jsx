// import React, { useState, useEffect } from "react";
// import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../../../firebase/firebaseConfig";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Button, Modal } from "flowbite-react";

// const EditButton = ( { docId } ) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [adminName, setAdminName] = useState("");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminNumber, setAdminNumber] = useState("");
//   const [branch, setBranch] = useState("");

//   const handleOpenModal = async () => {
//     setOpenModal(true);

//     try {
//       const docRef = doc(db, "Registrations", docId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setAdminName(data.Name || "");
//         setAdminEmail(data.Email || "");
//         setAdminNumber(data.Number || "");
//         setBranch(data.Branch || "");
//       } else {
//         toast.error("No Such Document", {
//           position: "top-center",
//           autoClose: 3000,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: false,
//           theme: "dark",
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching document:", error);
//       toast.error("Error fetching document", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         theme: "dark",
//       });
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const docRef = doc(db, "Registrations", docId);
//       await updateDoc(docRef, {
//         Name: adminName,
//         Email: adminEmail,
//         Number: adminNumber,
//         Branch: branch,
//       });

//       setOpenModal(false);
//       toast.success("Update successful!", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         theme: "dark",
//       });
//     } catch (error) {
//       console.error("Error updating document:", error);
//       toast.error("Error updating document", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         theme: "dark",
//       });
//     }
//   };

//   return (
//     <div>
//       <p
//         className="text-green-500 cursor-pointer font-bold"
//         onClick={handleOpenModal}
//       >
//         Edit
//       </p>
//       <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
//         <Modal.Header>Update List</Modal.Header>
//         <Modal.Body>
//           <div className="pt-12 pb-6 rounded-lg">
//             <div className="grid grid-cols-2 gap-2 mb-10">
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="name"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="manager_Name"
//                   value={adminName}
//                   onChange={(e) => setAdminName(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   name="phone"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="manager_Phone"
//                   value={adminNumber}
//                   onChange={(e) => setAdminNumber(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="email"
//                   name="email"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="manager_Email"
//                   value={adminEmail}
//                   onChange={(e) => setAdminEmail(e.target.value)}
//                 />
//               </div>

           
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="branch"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Branch"
//                   value={branch}
//                   onChange={(e) => setBranch(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="sm:flex sm:flex-row-reverse flex gap-4">
//               <Button onClick={handleUpdate}>Update</Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//       <ToastContainer />
//     </div>
//   );
// };

// export default EditButton;



import React from 'react'

const EditButton = () => {
  return (
    <div>EditButton</div>
  )
}

export default EditButton