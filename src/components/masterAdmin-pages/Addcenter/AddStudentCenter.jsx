// import React, { useState, useEffect } from "react";
// import { db } from "../../../firebase/firebaseConfig"; // Import your Firebase config
// import { collection, deleteDoc, onSnapshot, doc } from "firebase/firestore"; // Import doc
// import { Table } from "flowbite-react";
// import EditButton from './EditButton';
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const AddStudentCenter = () => {
//   const [centers, setCenters] = useState([]);
//   const [centerBranch, setCenterBranch] = useState([]);
//   const [branchAddresses, setBranchAddresses] = useState({});
//   const [city, setCity] = useState("All"); // State for selected city
//   const [address, setAddress] = useState(""); // State for selected address

//   useEffect(() => {
//     const centersCollection = collection(db, "Centers");
//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//       // Extract unique center branches
//       const centersNamesSet = new Set(
//         centersData.map((doc) => doc.Center_Branch)
//       );
//       setCenterBranch(Array.from(centersNamesSet));

//       // Map addresses by branch
//       const addressesMap = {};
//       centersData.forEach((doc) => {
//         if (!addressesMap[doc.Center_Branch]) {
//           addressesMap[doc.Center_Branch] = [];
//         }
//         addressesMap[doc.Center_Branch].push(doc.Center_Address);
//       });
//       setBranchAddresses(addressesMap);
      
//       setCenters(centersData); // Store all centers data
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter centers based on city and address
//   const filteredCenters = centers.filter((center) => {
//     const cityMatch = city === "All" || center.Center_Branch === city;
//     const addressMatch = !address || center.Center_Address === address;
//     return cityMatch && addressMatch;
//   });

//   const handleDelete = async (id) => {
//     try {
//       const centerDoc = doc(db, "Centers", id); // Reference to the center document
//       await deleteDoc(centerDoc); // Delete the document
//       toast.warning("Deleted successfully!", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: false,
//         theme: "dark",
//       });
//     } catch (error) {
//       console.error("Error deleting center:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="overflow-x-scroll hide-scrollbar ">
//         <select
//           className="select select-bordered w-40 ml-4 mt-4 mr-2 mb-4 border-gray-400 rounded-xl"
//           value={city}
//           onChange={(e) => {
//             setCity(e.target.value);
//             setAddress(""); // Reset address when city changes
//           }}
//         >
//           <option value="All">All Branch</option>
//           {centerBranch.map((branch, index) => (
//             <option key={index} value={branch}>
//               {branch}
//             </option>
//           ))}
//         </select>

//         <select
//           className="select border-gray-400 rounded-xl  select-bordered w-40 mr-2 mb-2"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           disabled={!city || city === "All"}
//         >
//           <option value="" disabled>
//             Branch Address
//           </option>
//           {branchAddresses[city]?.map((addr, index) => (
//             <option key={index} value={addr}>
//               {addr}
//             </option>
//           ))}
//         </select>

//         <div className="overflow-y-scroll hide-scrollbar pb-8 px-4">
//         <Table hoverable className="overflow-y-auto shadow-lg rounded-xl  shadow-gray-400 dark:shadow-none">
//           <Table.Head>
//             <Table.HeadCell>Center_Name</Table.HeadCell>
//             <Table.HeadCell>Center_Address</Table.HeadCell>
//             <Table.HeadCell>Center_Branch</Table.HeadCell>
//             <Table.HeadCell>Center_Phone</Table.HeadCell>
//             <Table.HeadCell>Center_Email</Table.HeadCell>
//             <Table.HeadCell>Operations</Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             {filteredCenters.length > 0 ? (
//               filteredCenters.map((center) => (
//                 <Table.Row key={center.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
//                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                     {center.Center_Name}
//                   </Table.Cell>
//                   <Table.Cell>{center.Center_Address}</Table.Cell>
//                   <Table.Cell>{center.Center_Branch}</Table.Cell>
//                   <Table.Cell>{center.Center_Phone}</Table.Cell>
//                   <Table.Cell>{center.Center_Email}</Table.Cell>
                  
//                   <Table.Cell>
//                     <div className='flex flex-wrap gap-2'>
//                       <button className='text-red-500 font-bold cursor-pointer' onClick={() => handleDelete(center.id)}>
//                         Delete
//                       </button>
//                       <EditButton docId={center.id} />
//                     </div>
//                   </Table.Cell>
//                 </Table.Row>
//               ))
//             ) : (
//               <Table.Row>
//                 <Table.Cell colSpan={8} className="text-center">No centers available.</Table.Cell>
//               </Table.Row>
//             )}
//           </Table.Body>
//         </Table>
//       </div>
//       </div>

//     </div>
//   );
// };

// export default AddStudentCenter;











import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig"; // Import your Firebase config
import { collection, deleteDoc, onSnapshot, doc } from "firebase/firestore"; // Import doc
import { Table } from "flowbite-react";
import EditButton from './EditButton';
import { useAlert } from 'react-alert';


const AddStudentCenter = () => {
  const [centers, setCenters] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [city, setCity] = useState("All"); // State for selected city
  const [address, setAddress] = useState(""); // State for selected address
  const alert = useAlert();


  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Extract unique center branches
      const centersNamesSet = new Set(
        centersData.map((doc) => doc.Center_Branch)
      );
      setCenterBranch(Array.from(centersNamesSet));

      // Map addresses by branch
      const addressesMap = {};
      centersData.forEach((doc) => {
        if (!addressesMap[doc.Center_Branch]) {
          addressesMap[doc.Center_Branch] = [];
        }
        addressesMap[doc.Center_Branch].push(doc.Center_Address);
      });
      setBranchAddresses(addressesMap);
      
      setCenters(centersData); // Store all centers data
    });

    return () => unsubscribe();
  }, []);

  // Filter centers based on city and address
  const filteredCenters = centers.filter((center) => {
    const cityMatch = city === "All" || center.Center_Branch === city;
    const addressMatch = !address || center.Center_Address === address;
    return cityMatch && addressMatch;
  });

  const handleDelete = async (id) => {
    try {
      const centerDoc = doc(db, "Centers", id); // Reference to the center document
      await deleteDoc(centerDoc); // Delete the document

      // Show success notification after successful deletion
      alert.show('Center deleted successfully!', {
        type: 'success',               // Set the type of alert
        timeout: 3000,                 // Dismiss after 5 seconds   
      });


    } catch (error) {
     
      alert.show('Error deleting center. Please try again.', {
        type: 'error',               // Set the type of alert
        timeout: 3000,                 // Dismiss after 5 seconds   
      });
    
    }
  };

  return (
    <div className="">
      
      <div className="overflow-x-scroll hide-scrollbar z-10">
        <select
          className="select select-bordered w-40 ml-4 mt-4 mr-2 mb-4 border-gray-400 rounded-xl"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setAddress(""); // Reset address when city changes
          }}
        >
          <option value="All">All Branch</option>
          {centerBranch.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <select
          className="select border-gray-400 rounded-xl select-bordered w-40 mr-2 mb-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!city || city === "All"}
        >
          <option value="" disabled>
            Branch Address
          </option>
          {branchAddresses[city]?.map((addr, index) => (
            <option key={index} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        <div className="overflow-y-scroll hide-scrollbar pb-8 px-4 ">
         <div className="overflow-y-auto rounded-md border border-gray-200">
         <Table hoverable className="overflow-y-auto ">
            <Table.Head className="border-b border-gray-300">
              <Table.HeadCell>Center_Name</Table.HeadCell>
              <Table.HeadCell>Center_Address</Table.HeadCell>
              <Table.HeadCell>Center_Branch</Table.HeadCell>
              <Table.HeadCell>Center_Phone</Table.HeadCell>
              <Table.HeadCell>Center_Email</Table.HeadCell>
              <Table.HeadCell>Operations</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredCenters.length > 0 ? (
                filteredCenters.map((center) => (
                  <Table.Row key={center.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {center.Center_Name}
                    </Table.Cell>
                    <Table.Cell>{center.Center_Address}</Table.Cell>
                    <Table.Cell>{center.Center_Branch}</Table.Cell>
                    <Table.Cell>{center.Center_Phone}</Table.Cell>
                    <Table.Cell>{center.Center_Email}</Table.Cell>
                    
                    <Table.Cell>
                      <div className='flex flex-wrap gap-2'>
                        <button className='text-red-500 font-bold cursor-pointer' onClick={() => handleDelete(center.id)}>
                          Delete
                        </button>
                        <EditButton docId={center.id} />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={8} className="text-center">No centers available.</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
         </div>
        </div>
      </div>
     
    </div>
  );
};

export default AddStudentCenter;
