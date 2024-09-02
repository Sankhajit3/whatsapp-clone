import { Alert, Button, Snackbar } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { currentUser, register } from "../../Redux/Auth/Action";

const SignUp = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {auth}=useSelector(store=>store)
  const token = localStorage.getItem("token")

  console.log("Current user ",auth.reqUser)

  const [inputData, setInputData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Handle Submit",inputData);
    dispatch(register(inputData));
    setOpenSnackbar(true);
  };
  const handleChange = (e) => {
    const {name,value}=e.target;
    setInputData((values)=>({...values,[name]:value}))
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(()=>{
    if(token)dispatch(currentUser(token))
  },[token])

  useEffect(()=>{
    if(auth.reqUser?.full_name){
      navigate("/")
    }
  },[auth.reqUser])

  return (
    <div>
      <div className="flex flex-col justify-center min-h-screen items-center">
        <div className="w-[30%] p-10 shadow-md bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="mb-2">User Name</p>
              <input
                placeholder="Enter username"
                onChange={(e) => handleChange(e)}
                value={inputData.full_name}
                type="text"
                name="full_name"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <p className="mb-2">Email</p>
              <input
                placeholder="Enter Your Name"
                onChange={(e) => handleChange(e)}
                value={inputData.email}
                type="text"
                name="email"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <p className="mb-2">Password</p>
              <input
                placeholder="Enter Your Password"
                onChange={(e) => handleChange(e)}
                value={inputData.password}
                type="text"
                name="password"
                className="py-2 px-3 outline outline-green-600 w-full rounded-md border-1"
              />
            </div>

            <div>
              <Button
                type="sumbit"
                sx={{ bgcolor: green[700], padding: ".5rem 0rem" }}
                className="w-full"
                variant="contained"
              >
                Sign Up
              </Button>
            </div>
          </form>
          <div className="flex space-x-3 item-center mt-5">
            <p>Already Have An Account?</p>
            <Button variant="text" onClick={() => navigate("/signin")}>
              signin
            </Button>
          </div>
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Your Account Successfully Created!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default SignUp;
