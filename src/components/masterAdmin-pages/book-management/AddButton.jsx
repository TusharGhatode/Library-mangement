import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig"; // Ensure this is your correct import path
import { useAlert } from 'react-alert';

const AddButton = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookCenter, setBookCenter] = useState("");
  const [desc, setDesc] = useState("");

  const [branchAddress, setBranchAddress] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [fileName, setFileName] = useState("Select");
  const [file, setFile] = useState(null);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState([]);
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const alert = useAlert();

  useEffect(() => {
    const centersCollection = collection(db, "Centers");
    const unsubscribe = onSnapshot(centersCollection, (snapshot) => {
      const centersData = snapshot.docs.map((doc) => doc.data());
      const centersNamesSet = new Set(centersData.map((doc) => doc.Center_Branch));
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

  useEffect(() => {
    const booksCollection = collection(db, "Books");
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBooks(booksData.reverse());
    });

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setFileName(selectedFile.name);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImageURL(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        alert.show("Please select a valid image file.", {
          type: 'error',
          timeout: 3000,
        });
        e.target.value = ""; // Reset the input if it's not a valid image
      }
    } else {
      setFileName("Select");
      setFile(null);
    }
  };

  const handleBranchChange = (e) => {
    setBookCenter(e.target.value);
    setBranchAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookTitle || !bookAuthor || !bookCenter || !branchAddress || !file) {
      alert.show("Please fill in all fields", {
        type: 'error',
        timeout: 3000,
      });
      return; // Stop the submission if any field is empty
    }

    try {
      const booksQuery = query(collection(db, "Books"), where("Book_Title", "==", bookTitle));
      const querySnapshot = await getDocs(booksQuery);

      if (!querySnapshot.empty) {
        alert.show("A book with the same title already exists.", {
          type: 'error',
          timeout: 3000,
        });
        return;
      }

      await addDoc(collection(db, "Books"), {
        Book_Image: imageURL,
        Book_Title: bookTitle,
        Book_Author: bookAuthor,
        Branch_Center: bookCenter,
        Branch_Address: branchAddress,
        Description: desc,

      });

      setIsModalOpen(false);
      setFileName("Select");
      setBookTitle("");
      setBookAuthor("");
      setBranchAddress("");
      setBookCenter("");
      setImageURL(null);

      alert.show("Added successfully!", {
        type: 'success',
        timeout: 3000,
      });
    } catch (error) {
      alert.show('Failed to add book. Please try again.', {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  const openModal = () => {
    // Reset form fields when opening the modal
    setBookTitle("");
    setBookAuthor("");
    setBookCenter("");
    setBranchAddress("");
    setImageURL(null);
    setIsModalOpen(true);
  };

  return (
    <div className="">
    <div className="second bg-gray-200 dark:bg-[#001F3F] gap-1 h-[10vh] flex flex-wrap items-center justify-between sm:px-5 sm:h-[8vh]">
      <div className="left flex flex-wrap justify-end w-full">
        <button
          className="inline-block w-28 px-6 py-3 sm:py-3 mr-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
          onClick={openModal}
        >
          Add
        </button>
  
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="modal-box w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg"> {/* Adjusted width */}
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
  
              <form onSubmit={handleSubmit}>
                <div className="pt-8 rounded-lg">
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Book Title
                      </label>
                      <input
                        type="text"
                        className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4"
                        placeholder="Enter Book Title"
                        value={bookTitle}
                        required
                        onChange={(e) => setBookTitle(e.target.value)}
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Book Author
                      </label>
                      <input
                        type="text"
                        className="block w-full text-sm border-gray-400 rounded-xl h-[50px] px-4"
                        placeholder="Enter Book Author"
                        value={bookAuthor}
                        required
                        onChange={(e) => setBookAuthor(e.target.value)}
                      />
                    </div>
  
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Branch
                      </label>
                      <select
                        className="select select-bordered border-gray-400 rounded-xl w-full"
                        value={bookCenter}
                        required
                        onChange={handleBranchChange}
                      >
                        <option value="" disabled>
                          Select Branch
                        </option>
                        {centerBranch.map((elem, index) => (
                          <option key={index} value={elem}>
                            {elem}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Branch Address
                      </label>
                      <select
                        className="select select-bordered border-gray-400 rounded-xl w-full"
                        value={branchAddress}
                        required
                        onChange={(e) => setBranchAddress(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Branch Address
                        </option>
                        {bookCenter &&
                          branchAddresses[bookCenter]?.map((address, index) => (
                            <option key={index} value={address}>
                              {address}
                            </option>
                          ))}
                      </select>
                    </div>


                    <div className="col-span-2">
  <label className="block text-sm font-semibold text-gray-700 mb-1 ">
    Book Description
  </label>
  <textarea
    className="block w-full text-sm border-gray-400 rounded-xl h-[100px] px-4 py-2 resize-none"
    placeholder="Enter Book Description"
    value={desc}
    required
    onChange={(e) => setDesc(e.target.value)}
  />
</div>

  
                    <div className="flex items-center p-6 cursor-pointer justify-center w-full col-span-2 border-2 border-dashed rounded-xl border-gray-400">
                      <label>
                        <span className="mt-2 text-xs px-20 sm:px-32 py-4 cursor-pointer">
                          {fileName || "Upload Cover Image"}
                        </span>
                        <input
                          type="file"
                          className="hidden cursor-pointer"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                    </div>
                  </div>
  
                  <button
                    type="submit"
                    className="inline-block w-full bg-gradient-to-tl from-orange-700 to-orange-400 hover:bg-pink-700 transition-all rounded-lg text-white px-6 py-3 font-bold cursor-pointer"
                  >
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default AddButton;
