// import React, { useState, useEffect } from "react";
// import { Table } from "flowbite-react";
// import EditButton from "./EditButton";
// import { db } from "../../../firebase/firebaseConfig";
// import { collection, deleteDoc, onSnapshot, doc } from "firebase/firestore";
// import { useAlert } from 'react-alert'; // Import alert hook
// import "react-toastify/dist/ReactToastify.css";


// const StudentTable = () => {
//   const [students, setStudents] = useState([]);
//   const [centerBranch, setCenterBranch] = useState([]);
//   const [branchAddresses, setBranchAddresses] = useState({});
//   const [city, setCity] = useState("All");
//   const [address, setAddress] = useState("");

//   const alert = useAlert(); // Use the alert hook

//   // Fetch centers data for filtering
//   useEffect(() => {
//     const centersCollection = collection(db, "Centers");
//     const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
//       const centersData = snapshot.docs.map((doc) => doc.data());
//       const centersNamesSet = new Set(
//         centersData.map((doc) => doc.Branch)
//       );
//       setCenterBranch(Array.from(centersNamesSet));

//       const addressesMap = {};
//       centersData.forEach((doc) => {
//         if (!addressesMap[doc.Center_Branch]) {
//           addressesMap[doc.Branch] = [];
//         }
//         addressesMap[doc.Branch].push(doc.Address);
//       });
//       setBranchAddresses(addressesMap);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch student data
//   useEffect(() => {
//     const studentCollection = collection(db, "Registrations");
//     const unsubscribe = onSnapshot(studentCollection, (snapshot) => {
//       const studentsList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setStudents(studentsList);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter students based on city and address
//   const filteredStudents = students.filter((student) => {
//     const cityMatch = city === "All" || student.Branch === city;
//     const addressMatch = !address || student.Address === address;
//     return cityMatch && addressMatch;
//   });

//   // Delete student
//   const handleDelete = async (id) => {
//     try {
//       const studentDoc = doc(db, "Registrations", id);
//       await deleteDoc(studentDoc);
//       alert.show('Deleted successfully!', {
//         type: 'success',
//         timeout: 3000,
//       }); // Use alert.show instead of toast
//     } catch (error) {
//       console.error("Error deleting student:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="mx-2">
//         <select
//           className="select select-bordered w-full mr-2 sm:w-40 mt-4 mb-4 border-gray-400 rounded-xl"
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
//           className="select select-bordered border-gray-400 mb-4 rounded-xl w-full sm:w-40"
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
//       </div>

//       <div className="overflow-x-scroll hide-scrollbar px-2 sm:px-4 pb-8">
//         <Table hoverable className="overflow-y-auto shadow-lg rounded-xl hide-scrollbar mt-2 shadow-gray-400 dark:shadow-none">
//           <Table.Head>
//             <Table.HeadCell>Student_Name</Table.HeadCell>
//             <Table.HeadCell>Student_Email</Table.HeadCell>
//             <Table.HeadCell>Student_Password</Table.HeadCell>
//             <Table.HeadCell>Student_Phone_Number</Table.HeadCell>
//             <Table.HeadCell>Center_Branch</Table.HeadCell>
//             <Table.HeadCell>Center_Address</Table.HeadCell>
//             <Table.HeadCell>Operations</Table.HeadCell>
//           </Table.Head>
//           <Table.Body className="divide-y">
//             {filteredStudents.length > 0 ? (
//               filteredStudents.map((student) => (
//                 <Table.Row key={student.id} className="bg-white dark:bg-gray-800">
//                   <Table.Cell>{student.Name}</Table.Cell>
//                   <Table.Cell>{student.Email}</Table.Cell>
//                   <Table.Cell>{student.Password}</Table.Cell>
//                   <Table.Cell>{student.Number}</Table.Cell>
//                   <Table.Cell>{student.Branch}</Table.Cell>
//                   <Table.Cell>{student.Address}</Table.Cell>
//                   <Table.Cell>
//                     <div className="flex gap-2">
//                       <button className="text-red-500 font-bold" onClick={() => handleDelete(student.id)}>
//                         Delete
//                       </button>
//                       <EditButton docId={student.id} />
//                     </div>
//                   </Table.Cell>
//                 </Table.Row>
//               ))
//             ) : (
//               <Table.Row>
//                 <Table.Cell colSpan={6} className="text-center">
//                   No Data available.
//                 </Table.Cell>
//               </Table.Row>
//             )}
//           </Table.Body>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default StudentTable;













import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import EditButton from "./EditButton";
import { db } from "../../../firebase/firebaseConfig";
import { collection, query, where, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { useAlert } from 'react-alert'; // Import alert hook
import "react-toastify/dist/ReactToastify.css";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [city, setCity] = useState("All");
  const [address, setAddress] = useState("");

  const alert = useAlert(); // Use the alert hook

  // Fetch centers data for filtering
  // Fetch centers data for filtering
useEffect(() => {
  const centersCollection = collection(db, "Centers");
  const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
    const centersData = snapshot.docs.map((doc) => doc.data());

    // Get unique center branches
    const centersNamesSet = new Set(
      centersData.map((doc) => doc.Center_Branch)
    );
    setCenterBranch(Array.from(centersNamesSet));

    // Map addresses to their respective branches
    const addressesMap = {};
    centersData.forEach((doc) => {
      if (!addressesMap[doc.Center_Branch]) {
        addressesMap[doc.Center_Branch] = [];
      }
      // Avoid duplicate addresses for a branch
      if (!addressesMap[doc.Center_Branch].includes(doc.Center_Address)) {
        addressesMap[doc.Center_Branch].push(doc.Center_Address);
      }
    });
    setBranchAddresses(addressesMap);
  });

  return () => unsubscribe();
}, []);


  // Fetch student data where role is student
  useEffect(() => {
    const studentCollection = collection(db, "Registrations");
    const studentQuery = query(studentCollection, where("Role", "==", "Student"));

    const unsubscribe = onSnapshot(studentQuery, (snapshot) => {
      const studentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsList);
    });

    return () => unsubscribe();
  }, []);

  console.log(students)

  // Filter students based on city and address
  const filteredStudents = students.filter((student) => {
    const cityMatch = city === "All" || student.Branch === city;
    const addressMatch = !address || student.Address === address;
    return cityMatch && addressMatch;
  });

  // Delete student
  const handleDelete = async (id) => {
    try {
      const studentDoc = doc(db, "Registrations", id);
      await deleteDoc(studentDoc);
      alert.show('Deleted successfully!', {
        type: 'success',
        timeout: 3000,
      }); // Use alert.show instead of toast
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div>
      <div className="mx-2">
        <select
          className="select select-bordered ml-2 w-full mr-2 sm:w-40 mt-4 mb-4 border-gray-400 rounded-xl"
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
          className="select select-bordered border-gray-400 mb-4 rounded-xl w-full sm:w-40"
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
      </div>

      <div className="overflow-x-scroll hide-scrollbar px-2 sm:px-4 pb-8 mt-2">
        <Table hoverable className="overflow-y-auto shadow-lg rounded-xl hide-scrollbar  shadow-gray-400 dark:shadow-none">
          <Table.Head>
            <Table.HeadCell className="table-cell">Student_Name</Table.HeadCell>
            <Table.HeadCell className="table-cell">Student_Email</Table.HeadCell>
            <Table.HeadCell className="table-cell">Student_Password</Table.HeadCell>
            <Table.HeadCell className="table-cell">Student_Phone_Number</Table.HeadCell>
            <Table.HeadCell className="table-cell">Center_Branch</Table.HeadCell>
            <Table.HeadCell className="table-cell">Center_Address</Table.HeadCell>
            <Table.HeadCell className="table-cell">Operations</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <Table.Row key={student.id} className="bg-white dark:bg-gray-800">
                  <Table.Cell>{student.Name}</Table.Cell>
                  <Table.Cell>{student.Email}</Table.Cell>
                  <Table.Cell>{student.Password}</Table.Cell>
                  <Table.Cell>{student.Number}</Table.Cell>
                  <Table.Cell>{student.Branch}</Table.Cell>
                  <Table.Cell>{student.Address}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <button className="text-red-500 font-bold" onClick={() => handleDelete(student.id)}>
                        Delete
                      </button>
                      <EditButton docId={student.id} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} className="text-center">
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

export default StudentTable;
