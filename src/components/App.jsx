import { useState } from "react";
import { useQuery } from "react-query";
import "../App.css";
import { FlightsContext } from "../context/FlightsContext";
import Header from "./Header";
import ModalFlightsCreate from "./ModalFlightsCreate";
import Tabla from "./Tabla";
import axios from "axios";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFlights = (currentPage = 1) =>
    axios.get("http://127.0.0.1:8000/api/flights?page=" + currentPage);

  const {
    data: flightsData,
    isLoading,
    isError,
    error,
    isSuccess,
    isPreviousData,
  } = useQuery(["flights", currentPage], () => fetchFlights(currentPage), {
    keepPreviousData: true,
    onSuccess: (data) => {
      setFlights(data.data.data);
    },
  });

  // useEffect(() => {
  //   if (isSuccess) {
  //     console.log("Actualizando flights");
  //     setFlights(flightsData.data.data);
  //   }
  // }, [isSuccess, currentPage]);

  function previousPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }
  function nextPage() {
    if (!isPreviousData && currentPage < flightsData.data.last_page) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function addFlight(flight) {
    flightsData.data.total += 1;
    if (flightsData.data.last_page === currentPage) {
      setFlights([...flights, flight]);
    }
  }

  return (
    <FlightsContext.Provider
      value={{
        currentPage,
        nextPage,
        previousPage,
        flightsData,
        setCurrentPage,
      }}
    >
      <div className="App">
        <Header />
        <Tabla
          setShowModal={setShowModal}
          flights={flights}
          isSuccess={isSuccess}
          isError={isError}
          error={error}
          isLoading={isLoading}
        />

        {showModal && (
          <ModalFlightsCreate
            addFlight={addFlight}
            showModal={showModal}
            setShowModal={setShowModal}
          />
        )}
      </div>
    </FlightsContext.Provider>
  );
}

export default App;
