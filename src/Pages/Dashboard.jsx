import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Loading from "../Components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { add, gettoken } from "../Redux/Slices/authReducer";
import axios from "axios";
import UserDashboard from "../Components/UserDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [userDetails, setuserDetails] = useState({});
  const [isUpdate, setisUpdate] = useState(false);
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [address, setaddress] = useState("");
  const [pincode, setpincode] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [userProfile, setuserProfile] = useState(true);
  const [allmachines, setallmachines] = useState("");
  const [usermachinedata, setusermachinedata] = useState("");
  const [usermachinedatalength, setusermachinedatalength] = useState("");
  const _id = userDetails._id;
  const username = userDetails.username;
  useEffect(() => {
    const token = localStorage.getItem("token");
    setisUpdate(false);
    setloading(true);
    const fetchdata = async () => {
      try {
        const response = await axios.post(
          `https://krishi-upaj-api.onrender.com/api/users/isAuthenticated`,
          { token }
        );
        const user = response.data.others;
        const machines = await axios.post(
          `https://krishi-upaj-api.onrender.com/api/machines/getmachines`,
          {
            token,
          }
        );

        setallmachines(machines.data.machines);

        const usermachine = await axios.post(
          `https://krishi-upaj-api.onrender.com/api/machines/getusermachine`,
          {
            userid: user._id,
            token: token,
          }
        );

        setusermachinedatalength(usermachine.data.usermachine.length);
        setusermachinedata(usermachine.data.usermachine[0]);

        if (!response) {
          setloading(false);
          navigate("/signin");
        }

        setuserDetails(user);
        dispatch(add(user));
        dispatch(gettoken(token));
        setisUpdate(user.isUpdate);
        setloading(false);
      } catch (err) {
        toast.error(err.response.data.message);
        setloading(false);
        navigate("/signin");
      }
    };

    fetchdata();
  }, []);

  const handlesubmit = async (e) => {
    const token = localStorage.getItem("token");

    if (!firstname || !lastname || !address || !pincode || !phonenumber) {
      toast.error("Fill all necessary Details");
    } else {
      setloading(true);
      e.preventDefault();
      try {
        //console.log({token,_id,firstname,lastname,address,pincode,phonenumber,username})
        const response = await axios.post(
          `https://krishi-upaj-api.onrender.com/api/users/updateUser`,
          {
            token,
            _id,
            firstname,
            lastname,
            address,
            pincode,
            phonenumber,
            username,
          }
        );
        setloading(false);
        toast.success(response.data.message);
        navigate("/");
      } catch (err) {
        toast.error(err.response.data.message);
        console.log(err);
        navigate("/signin");
      }
    }
  };

  const handlethrow = () => {
    toast.error("You dont have any owned or rented machines record");
    navigate("/");
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <header className="bg-[#fcfaf9]  py-5 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-7xl max-md:text-4xl font-extrabold px-2 text-gray-300  text-center md:text-left">
                Dashboard
              </h1>
            </div>
          </header>
          {userDetails?.isUpdate ? (
            <>
              <div className=" min-h-[70h]  py-7 bg-[#fcfaf9] h-[75vh] ">
                <div className="containver mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <aside className="md:col-span-1 border-2 border-gray-300  shadow-lg rounded-lg p-4 h-[65vh]">
                      <h2 className="text-3xl text-gray-400 text-center  font-bold mb-4">
                        Navigations
                      </h2>
                      <hr className="h-[2px] bg-gray-600" />
                      <ul className="space-y-2 h-40">
                        <li
                          className="cursor-pointer mt-4  text-xl py-2 rounded-xl text-center  text-gray-600 hover:bg-gray-200"
                          onClick={() => setuserProfile(true)}
                        >
                          User Profile
                        </li>
                        <li
                          className="cursor-pointer mt-4  text-xl py-2 rounded-xl text-center text-gray-600 hover:bg-gray-200"
                          onClick={() => setuserProfile(false)}
                        >
                          User Machines
                        </li>
                      </ul>
                    </aside>

                    <section className="md:col-span-4 border-2 border-gray-300 bg-[#fcfaf9]  shadow-lg rounded-lg p-6">
                      {userProfile ? (
                        <>
                          <h2 className="text-3xl font-bold text-center text-gray-400 mb-6">
                            User Details
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">First Name</p>
                              <p className="capitalize">
                                {userDetails.firstname}
                              </p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">Last Name</p>
                              <p className=" capitalize">
                                {userDetails.lastname}
                              </p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">Username</p>
                              <p className="max-sm:h-auto h-[100%]">
                                {userDetails.username}
                              </p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">Address</p>
                              <p className=" capitalize">
                                {userDetails.address}
                              </p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">Pincode</p>
                              <p>{userDetails.pincode}</p>
                            </div>
                            <div className="border border-gray-300 p-4 rounded-lg shadow-md">
                              <p className="font-semibold mb-2">Phone Number</p>
                              <p>{userDetails.phonenumber}</p>
                            </div>
                          </div>
                        </>
                      ) : usermachinedatalength == 0 ? (
                        handlethrow()
                      ) : (
                        <UserDashboard
                          usermachinedata={usermachinedata}
                          machinedata={allmachines}
                        />
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center min-h-[70vh]">
                <div className="w-full md:w-3/4 lg:w-1/2 px-8 py-6 bg-white rounded-lg shadow-lg">
                  <h1 className="py-4 text-red-500 ">
                    {" "}
                    *First Complete your profile for further activity
                  </h1>
                  <form className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstname"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        required
                        value={firstname}
                        onChange={(e) => setfirstname(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastname"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        required
                        value={lastname}
                        onChange={(e) => setlastname(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div className="col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        onChange={(e) => setphonenumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pincode"
                        className="block text-gray-700 font-semibold mb-2"
                      >
                        Pincode
                      </label>
                      <input
                        type="tel"
                        id="pincode"
                        name="pincode"
                        required
                        onChange={(e) => setpincode(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>

                    <div className="col-span-2 text-center">
                      <button
                        type="submit"
                        onClick={handlesubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
