// import React, { useState, useEffect } from "react";
// import { Table } from "flowbite-react";
// import { db } from "../../../../firebase/firebaseConfig"; // Import your Firebase config
// import { collection, onSnapshot } from "firebase/firestore";
// import "react-toastify/dist/ReactToastify.css";

// const DetailTable = () => {
//   const [managers, setManagers] = useState([]);
//   const [centers, setCenters] = useState([]);
//   const [admins, setAdmins] = useState([]);

//   console.log(admins)
  
//   // Fetch the center branches
//   useEffect(() => {
//     const centersCollection = collection(db, "Centers");
//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setCenters(centersData);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch the manager data
//   useEffect(() => {
//     const managersCollection = collection(db, "Registrations");
//     const unsubscribe = onSnapshot(managersCollection, (snapshot) => {
//       const managersList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setManagers(managersList);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch the admin data
//   useEffect(() => {
//     const adminsCollection = collection(db, "Registrations");
//     const unsubscribe = onSnapshot(adminsCollection, (snapshot) => {
//       const adminsList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setAdmins(adminsList);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Helper function to get admin and manager details for a center branch
//   const getAdminForCenter = (centerBranch) => {
//     return admins.find(admin => admin.Branch === centerBranch);
//   };

//   const getManagerForCenter = (Center_Address) => {
//     return managers.find(manager => manager.Address === Center_Address);
//   };

//   return (
//     <div>
//       <div className="px-4 py-4">

    
//       <Table hoverable className="overflow-y-auto shadow-lg rounded-xl mt-2  shadow-gray-400 dark:shadow-none">
//         <Table.Head>
//           <Table.HeadCell>Center_Name</Table.HeadCell>
//           <Table.HeadCell>Center_Address</Table.HeadCell>
//           <Table.HeadCell>Center_Branch</Table.HeadCell>
//           <Table.HeadCell>Admin</Table.HeadCell>
//           <Table.HeadCell>Manager</Table.HeadCell>
//         </Table.Head>
//         <Table.Body className="divide-y">
//           {centers.length > 0 ? (
//             centers.map((center, id) => {
//               const admin = getAdminForCenter(center.Center_Branch);
//               const manager = getManagerForCenter(center.Center_Address);

//               return (
//                 <Table.Row
//                   key={id}
//                   className="bg-white dark:border-gray-700 dark:bg-gray-800"
//                 >
//                   <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                     {center.Center_Name || "N/A"}
//                   </Table.Cell>
//                   <Table.Cell>{center.Center_Address || "N/A"}</Table.Cell>
//                   <Table.Cell>{center.Center_Branch || "N/A"}</Table.Cell>
//                   <Table.Cell>{admin?.Admin_Name || "N/A"}</Table.Cell>
//                   <Table.Cell>{manager?.Manager_Name || "N/A"}</Table.Cell>
//                 </Table.Row>
//               );
//             })
//           ) : (
//             <Table.Row>
//               <Table.Cell colSpan={5} className="text-center">
//                 No Data available.
//               </Table.Cell>
//             </Table.Row>
//           )}
//         </Table.Body>
//       </Table>
//     </div>
//     </div>
//   );
// };

// export default DetailTable;




import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";

const DetailTable = () => {
  const [managers, setManagers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Fetch the center branches
  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCenters(centersData);
    });

    return () => unsubscribe();
  }, []);

  // Fetch the manager data from Registrations collection
  useEffect(() => {
    const managersCollection = collection(db, "Registrations");
    const managerQuery = query(managersCollection, where("Role", "==", "Manager"));

    const unsubscribe = onSnapshot(managerQuery, (snapshot) => {
      const managersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setManagers(managersList);
    });

    return () => unsubscribe();
  }, []);

  // Fetch the admin data from Registrations collection
  useEffect(() => {
    const adminsCollection = collection(db, "Registrations");
    const adminQuery = query(adminsCollection, where("Role", "==", "Admin"));

    const unsubscribe = onSnapshot(adminQuery, (snapshot) => {
      const adminsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsList);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to get admin and manager details for a center branch
  const getAdminForCenter = (centerBranch) => {
    return admins.find((admin) => admin.Branch === centerBranch);
  };

  const getManagerForCenter = (centerAddress) => {
    return managers.find((manager) => manager.Address === centerAddress);
  };

  return (
    <div>
      <div className="px-4 py-4  mt-2">
        <Table hoverable className="overflow-y-auto shadow-lg rounded-xl shadow-gray-400 dark:shadow-none">
          <Table.Head>
            <Table.HeadCell>Center Name</Table.HeadCell>
            <Table.HeadCell>Center Address</Table.HeadCell>
            <Table.HeadCell>Center Branch</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Manager</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {centers.length > 0 ? (
              centers.map((center, id) => {
                const admin = getAdminForCenter(center.Center_Branch);
                const manager = getManagerForCenter(center.Center_Address);

                return (
                  <Table.Row key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {center.Center_Name || "N/A"}
                    </Table.Cell>
                    <Table.Cell>{center.Center_Address || "N/A"}</Table.Cell>
                    <Table.Cell>{center.Center_Branch || "N/A"}</Table.Cell>
                    <Table.Cell>{admin ? admin.Name : "N/A"}</Table.Cell>
                    <Table.Cell>{manager ? manager.Name : "N/A"}</Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center">
                  No Data available.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default DetailTable;
