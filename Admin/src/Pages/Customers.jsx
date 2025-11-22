import React, { useState } from "react";
import Pagination from "../Components/Pagination.jsx";

const CustomersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample customer data
  const allCustomers = [
    { id: 1, name: "Shubham Singh", email: "shubham.singh7985@gmail.com" },
    { id: 2, name: "Satyam Singh", email: "sbmsnh7985@gmail.com" },
    { id: 3, name: "Shraddha shelar", email: "shraddhashelar2005@gmail.com" },
    { id: 4, name: "Saniya Utekar", email: "Saniyautekar43@gmail.com" },
    { id: 5, name: "Saniya Utekar", email: "saniyautekar43@gmail.com" },
    { id: 6, name: "vishal Yadav", email: "vishalyadav020202@gmail.com" },
    { id: 7, name: "Balakrishnan Yadav", email: "balakrishnan82y@gmail.com" },
    { id: 8, name: "Shiva Singh", email: "gouravs7ingh.081@gmail.com" },
    { id: 9, name: "Leya Jacob", email: "Leyapersonal123@gmail.com" },
    { id: 10, name: "Afreen Idreesi", email: "afreenidreesi13@gmail.com" },
    { id: 11, name: "Rajesh Kumar", email: "rajesh.kumar@gmail.com" },
    { id: 12, name: "Priya Sharma", email: "priya.sharma@gmail.com" },
    { id: 13, name: "Amit Patel", email: "amit.patel@gmail.com" },
    { id: 14, name: "Neha Gupta", email: "neha.gupta@gmail.com" },
    { id: 15, name: "Vikram Singh", email: "vikram.singh@gmail.com" },
    { id: 16, name: "Anjali Verma", email: "anjali.verma@gmail.com" },
    { id: 17, name: "Rohit Mehta", email: "rohit.mehta@gmail.com" },
    { id: 18, name: "Pooja Desai", email: "pooja.desai@gmail.com" },
    { id: 19, name: "Karan Malhotra", email: "karan.malhotra@gmail.com" },
    { id: 20, name: "Sneha Reddy", email: "sneha.reddy@gmail.com" },
  ];

  const totalPages = Math.ceil(allCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = allCustomers.slice(startIndex, endIndex);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f1120] to-bg-[#15172b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">All Customers</h1>
        </div>

        {/* Table */}
        <div className="bg-[#15172b] backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-slate-700/50">
            <div className="col-span-1 text-slate-300 font-medium">User Id</div>
            <div className="col-span-2 text-slate-300 font-medium">Image</div>
            <div className="col-span-4 text-slate-300 font-medium">Name</div>
            <div className="col-span-5 text-slate-300 font-medium">Email</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-700/50">
            {currentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-12 gap-4 p-6 hover:bg-slate-700/30 transition-colors"
              >
                <div className="col-span-1 text-slate-200 flex items-center">
                  {customer.id}
                </div>
                <div className="col-span-2 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="col-span-4 text-slate-200 flex items-center">
                  {customer.name}
                </div>
                <div className="col-span-5 text-slate-200 flex items-center">
                  {customer.email}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
