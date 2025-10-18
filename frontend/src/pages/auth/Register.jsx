import React, {useState} from "react";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom"
import {} from "react-icons/ai";

const Register = ()=>{
    const [formData, setFormData ] = useState({
        fullName:"",
    })

    const [loading, setloading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setloading(true);
        setMessage("");

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("password",formData.password);
            data.append("")

            const response = await axios.post("",
                data,
            {
                headers:{"Content-type": "multipart/form-data"},
                withCredentials:true,
            }
        );

        setMessage("Register successFull redirecting to login...");

        setFormData({
          name:"",
          email:"",

        })

        setTimeout(()=>{
            navigate("/login");
        },1500);

        } catch (error) {
            console.error("Axios Error:", error );

            if(error.response){
                
            }
        }
    }

    return(
        <>
        
        </>
    )
}