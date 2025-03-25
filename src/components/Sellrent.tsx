import React from "react";

export default function SellRentProperty(): JSX.Element {
  return (
    <div 
      className="flex flex-col lg:flex-row items-center bg-black m-10 text-white rounded-[30px] overflow-hidden p-8 lg:p-12 bg-cover bg-center"
      style={{ backgroundImage: "url('https://jugyah.com/_next/static/media/PropertyOwnerSectionImg.85ef78fd.webp')" }}
    >
      {/* Left Content */}
      <div className="lg:w-1/2 flex flex-col justify-center space-y-4  p-6 rounded-md">
        <span className="bg-gray-800 text-sm px-3 py-1 rounded-md font-semibold self-start">For Property Owners</span>
        <h2 className="text-3xl font-bold">Sell or Rent your property quickly at Jugyah</h2>
        <p className="text-gray-300 pb-10">
          Easily sell or rent your property with Jugyah. Our platform ensures fast, hassle-free transactions, connecting you with the right buyers or tenants in no time.
        </p>
        <button className="bg-white text-black px-4 py-5 rounded-md font-semibold flex items-center space-x-1 hover:bg-gray-200 transition w-fit">
          <span>List Your Home</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
