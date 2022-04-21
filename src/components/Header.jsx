import React from "react";

function Header() {
  return (
    <div class="p-6 bg-gray-50 rounded-bl-2xl rounded-br-2xl md:px-8">
      <a
        href="http://127.0.0.1:8000/"
        class="text-base font-medium text-indigo-700 hover:text-indigo-600"
      >
        <span aria-hidden="true"> &larr;</span>Go Back
      </a>
    </div>
  );
}

export default Header;
