// import React, { useState, useEffect } from "react";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import { db } from "../../../firebase/firebaseConfig";
// import { Table } from "flowbite-react";
// import EditButton from "./EditButton";
// import { useAlert } from "react-alert";

// const ApproveTable = () => {
//   const [issueBooks, setIssueBooks] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");

//   const alert = useAlert();

//   useEffect(() => {
//     const issuebookCollection = collection(db, "issueBook");
//     const unsubscribe = onSnapshot(issuebookCollection, (snapshot) => {
//       const booksData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log("Fetched Books:", booksData); // Log fetched data
//       setIssueBooks(booksData);
//     });

//     return () => unsubscribe();
//   }, []);

//   const calculateFine = (dueDate, returnDate) => {
//     const parseDate = (dateString) => {
//       if (!dateString || dateString === "N/A") return null;
//       const [day, month, year] = dateString.split("/");
//       return new Date(`${year}-${month}-${day}`);
//     };

//     const dueDateParsed = parseDate(dueDate);
//     const currentDate = new Date();

//     if (returnDate === "") {
//       const dueToCurrentDays = Math.round(
//         (currentDate - dueDateParsed) / (1000 * 60 * 60 * 24)
//       );
//       return dueToCurrentDays > 0 ? dueToCurrentDays * 15 : 0;
//     } else {
//       const returnDateParsed = parseDate(returnDate);
//       const overdueDays =
//         (returnDateParsed - dueDateParsed) / (1000 * 60 * 60 * 24);
//       return overdueDays > 0 ? overdueDays * 15 : 0;
//     }
//   };

//   const handleDelete = async (bookId) => {
//     const bookDocRef = doc(db, "issueBook", bookId);
//     await deleteDoc(bookDocRef);
//     alert.show("Deleted successfully!", {
//       type: "success",
//       timeout: 3000,
//     });
//   };

//   const filteredBooks = issueBooks
//     .filter((book) => {
//       if (filterStatus === "All") return true;
//       return book.status === filterStatus;
//     })
//     .filter((book) =>
//       book.studentName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div>
//   <div className="flex flex-wrap justify-between mb-4 mx-2">
//     <select
//       className="select select-bordered w-full sm:w-44 sm:ml-4 mt-4 sm:mr-2 border-gray-400 rounded-xl"
//       value={filterStatus}
//       onChange={(e) => setFilterStatus(e.target.value)}
//     >
//       <option value="All">All Status</option>
//       <option value="Approve">Approve</option>
//       <option value="Pending Approval">Pending Approval</option>
//     </select>

//     <label className="input pr-2 rounded-xl flex w-full p-1 sm:w-60 border-gray-400 items-center gap-2 mt-4">
//       <input
//         type="text"
//         className="grow focus:outline-none focus:ring-0 border-none"
//         placeholder="Search by Student Name"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 16 16"
//         fill="currentColor"
//         className="h-4 w-4 opacity-70"
//       >
//         <path
//           fillRule="evenodd"
//           d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//           clipRule="evenodd"
//         />
//       </svg>
//     </label>
//   </div>

//   <div className="overflow-x-auto hide-scrollbar px-2 sm:px-4">
//     <Table hoverable className="mb-8 w-full table-fixed">
//       <Table.Head>
//         <Table.HeadCell className="w-1/4">Student Name</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Student Email</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Book Name</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Issue Date</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Fine Amount</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Status</Table.HeadCell>
//         <Table.HeadCell className="w-1/4">Operations</Table.HeadCell>
//       </Table.Head>

//       <Table.Body className="divide-y divide-gray-200">
//         {filteredBooks.length > 0 ? (
//           filteredBooks.map((book) => {
//             const fineAmount = calculateFine(book.dueDate, book.returnDate);
//             return (
//               <Table.Row key={book.id} className="bg-white hover:bg-gray-100 dark:bg-gray-800">
//                 <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                   {book.studentName}
//                 </Table.Cell>
//                 <Table.Cell>{book.studentEmail}</Table.Cell>
//                 <Table.Cell>{book.bookTitle}</Table.Cell>
//                 <Table.Cell>{book.issueDate}</Table.Cell>
//                 <Table.Cell>{fineAmount}</Table.Cell>
//                 <Table.Cell>
//                   <button
//                     className={`w-full px-4 py-2 text-black font-normal text-center rounded-xl ${
//                       book.status === "Approve"
//                         ? "bg-green-200"
//                         : book.status === "Pending Approval"
//                         ? "bg-red-200"
//                         : book.status === "Returned"
//                         ? "bg-blue-200"
//                         : ""
//                     }`}
//                   >
//                     {book.status}
//                   </button>
//                 </Table.Cell>
//                 <Table.Cell className="flex gap-2">
//                   <p
//                     className="cursor-pointer font-bold text-red-500"
//                     onClick={() => handleDelete(book.id)}
//                   >
//                     Delete
//                   </p>
//                   <EditButton docId={book.id} />
//                 </Table.Cell>
//               </Table.Row>
//             );
//           })
//         ) : (
//           <Table.Row>
//             <Table.Cell colSpan="7" className="text-center py-4 text-gray-500">
//               No Data Available
//             </Table.Cell>
//           </Table.Row>
//         )}
//       </Table.Body>
//     </Table>
//   </div>
// </div>

//   );
// };

// export default ApproveTable;

// import React, { useState, useEffect } from "react";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import { db } from "../../../firebase/firebaseConfig";
// import { Table } from "flowbite-react";
// import { useAlert } from "react-alert";

// const statusStyles = {
//   Approve: "bg-green-200",
//   "Pending Approval": "bg-red-200",
//   Returned: "bg-blue-200",
// };

// const ApproveTable = () => {
//   const [issueBooks, setIssueBooks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [dueDate, setDueDate] = useState("");
//   const [status, setStatus] = useState('');

//   const alert = useAlert();

//   useEffect(() => {
//     const issuebookCollection = collection(db, "issueBook");
//     const unsubscribe = onSnapshot(issuebookCollection, (snapshot) => {
//       const booksData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log("Fetched Books:", booksData);
//       setIssueBooks(booksData);
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (selectedBook) {
//       console.log("Selected Book Due Date:", selectedBook.dueDate);
//     }
//   }, [selectedBook]);

//   const handleDelete = async (bookId) => {
//     const bookDocRef = doc(db, "issueBook", bookId);
//     await deleteDoc(bookDocRef);
//     alert.show("Deleted successfully!", {
//       type: "success",
//       timeout: 3000,
//     });
//   };

//   const filteredBooks = issueBooks
//     .filter((book) => {
//       if (filterStatus === "All") return true;
//       return book.status === filterStatus;
//     })
//     .filter((book) =>
//       book.studentName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const formatDateForInput = (dateString) => {
//     if (!dateString || dateString === "N/A") return "";
//     const [day, month, year] = dateString.split("/");
//     return `${year}-${month}-${day}`;
//   };

//   const openModal = (book) => {
//     setSelectedBook(book);
//     setDueDate(formatDateForInput(book.dueDate));
//     document.getElementById("my_modal_3").showModal();
//   };

//   const calculateFine = (dueDate, returnDate) => {
//         const parseDate = (dateString) => {
//           if (!dateString || dateString === "N/A") return null;
//           const [day, month, year] = dateString.split("/");
//           return new Date(`${year}-${month}-${day}`);
//         };

//         const dueDateParsed = parseDate(dueDate);
//         const currentDate = new Date();

//         if (returnDate === "") {
//           const dueToCurrentDays = Math.round(
//             (currentDate - dueDateParsed) / (1000 * 60 * 60 * 24)
//           );
//           return dueToCurrentDays > 0 ? dueToCurrentDays * 15 : 0;
//         } else {
//           const returnDateParsed = parseDate(returnDate);
//           const overdueDays =
//             (returnDateParsed - dueDateParsed) / (1000 * 60 * 60 * 24);
//           return overdueDays > 0 ? overdueDays * 15 : 0;
//         }
//       };

//       const handleUpdate = async () => {
//         if (!selectedBook) return;

//         const bookDocRef = doc(db, "issueBook", selectedBook.id); // Reference to the specific book document
//         await updateDoc(bookDocRef, { status:status,dueDate: dueDate }); // Update the status
//         alert.show("Status updated successfully!", {
//           type: "success",
//           timeout: 3000,
//         });
//         document.getElementById("my_modal_3").close(); // Close the modal after updating
//       };

//   return (
//     <div>
//       <div className="flex flex-wrap justify-between mb-4 mx-2">
//         <select
//           className="select select-bordered w-full sm:w-44 sm:ml-4 mt-4 sm:mr-2 border-gray-400 rounded-xl"
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//         >
//           <option value="All">All Status</option>
//           <option value="Approve">Approve</option>
//           <option value="Pending Approval">Pending Approval</option>
//         </select>

//         <label className="input pr-2 rounded-xl flex w-full p-1 sm:w-60 border-gray-400 items-center gap-2 mt-4">
//           <input
//             type="text"
//             className="grow focus:outline-none focus:ring-0 border-none"
//             placeholder="Search by Student Name"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 16 16"
//             fill="currentColor"
//             className="h-4 w-4 opacity-70"
//           >
//             <path
//               fillRule="evenodd"
//               d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </label>
//       </div>

//       <div className="overflow-x-auto px-2 sm:px-4">
//         <Table hoverable className="mb-8">
//           <Table.Head>
//             <Table.HeadCell>Student Name</Table.HeadCell>
//             <Table.HeadCell>Student Email</Table.HeadCell>
//             <Table.HeadCell>Book Name</Table.HeadCell>
//             <Table.HeadCell>Issue Date</Table.HeadCell>
//             <Table.HeadCell>Fine Amount</Table.HeadCell>
//             <Table.HeadCell>Status</Table.HeadCell>
//             <Table.HeadCell>Operations</Table.HeadCell>
//           </Table.Head>

//           <Table.Body className="divide-y divide-gray-200">
//             {filteredBooks.length > 0 ? (
//               filteredBooks.map((book) => {
//                 const fineAmount = calculateFine(book.dueDate, book.returnDate);
//                 return (
//                   <Table.Row
//                     key={book.id}
//                     onClick={() => openModal(book)}
//                     className="bg-white cursor-pointer hover:bg-gray-100 dark:bg-gray-800"
//                   >
//                     <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
//                       {book.studentName}
//                     </Table.Cell>
//                     <Table.Cell>{book.studentEmail}</Table.Cell>
//                     <Table.Cell>{book.bookTitle}</Table.Cell>
//                     <Table.Cell>{book.issueDate}</Table.Cell>
//                     <Table.Cell>{fineAmount}</Table.Cell>
//                     <Table.Cell>
//                       <button
//                         className={`w-full px-4 py-2 text-black font-normal text-center rounded-xl ${
//                           statusStyles[book.status]
//                         }`}
//                       >
//                         {book.status}
//                       </button>
//                     </Table.Cell>
//                     <Table.Cell className="flex gap-2">
//                       <p
//                         className="cursor-pointer font-bold text-red-500"
//                         onClick={(e) => {
//                           e.stopPropagation(); // Prevent modal from opening
//                           handleDelete(book.id);
//                         }}
//                       >
//                         Delete
//                       </p>
//                     </Table.Cell>
//                   </Table.Row>
//                 );
//               })
//             ) : (
//               <Table.Row>
//                 <Table.Cell colSpan="7" className="text-center">
//                   No books found
//                 </Table.Cell>
//               </Table.Row>
//             )}
//           </Table.Body>
//         </Table>
//       </div>

//       {/* Modal for Book Details */}
//       <dialog id="my_modal_3" className="modal">
//         <div className="modal-box w-full max-w-4xl">
//           <button
//             className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
//             onClick={() => document.getElementById("my_modal_3").close()}
//           >
//             ✕
//           </button>
//           <form className="grid grid-cols-2 gap-2" method="dialog">
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Student Name</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
//                 value={selectedBook?.studentName || ""}
//                 readOnly
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Student Email</label>
//               <input
//                 type="email"
//                 className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
//                 value={selectedBook?.studentEmail || ""}
//                 readOnly
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">
//                 Student Number
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
//                 value={selectedBook?.studentNumber || ""}
//                 readOnly
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">
//                 Student Branch
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
//                 readOnly
//                 value={selectedBook?.studentBranch || ""}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium">
//                 Student Address
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
//                 readOnly
//                 value={selectedBook?.studentNumber || ""}
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium">Book Name</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
//                 value={selectedBook?.bookTitle || ""}
//                 readOnly
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Issue Date</label>
//               <input
//                 type="text"
//                 className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
//                 value={selectedBook?.issueDate || ""}
//                 readOnly
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Due Date</label>
//               <input
//                 type="Date"
//                 className="input input-bordered w-full mt-2 "
//                 value={dueDate}
//                 onChange={(e) => setDueDate(e.target.value)}
//               />
//             </div>

//             <div className="mb-4 col-span-2">
//   <label className="block text-sm font-medium">Status</label>
//   <select
//     className="input input-bordered w-full mt-2 cursor-pointer"
//     // value={selectedBook?.status || ""}
//     value={status}
//     onChange={(e) => setStatus(e.target.value)} // Update status on change
//   >
//     <option value="" disabled>Select status</option> {/* Placeholder option */}
//     <option value="Approve">Approve</option>
//     <option value="Pending Approval">Pending Approval</option>

//   </select>
// </div>

//             <button
//                 className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
//                 onClick={handleUpdate} // Call handleUpdate on button click
//               >
//                 Update
//               </button>

//           </form>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default ApproveTable;
















import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore"; // Make sure to import updateDoc
import { db } from "../../../firebase/firebaseConfig";
import { Table } from "flowbite-react";
import { useAlert } from "react-alert";

const statusStyles = {
  Approve: "bg-green-200",
  "Pending Approval": "bg-red-200",
  Returned: "bg-blue-200",
};

const ApproveTable = () => {
  const [issueBooks, setIssueBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  const alert = useAlert();

  useEffect(() => {
    const issuebookCollection = collection(db, "issueBook");
    const unsubscribe = onSnapshot(issuebookCollection, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched Books:", booksData);
      setIssueBooks(booksData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      console.log("Selected Book Due Date:", selectedBook.dueDate);
      
    }
  }, [selectedBook]);

  const handleDelete = async (bookId) => {
    const bookDocRef = doc(db, "issueBook", bookId);
    await deleteDoc(bookDocRef);
    alert.show("Deleted successfully!", {
      type: "success",
      timeout: 3000,
    });
  };

  const filteredBooks = issueBooks
    .filter((book) => {
      if (filterStatus === "All") return true;
      return book.status === filterStatus;
    })
    .filter((book) =>
      book.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDateForInput = (dateString) => {
    if (!dateString || dateString === "N/A") return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`; // Format for input type date
  };

  const formatDateForFirebase = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`; // Format for storing in dd/mm/yyyy
  };

  const openModal = (book) => {
    setSelectedBook(book);
    setDueDate(formatDateForInput(book.dueDate));
    setStatus(book.status); // Set initial status
    document.getElementById("my_modal_3").showModal();
  };

  

  const calculateFine = (dueDate, returnDate) => {
    const parseDate = (dateString) => {
      if (!dateString || dateString === "N/A") return null;
      const [day, month, year] = dateString.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    const dueDateParsed = parseDate(dueDate);
    const currentDate = new Date();

    if (returnDate === "") {
      const dueToCurrentDays = Math.round(
        (currentDate - dueDateParsed) / (1000 * 60 * 60 * 24)
      );
      return dueToCurrentDays > 0 ? dueToCurrentDays * 15 : 0;
    } else {
      const returnDateParsed = parseDate(returnDate);
      const overdueDays =
        (returnDateParsed - dueDateParsed) / (1000 * 60 * 60 * 24);
      return overdueDays > 0 ? overdueDays * 15 : 0;
    }
  };



  const handleUpdate = async () => {
    if (!selectedBook) return;

    const bookDocRef = doc(db, "issueBook", selectedBook.id); // Reference to the specific book document
    const formattedDueDate = formatDateForFirebase(dueDate); // Format the due date before saving
    await updateDoc(bookDocRef, { status: status, dueDate: formattedDueDate }); // Update the status and due date
    alert.show("Status updated successfully!", {
      type: "success",
      timeout: 3000,
    });
    document.getElementById("my_modal_3").close(); // Close the modal after updating
  };




  return (
    <div>
      <div className="flex flex-wrap justify-between mb-4 mx-2">
        <select
          className="select select-bordered w-full sm:w-44 sm:ml-4 mt-4 sm:mr-2 border-gray-400 rounded-xl"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Approve">Approve</option>
          <option value="Pending Approval">Pending Approval</option>
        </select>

        <label className="input pr-2 rounded-xl flex w-full p-1 sm:w-60 border-gray-400 items-center gap-2 mt-4">
          <input
            type="text"
            className="grow focus:outline-none focus:ring-0 border-none"
            placeholder="Search by Student Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

      <div className="overflow-x-auto px-2 sm:px-4">
        <Table hoverable className="mb-8">
          <Table.Head>
            <Table.HeadCell className="table-cell">Student Name</Table.HeadCell>
            <Table.HeadCell className="table-cell">Student Email</Table.HeadCell>
            <Table.HeadCell className="table-cell">Book Name</Table.HeadCell>
            <Table.HeadCell className="table-cell">Issue Date</Table.HeadCell>
            <Table.HeadCell className="table-cell">Fine Amount</Table.HeadCell>
            <Table.HeadCell className="table-cell">Status</Table.HeadCell>
            <Table.HeadCell className="table-cell">Operations</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y divide-gray-200">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
               
                const fineAmount = calculateFine(book.dueDate, book.returnDate);
               
                return (
                  <Table.Row
                    key={book.id}
                    onClick={() => openModal(book)}
                    className="bg-white cursor-pointer hover:bg-gray-100 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {book.studentName}
                    </Table.Cell>
                    <Table.Cell>{book.studentEmail}</Table.Cell>
                    <Table.Cell>{book.bookTitle}</Table.Cell>
                    <Table.Cell>{book.issueDate}</Table.Cell>
                    <Table.Cell className=""
                      style={{ color: fineAmount > 0 ? "red" : "green" , }}
                    >
                      {fineAmount}
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        className={`w-full px-4 py-2 text-black font-normal text-center rounded-xl ${
                          statusStyles[book.status]
                        }`}
                      >
                        {book.status}
                      </button>
                    </Table.Cell>
                    <Table.Cell className="flex gap-2">
                      <p
                        className="cursor-pointer font-bold text-red-500"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent modal from opening
                          handleDelete(book.id);
                        }}
                      >
                        Delete
                      </p>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan="7" className="text-center">
                  No books found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      {/* Modal for Book Details */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-full max-w-4xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("my_modal_3").close()}
          >
            ✕
          </button>
          <form className="grid grid-cols-2 gap-2" method="dialog">
            <div className="mb-4">
              <label className="block text-sm font-medium">Student Name</label>
              <input
                type="text"
                className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
                value={selectedBook?.studentName || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Student Email</label>
              <input
                type="email"
                className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
                value={selectedBook?.studentEmail || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Student Number
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
                value={selectedBook?.studentNumber || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Student Branch
              </label>
              <input
                type="text"
                className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
                readOnly
                value={selectedBook?.studentBranch || ""}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Student Address
              </label>
              <input
                type="text"
                className="input input-bordered w-full cursor-not-allowed mt-2 bg-gray-100"
                readOnly
                value={selectedBook?.studentNumber || ""}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Book Name</label>
              <input
                type="text"
                className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
                value={selectedBook?.bookTitle || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Issue Date</label>
              <input
                type="text"
                className="input input-bordered w-full mt-2 cursor-not-allowed bg-gray-100"
                value={selectedBook?.issueDate || ""}
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Due Date</label>
              <input
                type="input"
                className="input input-bordered cursor-not-allowed bg-gray-100 w-full mt-2 "
                value={dueDate}
                readOnly
              />
            </div>

            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium">Status</label>
              <select
                className="input input-bordered w-full mt-2 cursor-pointer"
                // value={selectedBook?.status || ""}
                value={status}
                onChange={(e) => setStatus(e.target.value)} // Update status on change
              >
                <option value="" disabled>
                  Select status
                </option>{" "}
                {/* Placeholder option */}
                <option value="Approve">Approve</option>
                <option value="Pending Approval">Pending Approval</option>
              </select>
            </div>

            <button
              className="col-span-2 inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
              onClick={handleUpdate} // Call handleUpdate on button click
            >
              Update
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ApproveTable;
