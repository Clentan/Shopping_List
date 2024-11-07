import React, { useReducer, useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const initialState = {
  name: "",
  email: "",
  password: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "Name":
      return { ...state, name: action.payload };
    case "Email":
      return { ...state, email: action.payload };
    case "Password":
      return { ...state, password: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [selected, setSelected] = useState("login");
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to display success toast
  const notifySuccess = (message) => toast.success(message);

  // Function to display error toast
  const notifyError = (message) => toast.error(message);

  // Function to handle Sign Up
  function HandleSignUp(e) {
    e.preventDefault();
    setLoading(true); // Set loading to true

    const NewItem = {
      name: state.name,
      email: state.email,
      password: state.password,
    };

    fetch(`http://localhost:8000/user?email=${state.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          notifyError("Email is already registered. Please use a different email.");
          setLoading(false); // Set loading to false
        } else {
          fetch("http://localhost:8000/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(NewItem),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              dispatch({ type: "Name", payload: "" });
              dispatch({ type: "Email", payload: "" });
              dispatch({ type: "Password", payload: "" });
              notifySuccess("Sign up successful!");
              setLoading(false); // Set loading to false
              setModal(false);
            });
        }
      })
      .catch((error) => {
        notifyError("An error occurred. Please try again.");
        setLoading(false); // Set loading to false
      });
  }

  



  // Function to handle Login
  function HandleLogin(e) {
    e.preventDefault();
    setLoading(true); // Set loading to true

    fetch(`http://localhost:8000/user?email=${state.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0 && data[0].password === state.password) {
          setIsLoggedIn(true);
          setModal(false);
          const message = `Welcome, ${data[0].name || state.email}!`; // Create message
      
          notifySuccess("Login successful!");
        } else {
          notifyError("Invalid email or password. Please try again.");
        }
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        notifyError("An error occurred. Please try again later.");
        setLoading(false); // Set loading to false
      });
  }

  return (
    <>
      <nav className="navbar fixed top-0 left-0 right-0 z-50 shadow-xl">
        <div className="navbar-brand">
          <p className="brand-name">Shopping List</p>
        </div>
        <div className="">
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            ....
          </button>
          {modal && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <Card className="max-w-full w-[340px] h-[400px]">
                  <CardBody className="overflow-hidden">
                    <Tabs
                      fullWidth
                      size="md"
                      aria-label="Tabs form"
                      selectedKey={selected}
                      onSelectionChange={setSelected}
                    >
                      <Tab key="login" title="Login">
                        <form className="flex flex-col gap-4" onSubmit={HandleLogin}>
                          <Input
                            isRequired
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            onChange={(e) =>
                              dispatch({ type: "Email", payload: e.target.value })
                            }
                          />
                          <Input
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            onChange={(e) =>
                              dispatch({ type: "Password", payload: e.target.value })
                            }
                          />
                          <p className="text-center text-small">
                            Need to create an account?{" "}
                            <Link size="sm" onPress={() => setSelected("sign-up")}>
                              Sign up
                            </Link>
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button fullWidth color="primary" type="submit" disabled={loading}>
                              {loading ? <Spinner size="sm" /> : "Login"}
                            </Button>
                          </div>
                        </form>
                      </Tab>
                      <Tab key="sign-up" title="Sign up">
                        <form className="flex flex-col gap-4 h-[300px]" onSubmit={HandleSignUp}>
                          <Input
                            isRequired
                            label="Name"
                            placeholder="Enter your name"
                            type="text"
                            onChange={(e) =>
                              dispatch({ type: "Name", payload: e.target.value })
                            }
                          />
                          <Input
                            isRequired
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            onChange={(e) =>
                              dispatch({ type: "Email", payload: e.target.value })
                            }
                          />
                          <Input
                            isRequired
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            onChange={(e) =>
                              dispatch({ type: "Password", payload: e.target.value })
                            }
                          />
                          <p className="text-center text-small">
                            Already have an account?{" "}
                            <Link size="sm" onPress={() => setSelected("login")}>
                              Login
                            </Link>
                          </p>
                          <div className="flex gap-2 justify-end">
                            <Button fullWidth color="primary" type="submit" disabled={loading}>
                              {loading ? <Spinner size="sm" /> : "Sign up"}
                            </Button>
                          </div>
                        </form>
                      </Tab>
                    </Tabs>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Toastify container */}
      <ToastContainer />

   
    </>
  );
}
