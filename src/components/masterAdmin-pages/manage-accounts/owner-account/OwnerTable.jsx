// import React, { useState, useEffect } from "react";
// import { db } from "../../../../firebase/firebaseConfig"; // Import your Firebase config
// import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import { Table } from "flowbite-react";
// import { useAlert } from 'react-alert';
// import OwnerUpdate from "./OwnerUpdate";

// const OwnerTable = () => {
//   const [admin, setAdmin] = useState([]);
//   const [centerBranch, setCenterBranch] = useState([]);
//   const [city, setCity] = useState("All");
//   const alert = useAlert();

//   const role = "Master"

//   // Fetch unique center branches from Firestore
//   useEffect(() => {
//     const centersCollection = collection(db, "Centers");
//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersData = snapshot.docs.map((doc) => doc.data());
//       const centersNamesSet = new Set(
//         centersData.map((doc) => doc.Center_Branch) // Adjust to your actual property name
//       );
//       setCenterBranch(Array.from(centersNamesSet));
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch admin accounts from Firestore based on role
//   useEffect(() => {
//     if (role) {
//       const centersCollection = collection(db, "Registrations");
//       const roleQuery = query(centersCollection, where("Role", "==", role)); // Query where role matches

//       const unsubscribe = onSnapshot(
//         roleQuery,
//         (snapshot) => {
//           const centersList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setAdmin(centersList);
//         },
//         (error) => {
//           console.error("Error fetching centers data:", error);
//           alert.show('No Such Document.', { type: 'error', timeout: 3000 });
//         }
//       );

//       return () => unsubscribe();
//     }
//   }, [role]);

//   const handleDelete = async (id) => {
//     try {
//       const centerDoc = doc(db, "Registrations", id); // Reference to the center document
//       await deleteDoc(centerDoc); // Delete the document
//       alert.show('Deleted successfully!', { type: 'success', timeout: 3000 });
//     } catch (error) {
//       console.error("Error deleting center:", error);
//       alert.show('Failed to delete center account.', { type: 'error', timeout: 3000 });
//     }
//   };

//   // Filter admin accounts based on selected branch
//   const filteredAdmin = admin.filter((elem) => {
//     return city === "All" || elem.Branch === city;
//   });

//   return (
//     <div>
//       <div className="overflow-x-auto ">

//         <div className="overflow-y-scroll hide-scrollbar pb-8 px-4">
//           <Table className="min-w-full shadow-lg mt-6 rounded-xl shadow-gray-400 dark:shadow-none">
//             <Table.Head>
//               <Table.HeadCell>Owner_Name</Table.HeadCell>
//               <Table.HeadCell>Owner_Email</Table.HeadCell>
//               <Table.HeadCell>Owner_Password</Table.HeadCell>
//               <Table.HeadCell>Owner_Number</Table.HeadCell>
             
//               <Table.HeadCell>Operations</Table.HeadCell>
//             </Table.Head>
//             <Table.Body className="divide-y">
//               {filteredAdmin.length > 0 ? (
//                 filteredAdmin.map((elem) => (
//                   <Table.Row key={elem.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
//                     <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                       {elem.Name}
//                     </Table.Cell>
//                     <Table.Cell>{elem.Email}</Table.Cell>
//                     <Table.Cell>{elem.Password}</Table.Cell>
//                     <Table.Cell>{elem.Number}</Table.Cell>
                  
//                     <Table.Cell>
//                       <div className="flex flex-wrap gap-2">
//                         <button
//                           className="text-red-500 font-bold cursor-pointer"
//                           onClick={() => handleDelete(elem.id)}
//                         >
//                           Delete
//                         </button>
//                         <OwnerUpdate docId={elem.id} />
//                       </div>
//                     </Table.Cell>
//                   </Table.Row>
//                 ))
//               ) : (
//                 <Table.Row>
//                   <Table.Cell colSpan={6} className="text-center">
//                     No centers available.
//                   </Table.Cell>
//                 </Table.Row>
//               )}
//             </Table.Body>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OwnerTable;















import React, { useState, useEffect, useMemo } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Table } from "flowbite-react";
import { useAlert } from 'react-alert';
import OwnerUpdate from "./OwnerUpdate";

const OwnerTable = () => {
  const [admin, setAdmin] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [city, setCity] = useState("All");
  const alert = useAlert();
  const role = "Master";

  // Fetch unique center branches from Firestore
  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(centersData.map((doc) => doc.Center_Branch));
      setCenterBranch(Array.from(centersNamesSet));
    });

    return () => unsubscribe();
  }, []);

  // Fetch admin accounts from Firestore based on role
  useEffect(() => {
    if (role) {
      const centersCollection = collection(db, "Registrations");
      const roleQuery = query(centersCollection, where("Role", "==", role));

      const unsubscribe = onSnapshot(
        roleQuery,
        (snapshot) => {
          const centersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log("Fetched admin accounts:", centersList); // Check fetched data
          setAdmin(centersList);
        },
        (error) => {
          console.error("Error fetching centers data:", error);
          alert.show('No Such Document.', { type: 'error', timeout: 3000 });
        }
      );

      return () => unsubscribe();
    }
  }, [role]);

  const handleDelete = async (id) => {
    try {
      const centerDoc = doc(db, "Registrations", id);
      await deleteDoc(centerDoc);
      alert.show('Deleted successfully!', { type: 'success', timeout: 3000 });
    } catch (error) {
      console.error("Error deleting center:", error);
      alert.show('Failed to delete center account.', { type: 'error', timeout: 3000 });
    }
  };

  // Filter admin accounts based on selected branch
  const filteredAdmin = useMemo(() => {
    return admin.filter((elem) => city === "All" || elem.Branch === city);
  }, [admin, city]);

  return (
    <div>
      <div className="overflow-x-auto mt-8">
        <div className="overflow-y-scroll hide-scrollbar pb-8 px-4">
          <Table className="shadow-gray-400 shadow-lg">
            <Table.Head>
              <Table.HeadCell>Owner_Name</Table.HeadCell>
              <Table.HeadCell>Owner_Email</Table.HeadCell>
              <Table.HeadCell>Owner_Password</Table.HeadCell>
              <Table.HeadCell>Owner_Number</Table.HeadCell>
              <Table.HeadCell>Operations</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredAdmin.length > 0 ? (
                filteredAdmin.map((elem) => (
                  <Table.Row key={elem.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {elem.Name}
                    </Table.Cell>
                    <Table.Cell>{elem.Email}</Table.Cell>
                    <Table.Cell>{elem.Password}</Table.Cell>
                    <Table.Cell>{elem.Number}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="text-red-500 font-bold cursor-pointer"
                          onClick={() => handleDelete(elem.id)}
                        >
                          Delete
                        </button>
                        <OwnerUpdate docId={elem.id} />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center">
                    No centers available.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OwnerTable;
