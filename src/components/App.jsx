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

  const [airline, setAirline] = useState();
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [departureDate, setDepartureDate] = useState();
  const [arrivalDate, setArrivalDate] = useState();

  const [editFlight, setEditFlight] = useState();
  const [deleteFlight, setDeleteFlight] = useState();

  function setFlightData(flight) {
    setAirline(flight.airline);
    setOrigin(flight.origin);
    setDestination(flight.destination);
    setDepartureDate(new Date(flight.departureDate));
    setArrivalDate(new Date(flight.arrivalDate));
  }

  function handleDeleteSubmit(event) {
    event.preventDefault();
    axios
      .delete(`http://127.0.0.1:8000/api/delete-flight/${deleteFlight}`)
      .then((res) => {
        setFlights(flights.filter((flight) => flight.id !== deleteFlight));
        // setCurrentPage(1);
        // fetchFlights(currentPage);
        setShowModal(false);
        setEditFlight();
        setAirline();
        setOrigin();
        setDestination();
        setDepartureDate();
        setArrivalDate();
        setDeleteFlight(false);
      })
      .catch((err) => console.log(err));
  }

  function handleEditSubmit(event) {
    event.preventDefault();
    const flight = {
      airline: airline.id,
      origin: origin.id,
      destination: destination.id,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    };
    axios
      .put(`http://127.0.0.1:8000/api/update-flight/${editFlight.id}`, flight)
      .then((response) => {
        setFlights(
          flights.map((flight) =>
            flight.id === editFlight.id
              ? (flight = response.data.flight)
              : flight
          )
        );
        setShowModal(false);
        setEditFlight();
        setAirline();
        setOrigin();
        setDestination();
        setDepartureDate();
        setArrivalDate();
      })
      .catch((res) => {
        console.log(res);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const flight = {
      airline: airline.id,
      origin: origin.id,
      destination: destination.id,
      departureDate: departureDate,
      arrivalDate: arrivalDate,
    };
    axios
      .post("http://127.0.0.1:8000/api/flight", flight)
      .then((response) => {
        setShowModal(false);
        addFlight(response.data.flight);
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
      if (flightsData.data.data.length === flightsData.data.per_page) {
        setCurrentPage((prev) => prev + 1);
      } else {
        setFlights([...flights, flight]);
      }
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
          setEditFlight={setEditFlight}
          setFlightData={setFlightData}
          setDeleteFlight={setDeleteFlight}
        />

        {showModal && (
          <ModalFlightsCreate
            addFlight={addFlight}
            setShowModal={setShowModal}
            handleSubmit={handleSubmit}
            handleEditSubmit={handleEditSubmit}
            setAirline={setAirline}
            setOrigin={setOrigin}
            setDestination={setDestination}
            setDepartureDate={setDepartureDate}
            setArrivalDate={setArrivalDate}
            airline={airline}
            origin={origin}
            destination={destination}
            departureDate={departureDate}
            arrivalDate={arrivalDate}
            editFlight={editFlight}
            setEditFlight={setEditFlight}
            deleteFlight={deleteFlight}
            setDeleteFlight={setDeleteFlight}
            handleDeleteSubmit={handleDeleteSubmit}
          />
        )}
      </div>
    </FlightsContext.Provider>
  );
}

export default App;
