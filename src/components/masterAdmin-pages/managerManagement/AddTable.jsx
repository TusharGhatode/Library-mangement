import React, { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import EditButton from './EditButton';
import { db } from '../../../firebase/firebaseConfig';
import { collection, query, where, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { useAlert } from 'react-alert';
import 'react-toastify/dist/ReactToastify.css';

const AddTable = () => {
  const [manager, setManager] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [city, setCity] = useState('All');
  const alert = useAlert();

  // Fetch managers with the role 'Manager'
  useEffect(() => {
    const centersCollection = collection(db, 'Registrations');
    const roleQuery = query(centersCollection, where('Role', '==', 'Manager'));

    const unsubscribe = onSnapshot(
      roleQuery,
      (snapshot) => {
        const managerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setManager(managerList);
      },
      (error) => {
        console.error('Error fetching data based on role:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch the center branches
  useEffect(() => {
    const centersCollection = collection(db, 'Centers');
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(centersData.map((doc) => doc.Center_Branch));
      setCenterBranch(Array.from(centersNamesSet));
    });

    return () => unsubscribe();
  }, []);

  // Handle deleting a manager
  const handleDelete = async (id) => {
    try {
      const centerDoc = doc(db, 'Registrations', id);
      await deleteDoc(centerDoc);

      // Update the state immediately to reflect the deleted data
      setManager((prevManagers) => prevManagers.filter((manager) => manager.id !== id));

      alert.show('Deleted successfully!', {
        type: 'success',
        timeout: 3000,
      });
    } catch (error) {
      console.error('Error deleting center:', error);
      alert.show('No Such Document.', {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  // Filter managers based on the selected branch
  const filteredManagers = city === 'All' ? manager : manager.filter((m) => m.Branch === city);

  return (
    <div>
      <div className='overflow-x-auto'>
        <select
          className='select select-bordered w-40 ml-4 mt-4 mr-2 mb-4 border-gray-400 rounded-xl'
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
          }}
        >
          <option value='All'>All Branch</option>
          {centerBranch.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <div className="overflow-y-scroll hide-scrollbar pb-8 px-4">
          <Table hoverable className="overflow-y-auto shadow-lg rounded-xl shadow-gray-400 dark:shadow-none">
            <Table.Head>
              <Table.HeadCell>Manager_Name</Table.HeadCell>
              <Table.HeadCell>Manager_Email</Table.HeadCell>
              <Table.HeadCell>Manager_Password</Table.HeadCell>
              <Table.HeadCell>Manager_mobile</Table.HeadCell>
              <Table.HeadCell>Center_Branch</Table.HeadCell>
              <Table.HeadCell>Center_Address</Table.HeadCell>
              <Table.HeadCell>Operations</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {filteredManagers.length > 0 ? (
                filteredManagers.map((elem, id) => (
                  <Table.Row key={id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                      {elem.Name}
                    </Table.Cell>
                    <Table.Cell>{elem.Email}</Table.Cell>
                    <Table.Cell>{elem.Password}</Table.Cell>
                    <Table.Cell>{elem.Mobile}</Table.Cell>
                    <Table.Cell>{elem.Branch}</Table.Cell>
                    <Table.Cell>{elem.Address}</Table.Cell>
                    <Table.Cell>
                      <div className='flex flex-wrap gap-2'>
                        <button
                          className='text-red-500 font-bold cursor-pointer'
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
                  <Table.Cell colSpan={7} className='text-center'>
                    No Data available.
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

export default AddTable;
