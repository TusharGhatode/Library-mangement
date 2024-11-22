// import React, { useState, useEffect } from "react";
// import { db, storage } from "../../firebase/firebaseConfig"; // Adjust the import path based on your structure
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { doc, setDoc, getDoc,onSnapshot } from "firebase/firestore";
// import { useAlert } from 'react-alert';

// const Profile = () => {
//   const [fullname, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [gender, setGender] = useState("");
//   const [fileName, setFileName] = useState("Select");
//   const [imageURL, setImageURL] = useState(""); // This will store the uploaded image URL
//   const [selectedFile, setSelectedFile] = useState(null);
//   const alert = useAlert();

//   const localEmail = localStorage.getItem("email");

//   useEffect(() => {
//     if (localEmail) {
//       setEmail(localEmail);
     
//     }
//   }, [localEmail]);

//   useEffect(() => {
//     if (email) {
//       const unsubscribe = onSnapshot(doc(db, "Profiles", email), (doc) => {
//         if (doc.exists()) {
//           const profileData = doc.data();
//           setFullName(profileData.fullname || "");
//           setPhone(profileData.phone || "");
//           setAddress(profileData.address || "");
//           setCity(profileData.city || "");
//           setState(profileData.state || "");
//           setGender(profileData.gender || "");
//           setImageURL(profileData.imageURL || "");
//         } else {
//           console.log("No profile data found.");
//         }
//       }, (error) => {
//         console.error("Error fetching profile data:", error);
//       });

//       return () => unsubscribe(); // Clean up the subscription on unmount
//     }
//   }, [email]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.type.startsWith("image/")) {
//         setSelectedFile(selectedFile);
//         setFileName(selectedFile.name);

//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setImageURL(reader.result);
//         };
//         reader.readAsDataURL(selectedFile);
//       } else {
//         alert.show("Please select a valid image file.", {
//           type: 'error',
//           timeout: 3000,
//         });
//         e.target.value = ""; // Reset the input if it's not a valid image
//       }
//     } else {
//       setFileName("Select");
//       setSelectedFile(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!fullname || !email || !phone || !address || !city || !state || !gender || !imageURL) {
//       alert.show("Please fill in all required fields.", {
//         type: 'error',
//         timeout: 3000,
//       });
//       return; // Stop the submission if any field is empty
//     }

//     try {
//       await setDoc(doc(db, "Profiles", email), {
//         fullname,
//         email,
//         phone,
//         address,
//         city,
//         state,
//         gender,
//         imageURL: imageURL,
//       });

     

//       alert.show("Profile saved successfully!", {
//         type: 'success',
//         timeout: 3000,
//       });
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       alert.show("Error saving profile. Please try again.", {
//         type: 'error',
//         timeout: 3000,
//       });
//     }
//   };

//   return (
  
//     <div className="flex justify-center items-center  mt-1 bg-gray-100  px-4">
//   <form onSubmit={handleSubmit} className="w-full  px-4 py-4 bg-white rounded-xl">
//     <div className="flex justify-center items-center mb-8">
//       <div className="relative">
//         <div className="ring-error ring-offset-base-100 w-16 h-16 sm:w-16 sm:h-16 rounded-full ring ring-offset-2 overflow-hidden">
//           <img
//             src={
//               imageURL ||
//               "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
//             }
//             alt="Avatar"
//             className="rounded-full w-full h-full object-cover"
//           />
//           <label className="absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 cursor-pointer bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm border border-white shadow-md">
//             +
//             <input
//               type="file"
//               className="hidden"
//               accept="image/*"
//               onChange={handleFileChange}
//             />
//           </label>
//         </div>
//       </div>
//     </div>

//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//       {/* Full Name */}
//       <div className="flex flex-col">
//         <label className="mb-2 text-sm font-semibold text-gray-700">Full Name</label>
//         <input
//           type="text"
//           value={fullname}
//           onChange={(e) => setFullName(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//           placeholder="Enter your name"
//         />
//       </div>

//       {/* Email */}
//       <div className="flex flex-col">
//         <label className="mb-2 font-semibold text-sm text-gray-700">Email</label>
//         <input
//           type="email"
//           value={email}
//           readOnly
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-gray-100 border"
//           placeholder="Enter your email"
//         />
//       </div>

//       {/* Phone */}
//       <div className="flex flex-col">
//         <label className="mb-2 font-semibold text-sm text-gray-700">Phone</label>
//         <input
//           type="tel"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//           placeholder="Enter your phone number"
//         />
//       </div>

//       {/* Address */}
//       <div className="flex flex-col">
//         <label className="mb-2 font-semibold text-sm text-gray-700">Address</label>
//         <input
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//           placeholder="Enter your address"
//         />
//       </div>

//       {/* State */}
//       <div className="flex flex-col">
//         <label className="mb-2 font-semibold text-sm text-gray-700">State</label>
//         <input
//           type="text"
//           value={state}
//           onChange={(e) => setState(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//           placeholder="Enter your state"
//         />
//       </div>

//       {/* City */}
//       <div className="flex flex-col">
//         <label className="mb-2 font-semibold text-sm text-gray-700">City</label>
//         <input
//           type="text"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//           placeholder="Enter your city"
//         />
//       </div>

//       {/* Gender */}
//       <div className="flex flex-col sm:col-span-2">
//         <label className="mb-2 font-semibold text-sm text-gray-700">Gender</label>
//         <select
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//           className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
//         >
//           <option value="">Select Gender</option>
//           <option value="male">Male</option>
//           <option value="female">Female</option>
//           <option value="other">Other</option>
//         </select>
//       </div>
//     </div>

//     <div className="flex justify-center items-center mt-8">
//       <button
//         type="submit"
//         className="w-full sm:w-48 text-white p-3 rounded-lg bg-gradient-to-tl from-orange-700 to-orange-400 transition duration-300 font-semibold"
//       >
//         Submit
//       </button>
//     </div>
//   </form>
// </div>

//   );
// };

// export default Profile;


















import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase/firebaseConfig"; 
import { doc, setDoc, getDoc,onSnapshot, query,collection,where,getDocs} from "firebase/firestore";
import { useAlert } from 'react-alert';

const Profile = () => {
 
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const [fileName, setFileName] = useState("Select");
  const [imageURL, setImageURL] = useState(""); // This will store the uploaded image URL
  const [selectedFile, setSelectedFile] = useState(null);
  const alert = useAlert();
  const [userName, setUserName] = useState(""); // This will store the uploaded image URL

  const localEmail = localStorage.getItem("email");

  useEffect(() => {
    if (localEmail) {
      setEmail(localEmail);
     
    }
  }, [localEmail]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const userRef = collection(db, 'Registrations');
        const q = query(userRef, where('Email', '==', email));
        const querySnapshot = await getDocs(q);
        
        // Check if any documents were found
        if (!querySnapshot.empty) {
          // Assuming user data is in the first document
          const userDoc = querySnapshot.docs[0].data();
          setUserName(userDoc.Name);
        } 
      } catch (err) {
        console.error('Error fetching user data:', err);
       
      } 
    };

    if (email) {
      fetchUserData();
    }
  }, [email]); // Fetch data when


  useEffect(() => {
    if (email) {
      const unsubscribe = onSnapshot(doc(db, "Profiles", email), (doc) => {
        if (doc.exists()) {
          const profileData = doc.data();
          setUserName(userName || "");
          setPhone(profileData.phone || "");
          setAddress(profileData.address || "");
          setCity(profileData.city || "");
          setState(profileData.state || "");
          setGender(profileData.gender || "");
          setImageURL(profileData.imageURL || "");
        } else {
          console.log("No profile data found.");
        }
      }, (error) => {
        console.error("Error fetching profile data:", error);
      });

      return () => unsubscribe(); // Clean up the subscription on unmount
    }
  }, [email]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        setSelectedFile(selectedFile);
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
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !email || !phone || !address || !city || !state || !gender || !imageURL) {
      alert.show("Please fill in all required fields.", {
        type: 'error',
        timeout: 3000,
      });
      return; // Stop the submission if any field is empty
    }

    try {
      await setDoc(doc(db, "Profiles", email), {
        fullname:userName,
        email,
        phone,
        address,
        city,
        state,
        gender,
        imageURL: imageURL,
      });

     

      alert.show("Profile saved successfully!", {
        type: 'success',
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      alert.show("Error saving profile. Please try again.", {
        type: 'error',
        timeout: 3000,
      });
    }
  };

  return (
  
    <div className="flex justify-center items-center  mt-1 bg-gray-100  px-4">
  <form onSubmit={handleSubmit} className="w-full  px-4 py-4 bg-white rounded-xl">
    <div className="flex justify-center items-center mb-8">
      <div className="relative">
        <div className="ring-error ring-offset-base-100 w-16 h-16 sm:w-16 sm:h-16 rounded-full ring ring-offset-2 overflow-hidden">
          <img
            src={
              imageURL ||
              "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="Avatar"
            className="rounded-full w-full h-full object-cover"
          />
          <label className="absolute bottom-1 right-1 transform translate-x-1/2 translate-y-1/2 cursor-pointer bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm border border-white shadow-md">
            +
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Full Name */}
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-semibold text-gray-700">Full Name</label>
        <input
          type="text"
          value={userName}
          readOnly          
          
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-gray-100  border"
          placeholder="Enter your name"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-gray-100 border"
          placeholder="Enter your email"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
          placeholder="Enter your address"
        />
      </div>

      {/* State */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">State</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
          placeholder="Enter your state"
        />
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="mb-2 font-semibold text-sm text-gray-700">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
          placeholder="Enter your city"
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col sm:col-span-2">
        <label className="mb-2 font-semibold text-sm text-gray-700">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="block w-full border-gray-400 rounded-xl text-sm h-[50px] px-4 text-slate-900 bg-white border"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div className="flex justify-center items-center mt-8">
      <button
        type="submit"
        className="w-full sm:w-48 text-white p-3 rounded-lg bg-gradient-to-tl from-orange-700 to-orange-400 transition duration-300 font-semibold"
      >
        Submit
      </button>
    </div>
  </form>
</div>

  );
};

export default Profile;
