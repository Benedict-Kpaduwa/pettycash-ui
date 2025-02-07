import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import logo from "../src/components/assets/Cyberbytelogo.jpeg";
import httpClient from "./hooks/server.js";
import { useContext } from "react";
import { AuthContext } from "./pages/useContext/context.js";
// import Modal from "react-modal";
import NavBar from "./components/NavBar.jsx";

function App() {
  // const { user } = useUser();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});

  const navigate = useNavigate();

  // const handlePrintReceipt = () => {
  //   httpClient.get(`${import.meta.env.VITE_API_BASE_URL}/print-receipt`, {});
  // };

  const isAdmin = user.role === "admin";

  const isPending = stats.pendingForms > 0;

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/");
      return;
    }
  }, [user]);

  useEffect(() => {
    const url = user.role === "admin" ? `/stats` : `/user-stats`;
    httpClient
      .get(url)
      .then(({ data }) => {
        setStats(data);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, [user]);

  return (
    <div className="h-screen">
      <NavBar />
      <div className="flex flex-col justify-center space-y-[1px] px-10">
        <div className=" items-center">
          <h1 className="text-gray-800 text-2xl font-medium">Overview</h1>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 sm:place-self-center gap-7 py-4">
          {/* <div className="grid grid-cols gap-3 py-4 divide-y divide-orange-200"> */}
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Total Reqeusts
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.totalForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Approved Requests
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.approvedForms}
              </span>
            </div>
          </div>
          <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white p-7 w-64">
            <div className="text-center text-sm font-bold text-gray-600">
              Rejected Requests
            </div>
            <div className="flex justify-center">
              <span className="text-4xl font-bold text-orange-600">
                {stats.rejectedForms}
              </span>
            </div>
          </div>
          {isPending && (
            <div className="shadow cursor-pointer shadow-orange-200 hover:shadow-md hover:shadow-orange-300 rounded bg-white  p-7 w-64">
              <div className="text-center text-sm font-bold text-gray-600">
                Pending Requests
              </div>
              <div className="flex justify-center">
                <span className="text-4xl font-bold text-orange-600">
                  {stats.pendingForms}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white flex items-center justify-center h-5/6">
        <div className="text-center">
          <img src={logo} alt="logo" className="mx-auto w-48" />

          <h1 className="text-5xl font-extrabold mb-4 text-orange-600">
            PettyCash App
          </h1>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
