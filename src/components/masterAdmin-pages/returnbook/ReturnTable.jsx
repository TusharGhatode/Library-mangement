import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from "react-alert";
import Loader from "../../../Loader";

const ReturnTable = () => {
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [totalFine, setTotalFine] = useState(0);
  const [returnDate, setReturnDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const alert = useAlert();

  const todayDate = new Date();
  const formattedDate = `${String(todayDate.getDate()).padStart(2, "0")}/${String(todayDate.getMonth() + 1).padStart(2, "0")}/${todayDate.getFullYear()}`;

  const email = localStorage.getItem("email");

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

        if (books.length === 0) {
          alert.show("No approved books found for your email.", { type: "info" });
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
    <div className="py-6 px-2 flex flex-wrap gap-2 items-center justify-center h-[81vh]">
      {isLoading ? (
        <Loader />
      ) : approvedBooks.length > 0 ? (
        approvedBooks.map((book) => (
          <div key={book.id} className="card bg-base-100 shadow-xl sm:w-80 m-0 w-full h-72">
            <figure>
              <img
                src={book.Book_Image}
                className="rounded-xl w-full object-cover"
                alt="Book Cover"
              />
            </figure>
            <div className="px-2 py-4">
              <h2 className="text-md font-semibold text-center">{book.bookTitle}</h2>
              <button
                className="inline-block w-full px-6 py-3 mt-4 text-xs sm:py-3 font-bold text-center text-white uppercase bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro rounded-lg hover:bg-orange-700"
                onClick={() => handleReturnClick(book)}
              >
                Return
              </button>
            </div>
          </div>
        ))
      ) : (
        
        <div className="flex flex-col justify-center items-center w-full text-gray-500">
        <h3 className="text-lg font-semibold">No Approved Books Found</h3>
      </div>
      )}

      {isModalOpen && selectedBook && (
        <dialog open className="modal bg-opacity-30 bg-white">
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
    </div>
  );
};

export default ReturnTable;
