import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {useDispatch, useSelector} from "react-redux"
import { setLoading, setUserDetails } from "../Redux/Slices/userSlice";
import { apiConnector } from "../services/apiConnector";
import { authEndpoints } from "../services/apis";
import Spinner from "../components/Spinner"
export default function LoginPage() {

    const loading = useSelector((state)=>state.user.loading)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

  const handleChange = (e) => {
    if(e.target.name === "phone"){
        e.target.value = e.target.value.slice(0,10)
    }
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    try{
        e.preventDefault();

        if (!formData.phone.trim() || !formData.password.trim()) {
        toast.warn("Both fields are required");
        return;
        }
        dispatch(setLoading(true))
        const result = await apiConnector("POST",authEndpoints.LOGIN,formData)
        toast.success(result?.data?.message)
        dispatch(setUserDetails(result?.data?.userDetails))
        dispatch(setLoading(false))
        localStorage.setItem("token",result?.data?.token)
        navigate("/")
    }
    catch(error){
        dispatch(setLoading(false))
        toast.error(error?.response?.data?.message || "Error in login ")
        console.log("Error in login : ",error)
    }
  };

  return (
    <div className=" bg-gray-100">
        {loading && <Spinner/>}
        <div className="h-screen w-9/12 mx-auto flex justify-between items-center ">
            <div>
                <img src="https://neo-pay.in/css/img/loginimage.png" alt="" className="w-[40vw] object-cover" />
            </div>
            <motion.div
                className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                Login to WhatsApp 
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone Number */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                    Password <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Login
                </button>

                <button onClick={()=>navigate("/signup")} className="text-blue-500 cursor-pointer hover:text-blue-600 transition-all duration-200">Create Account</button>
                </form>
            </motion.div>
        </div>
    </div>
  );
}
