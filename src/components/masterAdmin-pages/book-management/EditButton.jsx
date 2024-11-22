import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useAlert } from 'react-alert'; // Import react-alert
import { Button, Modal } from "flowbite-react";

const EditButton = ({ docId }) => {
  const alert = useAlert(); // Initialize alert
  const [openModal, setOpenModal] = useState(false);
  const [centerBranch, setCenterBranch] = useState([]);
  const [branchAddresses, setBranchAddresses] = useState({});
  const [imageURL, setImageURL] = useState(null);
  const [fileName, setFileName] = useState("Select a file");
  const [bookTitle, setBookTitle] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookCenter, setBookCenter] = useState("");
  
  const [desc, setDesc] = useState("");

 
console.log(desc)
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

  useEffect(() => {
    // Reset branchAddress when bookCenter changes
    setBranchAddress("");
  }, [bookCenter]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validImageTypes.includes(selectedFile.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageURL(reader.result);
        };
        reader.readAsDataURL(selectedFile);
        setFileName(selectedFile.name); // Set the file name here
      } else {
        alert.show("Please select a valid image file (jpg, png, gif)", {
          type: 'error',
          timeout: 3000,
        });
        e.target.value = "";
      }
    } else {
      setFileName("Select a file");
      setImageURL(null);
    }
  };

  const handleOpenModal = async () => {
    setOpenModal(true);
    const docRef = doc(db, "Books", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data)
      setBookTitle(data.Book_Title || "");
      setBookAuthor(data.Book_Author || "");
      setBookCenter(data.Branch_Center || "");
      setBranchAddress(data.Branch_Address || "");
      setImageURL(data.Book_Image || "");
      setFileName(data.Book_Image ? data.Book_Image.split("/").pop() : "Select a file");
      setDesc(data.Description)
    } else {
      alert.show("No Such Document", {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  const handleUpdate = async () => {
    // Check if required fields are empty
    if (!bookTitle || !bookAuthor || !bookCenter || !branchAddress ) {
      alert.show("All fields must be filled out.", {
        type: 'error',
        timeout: 3000,
      });
      return; // Prevent further execution
    }

    const docRef = doc(db, "Books", docId);
    await updateDoc(docRef, {
      Book_Image: imageURL,
      Book_Title: bookTitle,
      Book_Author: bookAuthor,
      Branch_Center: bookCenter,
      Branch_Address: branchAddress,
      Description:desc
    });
    setOpenModal(false);
    alert.show("Update successfully!", {
      type: 'success',
      timeout: 3000,
    });
  };

  return (
    <div>
    <p
      className="text-green-500 cursor-pointer font-bold"
      onClick={handleOpenModal}
    >
      Edit
    </p>
    <Modal dismissible show={openModal} size='3xl' onClose={() => setOpenModal(false)} className="bg-gray-400 bg-opacity-50 rounded-xl">
      <Modal.Header className="border-none"></Modal.Header>
      <Modal.Body>
        <div className="rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            {/* Book Title Input */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="bookTitle">
                Book Title
              </label>
              <input
                type="text"
                id="bookTitle"
                className="block w-full rounded-lg border-gray-300 text-sm h-[50px] px-4"
                placeholder="Book Title"
                value={bookTitle}
                required
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </div>
  
            {/* Book Author Input */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="bookAuthor">
                Book Author
              </label>
              <input
                type="text"
                id="bookAuthor"
                className="block w-full border-gray-300 rounded-lg text-sm h-[50px] px-4"
                placeholder="Book Author"
                value={bookAuthor}
                required
                onChange={(e) => setBookAuthor(e.target.value)}
              />
            </div>
  
            {/* Branch Select */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="bookCenter">
                Branch
              </label>
              <select
                id="bookCenter"
                className="select select-bordered w-full"
                value={bookCenter}
                required
                onChange={(e) => setBookCenter(e.target.value)}
              >
                <option value="" disabled>
                  Branch
                </option>
                {centerBranch.map((elem, index) => (
                  <option key={index} value={elem}>
                    {elem}
                  </option>
                ))}
              </select>
            </div>
  
            {/* Branch Address Select */}
            <div className="relative mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="branchAddress">
                Branch Address
              </label>
              <select
                id="branchAddress"
                className="select select-bordered w-full"
                value={branchAddress}
                required
                onChange={(e) => setBranchAddress(e.target.value)}
              >
                <option value="" disabled>
                  Branch Address
                </option>
                {bookCenter && branchAddresses[bookCenter]?.map((address, index) => (
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

  
           
           
            {/* File Upload Input */}
            <div className="flex items-center justify-center col-span-2 border-2 border-dashed rounded-xl bg-white mt-4 border-gray-300 h-[100px]">
              <label className="block text-sm font-semibold text-gray-700 cursor-pointer  flex flex-col justify-center items-center w-full h-full">
                Upload File
                <span className="mt-1 text-xs text-gray-500">{fileName || "No file chosen"}</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
          </div>
  
          {/* Update Button */}
          <button
            className="inline-block w-full bg-gradient-to-tl from-orange-700 to-orange-400 px-6 py-3 text-sm font-bold text-center text-white uppercase rounded-lg mt-4"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  

  );
};

export default EditButton;
