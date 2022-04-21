import { useState } from "react";
import { useQuery } from "react-query";
import Dropdown from "./Dropdown";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";

export default function ModalFlightsCreate(props) {
  const [airline, setAirline] = useState();
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();

  const [departureDate, setDepartureDate] = useState();
  const [arrivalDate, setArrivalDate] = useState();

  function fetchAirlines() {
    const airlinesPromise = axios.get("http://127.0.0.1:8000/api/airline");
    return airlinesPromise;
  }
  const {
    data: airlines,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useQuery("airlines", fetchAirlines);

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
        props.setShowModal(false);
        // console.log(response.data.flight);
        props.addFlight(response.data.flight);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      {props.showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">Add Flight</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => props.setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {isLoading && <div>Loading...</div>}
                  {isSuccess && (
                    <Dropdown
                      data={airlines.data}
                      text="Airline"
                      selectedData={airline}
                      setSelectedData={setAirline}
                    />
                  )}
                  {isError && <div>{error.message}</div>}
                  {isSuccess && (
                    <Dropdown
                      data={airline ? airline.cities : []}
                      text="Origin"
                      selectedData={origin}
                      setSelectedData={setOrigin}
                    />
                  )}
                  {isSuccess && (
                    <Dropdown
                      data={
                        airline && origin
                          ? airline.cities.filter(
                              (city) => city.id !== origin.id
                            )
                          : []
                      }
                      text="Destination"
                      selectedData={destination}
                      setSelectedData={setDestination}
                    />
                  )}
                  <label htmlFor="block text-sm font-s text-gray-700">
                    Departure
                  </label>
                  <div className="mt-1">
                    <DateTimePicker
                      onChange={setDepartureDate}
                      value={departureDate}
                      disableClock={true}
                    />
                  </div>
                  <label htmlFor="block text-sm font-s text-gray-700">
                    Arrival
                  </label>
                  <div className="mt-1">
                    <DateTimePicker
                      onChange={setArrivalDate}
                      value={arrivalDate}
                      disabled={!departureDate}
                      disableClock={true}
                      minDate={departureDate}
                    />
                  </div>
                  {arrivalDate && departureDate && arrivalDate < departureDate && (
                    <div>
                      <div className="text-red-500 text-sm">
                        Arrival date must be after departure date
                      </div>
                    </div>
                  )}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => props.setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(event) => handleSubmit(event)}
                    disabled={
                      !arrivalDate ||
                      !departureDate ||
                      !airline ||
                      !origin ||
                      !destination ||
                      arrivalDate < departureDate
                    }
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
