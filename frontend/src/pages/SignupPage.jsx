import React, { useState } from "react";
import { motion } from "framer-motion";
import signupImge from "../assets/sign-up.png"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiConnector } from "../services/apiConnector";
import { authEndpoints } from "../services/apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../Redux/Slices/userSlice";
import Spinner from "../components/Spinner"
export default function SignupPage() {
  const loading = useSelector((state)=>state.user.loading)
  const dispatch = useDispatch()
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    about: "",
    password:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if(name === "phone"){
          e.target.value = e.target.value.slice(0,10)
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    try{
        e.preventDefault();
        if (!formData.phone.trim()) {
            toast.warn("Phone number is required");
            return;
        }
        if (!formData.name.trim()) {
            toast.warn("Name number is required");
            return;
        }
        if (!formData.password.trim()) {
          toast.warn("Password number is required");
          return;
        }
        dispatch(setLoading(true))
        const result = await apiConnector("POST",authEndpoints.SIGN_UP,formData)
        toast.success(result?.data?.message)
        dispatch(setLoading(false))
        navigate("/login")
        
      }
      catch(error){
        dispatch(setLoading(false))
        console.log("Error in Creating the account : ",error)
    }
  };

  return (
    <div className="bg-gray-100">
      {loading && <Spinner/>}

    <div className="min-h-screen w-10/12 mx-auto  lg:flex-row flex-col flex lg:justify-between lg:gap-0 gap-24 lg:pt-0 pt-8 items-center p-4">
        <div>
            <img src={signupImge} alt="" className="lg:w-[40vw] w-[90vw] object-cover" />
        </div>

      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          Sign Up to WhatsApp 
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

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* About (optional) */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              About (optional)
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell something about yourself..."
              className="w-full px-4 py-2 border focus:border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
        <button onClick={()=>navigate("/login")} className="mt-2 text-blue-500 hover:text-blue-600 cursor-pointer">Sign In</button>
      </motion.div>
    </div>
    </div>
  );
}
