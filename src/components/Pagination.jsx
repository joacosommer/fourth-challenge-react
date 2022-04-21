/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useContext } from "react";
import { FlightsContext } from "../context/FlightsContext";

export default function Pagination() {
  const { currentPage, nextPage, previousPage, flightsData, setCurrentPage } =
    useContext(FlightsContext);

  function pagesBefore() {
    const minPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
    const pages = [];
    const span = (
      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
        ...
      </span>
    );
    if (minPage !== 1) {
      pages.push(span);
    }
    for (let i = minPage; i <= currentPage - 1; i++) {
      const button = (
        <button
          onClick={() => {
            setCurrentPage(i);
          }}
          className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        >
          {i}
        </button>
      );
      pages.push(button);
    }
    return pages;
  }

  function pageActual() {
    return (
      <button
        disabled={true}
        aria-current="page"
        className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      >
        {currentPage}
      </button>
    );
  }

  function pagesAfter() {
    const maxPage =
      currentPage + 2 > flightsData.data.last_page
        ? flightsData.data.last_page
        : currentPage + 2;
    const pages = [];
    const span = (
      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
        ...
      </span>
    );

    for (let i = currentPage + 1; i <= maxPage; i++) {
      const button = (
        <button
          onClick={() => {
            setCurrentPage(i);
          }}
          className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
        >
          {i}
        </button>
      );
      pages.push(button);
    }
    if (maxPage !== flightsData.data.last_page) {
      pages.push(span);
    }
    return pages;
  }

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden"></div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {currentPage === 1
                ? "1"
                : (currentPage - 1) * flightsData.data.per_page}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {flightsData.data.total < flightsData.data.per_page * currentPage
                ? flightsData.data.total
                : flightsData.data.per_page * currentPage}
            </span>{" "}
            of <span className="font-medium">{flightsData.data.total}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
            {pagesBefore()}
            {pageActual()}
            {pagesAfter()}
            {/* <a
              href="#"
              aria-current="page"
              className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              8
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              9
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              10
            </a> */}
            <button
              onClick={nextPage}
              disabled={currentPage === flightsData.data.last_page}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
