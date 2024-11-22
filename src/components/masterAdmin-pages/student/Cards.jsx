import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import Loader from "../../../Loader";
import { useAlert } from "react-alert";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const BookCard = ({ book, onClick, buttonText }) => (
  <div className="card card-compact h-80 bg-base-100 w-full mx-0 mr-2 mb-2 px-0 sm:w-full shadow-xl md:w-[16rem] lg:w-[22rem] xl:w-[20rem]">
    <figure>
      <img
        src={book.Book_Image || "https://via.placeholder.com/150"}
        className="h-40 w-full object-cover"
        alt="Book"
      />
    </figure>
    <div className="card-body">
      <h2 className="card-title sm:text-md font-bold flex flex-wrap justify-center w-full">
        {book.Book_Title}
      </h2>
      <p className="mb-2 -mx-3 text-center ">
        {book.Description.slice(0, 50) + "..."}
      </p>

      
      <button
        className="inline-block w-full px-6 py-3 sm:py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-orange-700 active:opacity-85"
        onClick={() => onClick(book)}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const Cards = () => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [value, setValue] = useState(0);
  const alert = useAlert();
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [student, setStudent] = useState({});

  useEffect(() => {
    if (books.length && userAddress) {
      const filtered = books.filter((book) => {
        const isMatchingAddress =
          book.Branch_Address?.toLowerCase() === userAddress.toLowerCase();
        return isMatchingAddress; // Include both conditions
      });
      setFilteredBooks(filtered);
    }
  }, [books, userAddress, issuedBooks]); // Dependency array includes issuedBooks

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const booksQuery = collection(db, "Books");
        const booksSnapshot = await getDocs(booksQuery);
        setBooks(
          booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching books data: ", error);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooksData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(
          collection(db, "Registrations"),
          where("Role", "==", role),
          where("Email", "==", email)
        );
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();

          setStudent(userData);
          setUserAddress(userData.Address);
        } else {
          console.warn(
            "No user data found for the role and email:",
            role,
            email
          );
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    if (role && email) {
      fetchUserData();
    }
  }, [role, email]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "issueBook"), where("studentEmail", "==", email)),
      (snapshot) => {
        setIssuedBooks(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        console.error("Error fetching issued books: ", error);
      }
    );

    return () => unsubscribe();
  }, [email]);

  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const currentDate = new Date();
  const issueDate = formatDateToDDMMYYYY(currentDate);
  const dueDate = formatDateToDDMMYYYY(
    new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000)
  ); // 14 days later

  
  const handleClick = async (book) => {
    if (!student.Name || !student.Email) {
      alert.show("Student details are not loaded properly.", { type: "error" });
      return;
    }

    const issueBookData = {
      bookId: book.id,
      bookTitle: book.Book_Title,
      studentName: student.Name,
      studentEmail: student.Email,
      studentNumber: student.Number,
      studentBranch: student.Branch,
      studentAddress: student.Address,
      fineAmount: 0,
      issueDate: issueDate,
      dueDate: dueDate,
      returnDate: "",
      status: "Pending Approval",
    };

    try {
      await addDoc(collection(db, "issueBook"), issueBookData);
      alert.show("Request Sent", { type: "success", timeout: 3000 });
    } catch (error) {
      console.error("Error issuing book:", error);
      alert.show("There was an error issuing the book. Please try again", {
        type: "error",
        timeout: 3000,
      });
    }
  };

  const getButtonText = (book) => {
    const issuedBook = issuedBooks.find(
      (issued) =>
        issued.bookTitle?.toLowerCase() === book.Book_Title?.toLowerCase() &&
        issued.studentEmail?.toLowerCase() === email?.toLowerCase()
    );

    if (issuedBook) {
      switch (issuedBook.status) {
        case "Pending Approval":
          return "Pending Approval";
        case "Approve":
          return "Book Allocated"; // This book will be hidden in Tab 1
        case "Returned":
          return "Issue";
        default:
          return "Issue Book";
      }
    }
    return "Issue Book";
  };

  const loadingContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh", // Ensure it takes the full height of the tab
  };

  const getOriginalBookData = (bookId) => {
    return books.find((book) => book.id === bookId);
  };




  const [approvedBooks, setApprovedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [totalFine, setTotalFine] = useState(0);
  const [returnDate, setReturnDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const todayDate = new Date();
  const formattedDate = `${String(todayDate.getDate()).padStart(2, "0")}/${String(todayDate.getMonth() + 1).padStart(2, "0")}/${todayDate.getFullYear()}`;


  const fetchBookImage = async (bookTitle) => {
    try {
      const booksCollection = collection(db, "Books");
      const q = query(booksCollection, where("Book_Title", "==", bookTitle));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const bookDoc = querySnapshot.docs[0]; // Get the first matching document
        return bookDoc.data().Book_Image || "https://via.placeholder.com/150"; // Return book image or placeholder
      } else {
        return "https://via.placeholder.com/150"; // Fallback placeholder image
      }
    } catch (error) {
      console.error("Error fetching book image:", error);
      return "https://via.placeholder.com/150"; // Return placeholder in case of error
    }
  };

  useEffect(() => {
    const fetchApprovedBooks = async () => {
      setIsLoading(true);
      try {
        const q = query(
          collection(db, "issueBook"),
          where("status", "==", "Approve"),
          where("studentEmail", "==", email)
        );

        const querySnapshot = await getDocs(q);
        const books = [];
        for (const doc of querySnapshot.docs) {
          const bookData = doc.data();
          const bookImage = await fetchBookImage(bookData.bookTitle);
          books.push({ id: doc.id, ...bookData, Book_Image: bookImage });
        }

       

        setApprovedBooks(books);
      } catch (error) {
        alert.show(`Error fetching data: ${error.message}`, { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    if (email) {
      fetchApprovedBooks();
    } else {
      alert.show("No email found in local storage.", { type: "warning" });
      setIsLoading(false);
    }
  }, [email, alert]);

  useEffect(() => {
    setReturnDate(formattedDate);
  }, [formattedDate]);

  const calculateFine = (returnDateStr, dueDateStr) => {
    if (!dueDateStr) {
      console.error("Due date is not defined.");
      return 0;
    }

    const returnDateObj = new Date(returnDateStr.split("/").reverse().join("-"));
    const dueDateObj = new Date(dueDateStr.split("/").reverse().join("-"));

    if (returnDateObj > dueDateObj) {
      const differenceInTime = returnDateObj - dueDateObj;
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      return differenceInDays * 15; // Calculate fine as ₹15 per day
    }
    return 0;
  };

  const handleReturnClick = (book) => {
    setSelectedBook(book);
    const fine = calculateFine(formattedDate, book.dueDate);
    setTotalFine(fine);
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    if (selectedBook) {
      try {
        await updateDoc(doc(db, "issueBook", selectedBook.id), {
          fineAmount: totalFine,
          status: "Returned",
          returnDate: returnDate,
        });

        await deleteDoc(doc(db, "issueBook", selectedBook.id));

        alert.show("Book returned and record deleted successfully!", {
          type: "success",
          timeout: 3000,
        });

        setApprovedBooks((prev) => prev.filter((book) => book.id !== selectedBook.id));
        closeModal();
      } catch (error) {
        alert.show(`Error during payment: ${error.message}`, { type: "error" });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
    setTotalFine(0);
  };



  return (
    <div className="hide-scrollbar  ">
      <Box className="mt-8">
        <Tabs
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          centered
        >
          <Tab label="Books" />
          <Tab label="Issued Books" />
          <Tab label="Return Books" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
  {loadingBooks ? (
    <div style={loadingContainerStyle}>
      <Loader />
    </div>
  ) : (
   <div className="">
     {/* <div className="grid xl:grid-cols-3 lg:grid-cols-2 h-[100vh] bg-red-500  md:grid-cols-2 sm:grid-cols-1"> */}

     <div className="flex flex-wrap justify-center h-[100vh]">
      {filteredBooks.length > 0 ? (
        <>
          {filteredBooks.map((book) => {
            
            const buttonText = getButtonText(book);
            return buttonText !== "Book Allocated" ? ( // Hide "Book Allocated" books
              <BookCard
                key={book.id}
                book={book}
                onClick={handleClick}
                buttonText={buttonText}
                
              />
            ) : null;
          })}

          {/* Check if all filtered books are issued */}
          {filteredBooks.every((book) => getButtonText(book) === "Book Allocated") && (
            <p className="text-center  flex flex-wrap justify-center w-[90vw] sm:w-[80vw]  mt-8">All books are issued by you.</p>
          )}
        </>
      ) : (
        <p>No available books for your address.</p>
      )}
    </div>
   </div>
  )}
</TabPanel>


<TabPanel value={value} index={1}>
  {loadingBooks ? (
    <div style={loadingContainerStyle}>
      <Loader />
    </div>
  ) : (
    <div className="flex flex-wrap justify-center">
      {issuedBooks.length > 0 ? (
        issuedBooks.map((issuedBook) => {
          // Get original book data
          const originalBook = getOriginalBookData(issuedBook.bookId);
          const buttonText = "Pending Approval"; // Change this to set your button text accordingly

          return (
            <BookCard
              key={issuedBook.id}
              book={{
                Book_Title: originalBook?.Book_Title || "Unknown Title",
                Book_Image: originalBook?.Book_Image || "https://via.placeholder.com/150",
                Description: originalBook?.Description || "No description available",
              }}
              buttonText={buttonText} // Button text can be "Pending Approval"
              
            />
          );
        })
      ) : (
        <p>No issued books.</p>
      )}
    </div>
  )}
</TabPanel>



      {/* onClick={() => handleReturnClick(book)} */}


      <TabPanel value={value} index={2}>
      {loadingBooks ? (
          <div style={loadingContainerStyle}>
            <Loader />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {approvedBooks.length > 0 ? (
              approvedBooks.map((issuedBook) => {
                // Get original book data
                const originalBook = getOriginalBookData(issuedBook.bookId);
                return (
                  <BookCard
                    key={issuedBook.id}
                    book={{
                      Book_Title: originalBook?.Book_Title || "Unknown Title",
                      Book_Image: originalBook?.Book_Image || "https://via.placeholder.com/150",
                      Description: originalBook?.Description || "No description available",
                    }}
                    onClick={() => handleReturnClick(issuedBook)}
                    buttonText="Return" // All books shown in this tab will have "Book Allocated"
                  />
                )
              })
            ) : (
              <p>No issued books.</p>
            )}
          </div>
        )}

      {isModalOpen && selectedBook && (
        <dialog open className="modal ">
          <div className="modal-box">
            <form method="dialog" onSubmit={(e) => e.preventDefault()}>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>
                ✕
              </button>
            </form>

            <div>
              <p className="text-gray-800 font-bold text-sm mt-4">Issue Date</p>
              <button type="text" className="input input-bordered mt-2 cursor-text w-full py-2 text-center">
                {selectedBook.issueDate}
              </button>
            </div>

            <div>
              <p className="text-gray-800 font-bold text-sm mt-4">Due Date</p>
              <button type="text" className="input input-bordered mt-2 cursor-text w-full py-2 text-center">
                {selectedBook.dueDate}
              </button>
            </div>

            <div>
              <p className="text-gray-800 font-bold text-sm mt-4">Return Date</p>
              <button type="text" className="input input-bordered mt-2 cursor-text w-full py-2 text-center">
                {returnDate}
              </button>
            </div>

            <div>
              <p className="text-gray-800 font-bold text-sm mt-4">Total Fine</p>
              <button type="text" className="input input-bordered mt-2 cursor-text w-full py-2 text-center">
                ₹ {totalFine}
              </button>
            </div>

            <div className="modal-action">
              <button
                className="inline-block w-full px-6 py-4 sm:py-4 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                onClick={handlePayment}
              >
                Payment
              </button>
            </div>
          </div>
        </dialog>
      )}
      </TabPanel>
    </div>
  );
};

export default Cards;










