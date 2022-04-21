import { useQuery } from "react-query";
import Dropdown from "./Dropdown";
import axios from "axios";
import DateTimePicker from "react-datetime-picker";

export default function ModalFlightsCreate(props) {
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
                  <h3 className="text-2xl font-semibold">
                    {!props.editFlight ? "Add Flight" : "Edit Flight"}
                  </h3>
                </div>

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {isLoading && <div>Loading...</div>}
                  {isSuccess && (
                    <Dropdown
                      data={airlines.data}
                      text="Airline"
                      selectedData={props.airline}
                      setSelectedData={props.setAirline}
                    />
                  )}
                  {isError && <div>{error.message}</div>}
                  {isSuccess && (
                    <Dropdown
                      data={props.airline ? props.airline.cities : []}
                      text="Origin"
                      selectedData={props.origin}
                      setSelectedData={props.setOrigin}
                    />
                  )}
                  {isSuccess && (
                    <Dropdown
                      data={
                        props.airline && props.origin
                          ? props.airline.cities.filter(
                              (city) => city.id !== props.origin.id
                            )
                          : []
                      }
                      text="Destination"
                      selectedData={props.destination}
                      setSelectedData={props.setDestination}
                    />
                  )}
                  <label htmlFor="block text-sm font-s text-gray-700">
                    Departure
                  </label>
                  <div className="mt-1">
                    <DateTimePicker
                      onChange={props.setDepartureDate}
                      value={props.departureDate}
                      disableClock={true}
                    />
                  </div>
                  <label htmlFor="block text-sm font-s text-gray-700">
                    Arrival
                  </label>
                  <div className="mt-1">
                    <DateTimePicker
                      onChange={props.setArrivalDate}
                      value={props.arrivalDate}
                      disabled={!props.departureDate}
                      disableClock={true}
                      minDate={props.departureDate}
                    />
                  </div>
                  {props.arrivalDate &&
                    props.departureDate &&
                    props.arrivalDate < props.departureDate && (
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
                    onClick={() => {
                      props.setShowModal(false);
                      props.setEditFlight();
                      props.setAirline();
                      props.setOrigin();
                      props.setDestination();
                      props.setDepartureDate();
                      props.setArrivalDate();
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={
                      !props.editFlight
                        ? (event) => props.handleSubmit(event)
                        : (event) => props.handleEditSubmit(event)
                    }
                    disabled={
                      !props.arrivalDate ||
                      !props.departureDate ||
                      !props.airline ||
                      !props.origin ||
                      !props.destination ||
                      props.arrivalDate < props.departureDate
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
