import React, { useState, useEffect } from "react";
import { db } from "../../../firebase/firebaseConfig";
import { collection, deleteDoc, onSnapshot, doc } from "firebase/firestore";
import { Table } from "flowbite-react";
import EditButton from "./EditButton";
import { useAlert } from 'react-alert';

const AddBook = () => {
  const [books, setBooks] = useState([]);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});

  // Select inputs for filtering table data
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const alert = useAlert();
  // Fetch books data
  useEffect(() => {
    const centersCollection = collection(db, "Books");

    const unsubscribe = onSnapshot(
      centersCollection,
      (snapshot) => {
        const centersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(centersList);
      },
      (error) => {
        console.error("Error fetching centers data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Delete a book
  const handleDelete = async (id) => {
    try {
      const centerDoc = doc(db, "Books", id);
      await deleteDoc(centerDoc);
      alert.show('Deleted successfully!', {
        type: 'success',  // Set the type of alert
        timeout: 3000,    // Dismiss after 3 seconds   
      });
    } catch (error) {
      console.error("Error deleting center:", error);
      alert.show('No Such Document.', {
        type: 'error',    // Set the type of alert
        timeout: 3000,    // Dismiss after 3 seconds   
      });
    }
  };

  // Fetch center branches and their addresses
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

  // Filter books based on selected city and address
  const filteredBooks = books.filter((book) => {
    const cityMatch = city === "All" || !city || book.Branch_Center === city;
    const addressMatch = !address || book.Branch_Address === address;
    return cityMatch && addressMatch;
  });

  return (
    <div>
    <div className="flex flex-col  ">
      <div className="flex">
        <select
          className="select select-bordered border-gray-400 rounded-xl w-40 mr-2 my-4 mx-4"
          value={city}
          required
          onChange={(e) => {
            setCity(e.target.value);
            setAddress(""); // Reset address when city changes
          }}
        >
          <option value="All">All Branch</option>
          {centerBranch.map((elem, index) => (
            <option key={index} value={elem}>
              {elem}
            </option>
          ))}
        </select>
  
        <select
          className="select select-bordered w-40 mr-2 mb-2 mt-4  border-gray-400 rounded-xl"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          disabled={!city || city === "All"} // Disable address select if no city is chosen or 'All' is selected
        >
          <option value="" disabled className="dark:text-black">
            Branch Address
          </option>
          {branchAddresses[city]?.map((elem, index) => (
            <option key={index} value={elem}>
              {elem}
            </option>
          ))}
        </select>
      </div>
  
      <div className="px-4 h-[80vh] overflow-y-scroll"> {/* Added overflow and max-height */}
        <Table hoverable className="overflow-y-auto rounded-xl shadow-lg  shadow-gray-300 ">
          <Table.Head>
            <Table.HeadCell className="table-cell">Book_Image</Table.HeadCell>
            <Table.HeadCell className="table-cell">Book_Title</Table.HeadCell>
            <Table.HeadCell className="table-cell">Book_Author</Table.HeadCell>
            <Table.HeadCell className="table-cell">Branch_Center</Table.HeadCell>
            <Table.HeadCell className="table-cell">Branch_Address</Table.HeadCell>
            <Table.HeadCell className="table-cell">Description</Table.HeadCell>
            <Table.HeadCell className="table-cell">Operations</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((elem) => (
                <Table.Row key={elem.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white sm:text-center">
                    <img
                      src={elem.Book_Image}
                      className="sm:h-12 h-12 w-16 rounded-xl object-cover sm:object-cover sm:w-20 sm:rounded-xl sm:text-center"
                      alt="Book cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{elem.Book_Title}</Table.Cell>
                  <Table.Cell>{elem.Book_Author}</Table.Cell>
                  <Table.Cell>{elem.Branch_Center}</Table.Cell>
                  <Table.Cell>{elem.Branch_Address}</Table.Cell>
                  <Table.Cell>{elem.Description.substring(0, 20)+'...'}</Table.Cell>
  
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
                <Table.Cell colSpan={7} className="text-center">
                  No books available.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
    {/* Removed ToastContainer since you're using alert.show */}
  </div>
  
  );
};

export default AddBook;
