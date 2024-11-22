// import React, { useState, useEffect } from "react";
// import { db } from "../../../../firebase/firebaseConfig"; // Import your Firebase config
// import { collection, deleteDoc, onSnapshot, doc } from "firebase/firestore"; // Import doc
// import { Table } from "flowbite-react";
// import EditButton from './EditButton';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";


// const AccountTable = () => {
//   const [admin, setAdmin] = useState([]);

//   useEffect(() => {
//     const centersCollection = collection(db, "manager_account"); 

//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(), 
//       }));
//       setAdmin(centersList); 
      
//     }, (error) => {
//       console.error("Error fetching centers data:", error);
//     });

//     return () => unsubscribe();

//   }, []); 

//   const handleDelete = async (id) => {
//     try {
//       const centerDoc = doc(db, "manager_account", id); // Reference to the center document
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
//       <div className="overflow-x-auto">
//         <Table hoverable>
//           <Table.Head>
//             <Table.HeadCell>Manager_Name</Table.HeadCell>
//             <Table.HeadCell>Manager_email</Table.HeadCell>
//             <Table.HeadCell>Manager_Password</Table.HeadCell>
//             <Table.HeadCell>Manager_number</Table.HeadCell>
//             <Table.HeadCell>Branch_City</Table.HeadCell>
//             <Table.HeadCell>Operations</Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             {admin.length > 0 ? (
//               admin.map((elem) => (
//                 <Table.Row key={elem.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
//                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                     {elem.Manager_Name}
//                   </Table.Cell>
//                   <Table.Cell>{elem.Manager_email}</Table.Cell>
//                   <Table.Cell>{elem.Manager_Password}</Table.Cell>
//                   <Table.Cell>{elem.Manager_number}</Table.Cell>
//                   <Table.Cell>{elem.Branch_City}</Table.Cell>
                  
//                   <Table.Cell>
//                     <div className='flex flex-wrap gap-2'> 
//                       <button className='text-red-500 font-bold cursor-pointer' onClick={() => handleDelete(elem.id)}>
//                         Delete
//                       </button>
//                       <EditButton docId={elem.id}/>
//                     </div>
//                   </Table.Cell>
//                 </Table.Row>
//               ))
//             ) : (
//               <Table.Row>
//                 <Table.Cell colSpan={7} className="text-center">No centers available.</Table.Cell>
//               </Table.Row>
//             )}
//           </Table.Body>
//         </Table>
//       </div>
//     </div>
//   )
// }

// export default AccountTable;
