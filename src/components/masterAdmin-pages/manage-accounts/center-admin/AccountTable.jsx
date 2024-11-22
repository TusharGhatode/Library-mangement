import React, { useState, useEffect } from "react";
import { db } from "../../../../firebase/firebaseConfig"; // Import your Firebase config
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Table } from "flowbite-react";
import EditButton from './EditButton';
import { useAlert } from 'react-alert';

const AccountTable = () => {
  const [admin, setAdmin] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [city, setCity] = useState("All");
  const alert = useAlert();

  const role = "Admin"

  // Fetch unique center branches from Firestore
  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(
        centersData.map((doc) => doc.Center_Branch) // Adjust to your actual property name
      );
      setCenterBranch(Array.from(centersNamesSet));
    });

    return () => unsubscribe();
  }, []);

  // Fetch admin accounts from Firestore based on role
  useEffect(() => {
    if (role) {
      const centersCollection = collection(db, "Registrations");
      const roleQuery = query(centersCollection, where("Role", "==", role)); // Query where role matches

      const unsubscribe = onSnapshot(
        roleQuery,
        (snapshot) => {
          const centersList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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
      const centerDoc = doc(db, "Registrations", id); // Reference to the center document
      await deleteDoc(centerDoc); // Delete the document
      alert.show('Deleted successfully!', { type: 'success', timeout: 3000 });
    } catch (error) {
      console.error("Error deleting center:", error);
      alert.show('Failed to delete center account.', { type: 'error', timeout: 3000 });
    }
  };

  // Filter admin accounts based on selected branch
  const filteredAdmin = admin.filter((elem) => {
    return city === "All" || elem.Branch === city;
  });

  return (
    <div>
      <div className="overflow-x-auto ">
        <select
          className="select select-bordered w-40 ml-4 mt-4 mr-2 mb-4 border-gray-400 rounded-xl"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="All">All Branch</option>
          {centerBranch.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <div className="overflow-y-scroll hide-scrollbar pb-8 px-4">
          <Table className="min-w-full shadow-lg rounded-xl shadow-gray-400 dark:shadow-none">
            <Table.Head>
              <Table.HeadCell>Admin_Name</Table.HeadCell>
              <Table.HeadCell>Admin_Email</Table.HeadCell>
              <Table.HeadCell>Admin_Password</Table.HeadCell>
              <Table.HeadCell>Admin_Number</Table.HeadCell>
              <Table.HeadCell>Center_Branch</Table.HeadCell>
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
                    <Table.Cell>{elem.Branch}</Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="text-red-500 font-bold cursor-pointer"
                          onClick={() => handleDelete(elem.id)}
                        >
                          Delete
                        </button>
                        <EditButton docId={elem.id} />
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

export default AccountTable;
