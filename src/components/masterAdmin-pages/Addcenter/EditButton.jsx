// import React, { useState, useEffect } from "react";
// import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
// import { db } from "../../../firebase/firebaseConfig";
// import { useAlert } from 'react-alert';
// import { Button, Modal } from "flowbite-react";

// const EditButton = ({ docId }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [CenterName, setCenterName] = useState("");
//   const [centerAddress, setCenterAddress] = useState("");
//   const [CenterBranch, setCenterBranch] = useState("");
//   const [CenterPhone, setCenterPhone] = useState("");
//   const [CenterEmail, setCenterEmail] = useState("");
//   const alert = useAlert();

//   const handleOpenModal = async () => {
//     setOpenModal(true);
//     const docRef = doc(db, "Centers", docId); 
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       setCenterName(data.Center_Name || "");
//       setCenterBranch(data.Center_Branch || "");
//       setCenterAddress(data.Center_Address || "");
//       setCenterPhone(data.Center_Phone || "");
//       setCenterEmail(data.Center_Email || "");
//     } else {
//       alert.show('No Such Document.', {
//         type: 'error',
//         timeout: 3000,
//       });
//     }
//   };

//   const handleUpdate = async () => {
//     // Validation check for empty fields
//     if (!CenterName || !centerAddress || !CenterBranch || !CenterPhone || !CenterEmail) {
//       alert.show('All fields are required.', {
//         type: 'error',
//         timeout: 3000,
//       });
//       return; // Stop the update if any field is empty
//     }

//     const docRef = doc(db, "Centers", docId); 
//     await updateDoc(docRef, {
//       Center_Name: CenterName,
//       Center_Branch: CenterBranch,
//       Center_Address: centerAddress,
//       Center_Phone: CenterPhone,
//       Center_Email: CenterEmail,
//     });
//     setOpenModal(false);
    
//     alert.show('Updated successfully!', {
//       type: 'success',
//       timeout: 3000,
//     });
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
//         <Modal.Header className="border-none"></Modal.Header>
//         <Modal.Body>
//           <div className="rounded-lg">
//             <div className="grid grid-cols-2 gap-2">
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="name"
//                   className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Name"
//                   value={CenterName}
//                   onChange={(e) => setCenterName(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="number"
//                   name="phone"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Phone"
//                   value={CenterPhone}
//                   onChange={(e) => setCenterPhone(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="email"
//                   name="email"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Email"
//                   value={CenterEmail}
//                   onChange={(e) => setCenterEmail(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   name="manager"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Manager"
//                   value={centerAddress}
//                   onChange={(e) => setCenterAddress(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   name="branch"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
//                   placeholder="Center_Branch"
//                   value={CenterBranch}
//                   onChange={(e) => setCenterBranch(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="sm:flex sm:flex-row-reverse flex gap-4">
//               <button
//                 className="inline-block w-full px-6 py-4 sm:py-4 mt-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
//                 onClick={handleUpdate} 
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










import React, { useState } from "react";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from 'react-alert';
import { Button, Modal } from "flowbite-react";

const EditButton = ({ docId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [CenterName, setCenterName] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [CenterBranch, setCenterBranch] = useState("");
  const [CenterPhone, setCenterPhone] = useState("");
  const [CenterEmail, setCenterEmail] = useState("");
  const alert = useAlert();

  const handleOpenModal = async () => {
    setOpenModal(true);
    const docRef = doc(db, "Centers", docId); 
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setCenterName(data.Center_Name || "");
      setCenterBranch(data.Center_Branch || "");
      setCenterAddress(data.Center_Address || "");
      setCenterPhone(data.Center_Phone || "");
      setCenterEmail(data.Center_Email || "");
    } else {
      alert.show('No Such Document.', {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    // Validation check for empty fields
    if (!CenterName || !centerAddress || !CenterBranch || !CenterPhone || !CenterEmail) {
      alert.show('All fields are required.', {
        type: 'error',
        timeout: 3000,
      });
      return; // Stop the update if any field is empty
    }

    const docRef = doc(db, "Centers", docId); 
    await updateDoc(docRef, {
      Center_Name: CenterName,
      Center_Branch: CenterBranch,
      Center_Address: centerAddress,
      Center_Phone: CenterPhone,
      Center_Email: CenterEmail,
    });
    setOpenModal(false);
    
    alert.show('Updated successfully!', {
      type: 'success',
      timeout: 3000,
    });
  };

  return (
    <div>
      <p
        className="text-green-500 cursor-pointer font-bold"
        onClick={handleOpenModal}
      >
        Edit
      </p>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} size="3xl"  className="w-full" > {/* Increase modal size here */}
        <Modal.Header className="border-none"></Modal.Header>
        <Modal.Body>
          <div className="rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              {/* Center Name Input */}
              <div className="relative mb-3">
                <label htmlFor="centerName" className="block mb-1 text-sm font-medium">Center Name</label>
                <input
                  type="text"
                  id="centerName"
                  className="block w-full border-gray-400 rounded-xl  text-sm h-[50px] px-4 text-slate-900 bg-white border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                  placeholder="Center_Name"
                  value={CenterName}
                  onChange={(e) => setCenterName(e.target.value)}
                />
              </div>

              {/* Center Phone Input */}
              <div className="relative">
                <label htmlFor="centerPhone" className="block mb-1 text-sm font-medium">Center Phone</label>
                <input
                  type="number"
                  id="centerPhone"
                  className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                  placeholder="Center_Phone"
                  value={CenterPhone}
                  onChange={(e) => setCenterPhone(e.target.value)}
                />
              </div>

              {/* Center Email Input */}
              <div className="relative mb-3 col-span-2">
                <label htmlFor="centerEmail" className="block mb-1 text-sm font-medium">Center Email</label>
                <input
                  type="email"
                  id="centerEmail"
                  className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                  placeholder="Center_Email"
                  value={CenterEmail}
                  onChange={(e) => setCenterEmail(e.target.value)}
                />
              </div>

              {/* Center Address Input */}
              <div className="relative">
                <label htmlFor="centerAddress" className="block mb-1 text-sm font-medium">Center Address</label>
                <input
                  type="text"
                  id="centerAddress"
                  className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                  placeholder="Center_Address"
                  value={centerAddress}
                  onChange={(e) => setCenterAddress(e.target.value)}
                />
              </div>

              {/* Center Branch Input */}
              <div className="relative">
                <label htmlFor="centerBranch" className="block mb-1 text-sm font-medium">Center Branch</label>
                <input
                  type="text"
                  id="centerBranch"
                  className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
                  placeholder="Center_Branch"
                  value={CenterBranch}
                  onChange={(e) => setCenterBranch(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:flex sm:flex-row-reverse flex gap-4">
              <button
                className="inline-block w-full px-6 py-4 sm:py-4 mt-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                onClick={handleUpdate} 
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

