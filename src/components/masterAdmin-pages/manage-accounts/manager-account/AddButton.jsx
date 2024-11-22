// import React, { useState } from "react";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../../../../firebase/firebaseConfig";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AddButton = () => {
//   const [adminName, setAdminName] = useState("");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [adminNumber, setAdminNumber] = useState("");
//   const [branch, setBranch] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await addDoc(collection(db, "manager_account"), {
//         Manager_Name: adminName,
//         Manager_email: adminEmail,
//         Manager_Password: adminPassword,
//         Manager_number: adminNumber,
//         Branch_City: branch,
//       });
//       setIsModalOpen(false);
//       setAdminName("");
//       setAdminPassword("");
//       setAdminEmail("");
//       setAdminNumber("");
//       setBranch("");

//       toast.success("Added successfully!", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         theme: "dark",
//       });
//     } catch (error) {
//       console.error("Error adding center: ", error);
//     }
//   };

//   return (
//     <div>
//       <div className="second mx-0.5 bg-gray-200 dark:bg-[#001F3F] gap-1 h-[20vh] flex flex-wrap items-center px-2 sm:h-[8vh] sm:px-4">
//         <div className="left flex justify-end w-full">
//           <div>
//             <button
//               className="inline-block w-28 px-6 py-3 sm:py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
//               onClick={() => setIsModalOpen(true)} // Toggle modal visibility
//             >
//               Add
//             </button>
//           </div>

//           {isModalOpen && (
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//               <div className="modal-box">
//                 <form onSubmit={handleSubmit}>
//                   {/* Close button */}
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     ✕
//                   </button>

//                   <div className="pt-12 pb-6 rounded-lg">
//                     <div className="grid grid-cols-2 gap-2 mb-10">
//                       <input
//                         type="text"
//                         className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
//                         placeholder="manager_Name"
//                         value={adminName}
//                         onChange={(e) => setAdminName(e.target.value)}
//                       />

//                       <input
//                         type="email"
//                         className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
//                         placeholder="manager_email"
//                         value={adminEmail}
//                         onChange={(e) => setAdminEmail(e.target.value)}
//                       />

//                       <input
//                         type="text"
//                         className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
//                         placeholder="manager_password"
//                         value={adminPassword}
//                         onChange={(e) => setAdminPassword(e.target.value)}
//                       />

//                       <input
//                         type="text"
//                         className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
//                         placeholder="manager_number"
//                         value={adminNumber}
//                         onChange={(e) => setAdminNumber(e.target.value)}
//                       />

//                       <input
//                         type="text"
//                         className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200"
//                         placeholder="Branch_City"
//                         value={branch}
//                         onChange={(e) => setBranch(e.target.value)}
//                       />
//                     </div>

//                     {/* Save Button */}
//                     <div className="sm:flex sm:flex-row-reverse flex gap-4">
//                       <button
//                         className="w-fit rounded-lg text-sm px-5 py-2 h-[50px] border bg-violet-500 hover:bg-violet-600 text-white"
//                         type="submit"
//                       >
//                         Save
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AddButton;
