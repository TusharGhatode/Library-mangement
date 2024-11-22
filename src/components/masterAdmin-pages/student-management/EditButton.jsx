// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   doc,
//   getDoc,
//   updateDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../../../firebase/firebaseConfig";
// import { useAlert } from "react-alert"; // Import useAlert
// import { Button, Modal } from "flowbite-react";

// const EditButton = ({ docId }) => {
//   const [openModal, setOpenModal] = useState(false);
//   const [centerBranch, setCenterBranch] = useState([]);
//   const [branchAddresses, setBranchAddresses] = useState({});
//   const [selectedBranch, setSelectedBranch] = useState("");
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [studentName, setStudentName] = useState("");
//   const [studentPhone, setStudentPhone] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [studentPassword, setStudentPassword] = useState("");
//   const alert = useAlert(); // Initialize the alert

  

//   useEffect(() => {
//     const centersCollection = collection(db, "Centers");
//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersData = snapshot.docs.map((doc) => doc.data());
//       const centersNamesSet = new Set(
//         centersData.map((doc) => doc.Center_Branch)
//       );
//       setCenterBranch(Array.from(centersNamesSet));

//       const addressesMap = {};
//       centersData.forEach((doc) => {
//         if (!addressesMap[doc.Center_Branch]) {
//           addressesMap[doc.Center_Branch] = [];
//         }
//         addressesMap[doc.Center_Branch].push(doc.Center_Address);
//       });
//       setBranchAddresses(addressesMap);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleCenterChange = (e) => {
//     setSelectedBranch(e.target.value);
//     setSelectedAddress(""); // Reset address when branch changes
//   };

//   const handleOpenModal = async () => {
//     setOpenModal(true);

//     const docRef = doc(db, "Registrations", docId);
//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       console.log(data)
//       setStudentName(data.Name || "");
//       setStudentEmail(data.Email || "");
//       setStudentPhone(data.Number || "");
//       setStudentPassword(data.Password || "");

//       // Correct fields for branch and address
//       setSelectedBranch(data.Branch || "");
//       setSelectedAddress(data.Address || "");
//     } else {
//       alert.show("No Such Document", { type: "error", timeout: 3000 });
//     }
//   };

//   const handleUpdate = async () => {
//     // Check for empty values
//     const emptyFields = [];
//     if (!studentName) emptyFields.push("Student Name");
//     if (!studentEmail) emptyFields.push("Student Email");
//     if (!studentPhone) emptyFields.push("Student Phone Number");
//     if (!studentPassword) emptyFields.push("Student Password");
//     if (!selectedBranch) emptyFields.push("Center Branch");
//     if (!selectedAddress) emptyFields.push("Center Address");

//     if (emptyFields.length > 0) {
//       alert.show(`Please fill all details.`, { type: "error", timeout: 3000 });
//       return; // Stop the update process if validation fails
//     }

//     const docRef = doc(db, "Registrations", docId);
//     try {
//       await updateDoc(docRef, {
//         Name: studentName,
//         Email: studentEmail,
//         Number: studentPhone,
//         Password: studentPassword,
//         Branch: selectedBranch,
//         Address: selectedAddress,
//       });
//       setOpenModal(false);
//       alert.show("Update successfully!", { type: "success", timeout: 3000 });
//     } catch (error) {
//       alert.show("Failed to update the document", {
//         type: "error",
//         timeout: 3000,
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
//         <Modal.Header className="border-none"></Modal.Header>
//         <Modal.Body>
//           <div className="pb-6 rounded-lg">
//             <div className="grid grid-cols-2 gap-2 mb-10">
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
//                   placeholder="Student Name"
//                   value={studentName}
//                   onChange={(e) => setStudentName(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="email"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border"
//                   placeholder="Student Email"
//                   value={studentEmail}
//                   onChange={(e) => setStudentEmail(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="text"
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
//                   placeholder="Student Password"
//                   value={studentPassword}
//                   onChange={(e) => setStudentPassword(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <input
//                   type="number"
//                   required
//                   className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
//                   placeholder="Student_Number"
//                   value={studentPhone}
//                   onChange={(e) => setStudentPhone(e.target.value)}
//                 />
//               </div>

//               <div className="relative">
//                 <select
//                   className="select select-bordered w-full border-gray-400 rounded-xl"
//                   value={selectedBranch}
//                   onChange={handleCenterChange}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select Center Branch
//                   </option>
//                   {centerBranch.map((branch, index) => (
//                     <option key={index} value={branch}>
//                       {branch}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="relative">
//                 <select
//                   className="select select-bordered w-full border-gray-400 rounded-xl"
//                   value={selectedAddress}
//                   onChange={(e) => setSelectedAddress(e.target.value)}
//                   required
//                 >
//                   <option value="" disabled>
//                     Select Center Address
//                   </option>
//                   {branchAddresses[selectedBranch]?.map((address, index) => (
//                     <option key={index} value={address}>
//                       {address}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <button
//               className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
//               onClick={handleUpdate}
//             >
//               Update
//             </button>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default EditButton;




















import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from "react-alert"; // Import useAlert
import { Button, Modal } from "flowbite-react";

const EditButton = ({ docId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const alert = useAlert(); // Initialize the alert

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

  const handleCenterChange = (e) => {
    setSelectedBranch(e.target.value);
    setSelectedAddress(""); // Reset address when branch changes
  };

  const handleOpenModal = async () => {
    setOpenModal(true);

    const docRef = doc(db, "Registrations", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data); // Debugging line to check retrieved data
      setStudentName(data.Name || "");
      setStudentEmail(data.Email || "");
      setStudentPhone(data.Number || ""); // Ensure this is set correctly
      setStudentPassword(data.Password || "");

      // Correct fields for branch and address
      setSelectedBranch(data.Branch || "");
      setSelectedAddress(data.Address || "");
    } else {
      alert.show("No Such Document", { type: "error", timeout: 3000 });
    }
  };

  const handleUpdate = async () => {
    // Check for empty values
    const emptyFields = [];
    if (!studentName) emptyFields.push("Student Name");
    if (!studentEmail) emptyFields.push("Student Email");
    if (!studentPhone) emptyFields.push("Student Phone Number");
    if (!studentPassword) emptyFields.push("Student Password");
    if (!selectedBranch) emptyFields.push("Center Branch");
    if (!selectedAddress) emptyFields.push("Center Address");

    if (emptyFields.length > 0) {
      alert.show(`Please fill all details.`, { type: "error", timeout: 3000 });
      return; // Stop the update process if validation fails
    }

    const docRef = doc(db, "Registrations", docId);
    try {
      await updateDoc(docRef, {
        Name: studentName,
        Email: studentEmail,
        Number: studentPhone,
        Password: studentPassword,
        Branch: selectedBranch,
        Address: selectedAddress,
      });
      setOpenModal(false);
      alert.show("Update successfully!", { type: "success", timeout: 3000 });
    } catch (error) {
      alert.show("Failed to update the document", {
        type: "error",
        timeout: 3000,
      });
    }
  };

  return (
    <div>
    <p
      className="text-green-500 cursor-pointer font-bold"
      onClick={handleOpenModal}
    >
      Edit
    </p>
    <Modal dismissible show={openModal} size='3xl' onClose={() => setOpenModal(false)}>
      <Modal.Header className="border-none"></Modal.Header>
      <Modal.Body>
        <div className="pb-6 rounded-lg">
          <div className="grid grid-cols-2 gap-2 mb-10">
            {/* Student Name */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="studentName">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
  
            {/* Student Email */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="studentEmail">
                Student Email
              </label>
              <input
                type="email"
                id="studentEmail"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border-gray-400 rounded-xl border"
                placeholder="Student Email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />
            </div>
  
            {/* Student Password */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="studentPassword">
                Student Password
              </label>
              <input
                type="text"
                id="studentPassword"
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
                placeholder="Student Password"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
              />
            </div>
  
            {/* Student Phone Number */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="studentPhone">
                Student Number
              </label>
              <input
                type="number"
                id="studentPhone"
                required
                className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white border border-gray-400 rounded-xl"
                placeholder="Student Number"
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
              />
            </div>
  
            {/* Select Center Branch */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="selectedBranch">
                Select Center Branch
              </label>
              <select
                id="selectedBranch"
                className="select select-bordered w-full border-gray-400 rounded-xl"
                value={selectedBranch}
                onChange={handleCenterChange}
                required
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
  
            {/* Select Center Address */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="selectedAddress">
                Select Center Address
              </label>
              <select
                id="selectedAddress"
                className="select select-bordered w-full border-gray-400 rounded-xl"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select Center Address
                </option>
                {branchAddresses[selectedBranch]?.map((address, index) => (
                  <option key={index} value={address}>
                    {address}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <button
            className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
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
