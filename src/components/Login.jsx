import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const Login = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  //   e.preventDefault();

  //   if (!email || !password) {
  //     alert.show("All fields are required!", {
  //       type: "error",
  //       timeout: 3000,
  //     });
  //     return;
  //   }

  //   try {
  //     const q = query(collection(db, "Registrations"), where("Email", "==", email));
  //     const querySnapshot = await getDocs(q);

  //     if (!querySnapshot.empty) {
  //       const userData = querySnapshot.docs[0].data(); // Get the first matched document
  //       if (userData.Password === password) {
  //         // Check the role and redirect accordingly
  //         localStorage.setItem('role', userData.Role);
  //         localStorage.setItem('email', userData.Email);
  //         switch (userData.Role) {
  //           case "Master":
  //             navigate("/addCenter");
  //             break;
  //           case "Student":
  //             navigate("/books");
  //             break;
  //           case "Admin":
  //             navigate("/AddManager");
  //             break;
  //           case "Manager":
  //             navigate("/addStudentCenter");
  //             break;
  //           default:
  //             alert.show("Invalid role detected!", {
  //               type: "error",
  //               timeout: 3000,
  //             });
  //         }
  //       } else {
  //         alert.show("Incorrect password!", {
  //           type: "error",
  //           timeout: 3000,
  //         });
  //       }
  //     } else {
  //       alert.show("Email does not exist!", {
  //         type: "error",
  //         timeout: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during login: ", error);
  //     alert.show("An error occurred during login!", {
  //       type: "error",
  //       timeout: 3000,
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.onLine) {
      alert.show("You are offline!!", {
        type: "error",
        timeout: 3000,
      });
      return;
    }

    if (!email || !password) {
      alert.show("All fields are required!", {
        type: "error",
        timeout: 3000,
      });
      return;
    }

    try {
      const q = query(
        collection(db, "Registrations"),
        where("Email", "==", email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data(); 
        if (userData.Password === password) {
        
          localStorage.setItem("role", userData.Role);
          localStorage.setItem("email", userData.Email);
          switch (userData.Role) {
            case "Master":
              navigate("/addCenter");
              break;
            case "Student":
              navigate("/books");
              break;
            case "Admin":
              navigate("/AddManager");
              break;
            case "Manager":
              navigate("/addStudentCenter");
              break;
            default:
              alert.show("Invalid role detected!", {
                type: "error",
                timeout: 3000,
              });
          }
        } else {
          alert.show("Incorrect password!", {
            type: "error",
            timeout: 3000,
          });
        }
      } else {
        alert.show("Email does not exist!", {
          type: "error",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("Error during login: ", error);
      alert.show("An error occurred during login!", {
        type: "error",
        timeout: 3000,
      });
    }
  };

  return (
    <div className="bg-[#eaeaea] h-screen w-[100vw]">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div>
          
          <div className="sm:block hidden overflow-hidden">
          <h1 className="text-sm font-extrabold text-gray-800 pt-6 ml-4">Try these crediantials for a demo.</h1>
          <p className="font-bold text-sm ml-4 mt-2">Email: <span className="text-orange-600  font-bold">tushar@gmail.com</span></p>
          <p className="font-bold text-sm ml-4 mt-2">Password: <span className="text-orange-600 font-bold">1234</span></p>

            <div className="relative  flex flex-wrap justify-center items-center h-screen">
              
              <div className="relative flex -mt-40 bg-white mx-1 rounded-xl shadow  sm:shadow-lg sm:shadow-gray-400   w-screen sm:w-[90vw] lg:w-[80vw] xl:w-[60vw] ">
                <div className="w-1/2 px-4 py-12">
                  <h1 className="text-center font-bold sm:text-lg">Login</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-5">
                      <label
                        className="font-semibold text-sm text-gray-600 pb-1 block"
                        htmlFor="login"
                      >
                        Email
                      </label>
                      <input
                        className="border rounded-xl px-3 py-3 mt-1 mb-2 bg-gray-100 border-gray-300  text-sm w-full"
                        type="text"
                        id="login"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                      <label
                        className="font-semibold text-sm text-gray-600 pb-1 block mt-3"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        className="border rounded-xl px-3 py-3 mt-1 mb-4 bg-gray-100 border-gray-300  text-sm w-full"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        className="inline-block w-full px-6 py-4 sm:py-4 font-bold text-center text-white uppercase align-middle transition-all rounded-xl cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>

                <div className="right bg-gradient-to-tl from-orange-700 rounded-r-xl to-orange-400 w-1/2 sm:flex flex-wrap justify-center items-center flex-col">
                  <div className="text-center">
                    <h1 className="sm:text-xl lg:text-2xl text-white font-extrabold ">
                      Welcome to Login
                    </h1>
                  </div>

                  <div className=" flex flex-wrap items-center justify-center">
                    <div className="">
                      <a className="text-xs sm:text-md flex sm:text-md mt-6 text-white font-bold uppercase cursor-pointer dark:text-gray-400">
                        Don't have an account?
                        <p
                          className="text-black font-bold  ml-1 hover:underline"
                          onClick={() => navigate("/signup")}
                        >
                          sign up
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="block sm:hidden">
            <div className="relative py-3 flex flex-wrap justify-center items-center h-screen">
              <div className="relative flex bg-white w-full mx-1 rounded-xl shadow  sm:shadow-lg sm:shadow-gray-400 ">
                <div className=" px-6 py-16 w-full">
                  <h1 className="text-center font-bold sm:text-lg">Login</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="mt-5">
                      <label
                        className="font-semibold text-sm w-full text-gray-600 pb-1 block"
                        htmlFor="login"
                      >
                        Email
                      </label>
                      <input
                        className="border rounded-xl px-3 py-3 mt-1 mb-2 bg-gray-100 border-gray-300  text-sm w-full"
                        type="text"
                        id="login"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                      <label
                        className="font-semibold text-sm text-gray-600 pb-1 block mt-3"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        className="border  rounded-xl px-3 py-3 mt-1 mb-4 bg-gray-100 border-gray-300  text-sm w-full"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div className="mt-1">
                      <button
                        className="inline-block w-full px-6 py-4 sm:py-4  font-bold text-center text-white uppercase align-middle transition-all rounded-xl cursor-pointer bg-gradient-to-tl from-orange-700 to-orange-400 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 hover:bg-pink-700 active:opacity-85"
                        type="submit"
                      >
                        Login
                      </button>
                    </div>


                    <div className=" flex flex-wrap items-center justify-center">
                    <div className="">
                      <a className="text-xs flex mt-6 text-black font-bold uppercase cursor-pointer dark:text-gray-400">
                        Don't have an account?
                        <p
                          className="text-orange-500 font-bold  ml-1 hover:underline"
                          onClick={() => navigate("/signup")}
                        >
                          sign up
                        </p>
                      </a>
                    </div>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
