import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/customerSearch.css';
import { getCustomers } from '../../api/CustomerApi';
import { useAuth } from '../../hooks/useAuth';
import { useTabContext } from '../../context/TabContext';

import { buildCustomerSearchParams } from "./js/customerService";
import { filterCustomers, getB2BPrimaryContact } from "./js/customerFilter";
import CustomerRow from './components/CustomerRow';


const CustomerSearch = () => {

  const navigate = useNavigate();
  const { token } = useAuth();
  const { openTab } = useTabContext();

  const [allCustomers, setAllCustomers] = useState([]);
  const [isOn, setIsOn] = useState(false);
  const [searchType, setSearchType] = useState('B2C');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);    // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);



  const handleSearchClick = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);


      const params = buildCustomerSearchParams({
        searchTerm,
        searchBy,
        searchType
      });

      const response = await getCustomers(token, params);
      const customers = response?.data?.data || [];

      console.log("Fetched customers:", response?.data);
      const filtered = filterCustomers({
        customers,
        searchTerm,
        searchBy,
        searchType
      });

      setAllCustomers(filtered);
      setFilteredCustomers(filtered);

      if (!filtered.length) {
        setError(`No ${searchType} customers found`);
      }

    } catch (err) {
      if (err.message === "EMPTY_TERM") {
        setError("Please enter a search term");
      } else if (err.message === "INVALID_ID") {
        setError("Customer ID must be a valid positive number");
      } else {
        setError("Failed to load customers");
      }

      setAllCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on filter change

    let filtered = allCustomers;
    if (status !== 'All') {
      filtered = (allCustomers || []).filter(customer =>
        customer.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredCustomers(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sorted = [...filteredCustomers].sort((a, b) => {
      let aValue, bValue;

      if (searchType === 'B2B') {
        switch (key) {
          case 'name':
            aValue = a.b2b?.companyName || '';
            bValue = b.b2b?.companyName || '';
            break;
          case 'email':
            aValue = a.b2b?.email || '';
            bValue = b.b2b?.email || '';
            break;
          case 'phone':
            aValue = a.b2b?.phone || '';
            bValue = b.b2b?.phone || '';
            break;
          case 'industry':
            aValue = a.b2b?.industry || '';
            bValue = b.b2b?.industry || '';
            break;
          default:
            aValue = a[key] || '';
            bValue = b[key] || '';
        }
      } else {
        switch (key) {
          case 'name':
            aValue = `${a.b2c?.firstName || ''} ${a.b2c?.lastName || ''}`;
            bValue = `${b.b2c?.firstName || ''} ${b.b2c?.lastName || ''}`;
            break;
          case 'email':
            aValue = a.b2c?.email || '';
            bValue = b.b2c?.email || '';
            break;
          case 'phone':
            aValue = a.b2c?.phone || '';
            bValue = b.b2c?.phone || '';
            break;
          default:
            aValue = a[key] || '';
            bValue = b[key] || '';
        }
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredCustomers(sorted);
  };





  const handleCustomerClick = async (customer) => {
    // Optional: Set a local loading state here if you want to disable the button
    console.log("Opening tab for customer:", customer);
    await openTab(customer);
  };

  // const handleCustomerClick = (customer) => {
  //   // Pass the entire customer object via state
  //   console.log("Navigating to customer info for:", customer);
  //   navigate(`/customer/info/${customer.customerId}`, {
  //     state: { customer } // <-- this is the key!
  //   });
  // };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const handleToggle = () => {
    setIsOn(!isOn);
    setSearchType(isOn ? 'B2C' : 'B2B');
    setSearchTerm('');
    setStatusFilter('All');
    setAllCustomers([]);
    setFilteredCustomers([]);
    setHasSearched(false);
    setError(null);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="customer-search-container">
      {/* Search Header */}
      <div className="search-header">
        <div className="spacer"></div>
        <h1 className="title">Customer Search</h1>
        <div className="switch-container">
          <span className="label">B2C</span>
          <label className="switch">
            <input type="checkbox" checked={isOn} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="label">B2B</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-controls">
        <div className="search-row">
          <div className="search-by-selector">
            <label htmlFor="searchBy">Search By:</label>
            <select
              id="searchBy"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="search-by-dropdown"
            >
              <option value="name">{searchType === 'B2B' ? 'Company Name' : 'Name'}</option>
              <option value="phone">Phone</option>
              <option value="id">ID</option>
            </select>
          </div>


          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder={`Enter ${searchBy === 'name' ? (searchType === 'B2B' ? 'company name' : 'customer name') : searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <button
            className="search-button"
            onClick={handleSearchClick}
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Filter Buttons */}
        {hasSearched && allCustomers.length > 0 && (
          <div className="filter-buttons">
            <button className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`} onClick={() => handleStatusFilter('All')}>All ({allCustomers?.length || 0})</button>
            <button className={`filter-btn ${statusFilter?.toLowerCase() === 'active' ? 'active' : ''}`} onClick={() => handleStatusFilter('Active')}>Active ({allCustomers?.filter(c => c.status?.toLowerCase() === 'active')?.length || 0})</button>
            <button className={`filter-btn ${statusFilter?.toLowerCase() === 'prospect' ? 'active' : ''}`} onClick={() => handleStatusFilter('Prospect')}>Prospects ({allCustomers?.filter(c => c.status?.toLowerCase() === 'prospect')?.length || 0})</button>
            <button className={`filter-btn ${statusFilter?.toLowerCase() === 'inactive' ? 'active' : ''}`} onClick={() => handleStatusFilter('Inactive')}>Inactive ({allCustomers?.filter(c => c.status?.toLowerCase() === 'inactive')?.length || 0})</button>
          </div>
        )}
      </div>

      {/* Results Summary with Items Per Page */}
      {hasSearched && filteredCustomers.length > 0 && (
        <div className="results-summary">
          <div className="results-info">
            <span className="results-count">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}</span>
            {statusFilter !== 'All' && (<span className="filter-info">(filtered by status: <strong>{statusFilter}</strong>)</span>)}
          </div>
          <div className="items-per-page">
            <label htmlFor="itemsPerPage">Show:</label>
            <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="items-per-page-select">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching for customers...</p>
        </div>
      )}

      {/* Customer Table */}
      {!isLoading && hasSearched && (
        <div className="table-container">
          {currentItems.length > 0 ? (
            <>
              <table className="customer-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th onClick={() => handleSort('name')} className="sortable">
                      {searchType === 'B2B' ? 'Company Name' : 'Name'} {getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('email')} className="sortable">
                      Email {getSortIcon('email')}
                    </th>
                    <th onClick={() => handleSort('phone')} className="sortable">
                      Phone {getSortIcon('phone')}
                    </th>
                    {searchType === 'B2B' ? (
                      <>
                        <th onClick={() => handleSort('industry')} className="sortable">
                          Industry {getSortIcon('industry')}
                        </th>
                        <th>Tax ID</th>
                      </>
                    ) : (
                      <>
                        <th>Date of Birth</th>
                        <th>Category</th>
                      </>
                    )}
                    <th onClick={() => handleSort('status')} className="sortable">
                      Status {getSortIcon('status')}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((customer) => (
                    <CustomerRow
                      key={customer.customerId}
                      customer={customer}
                      searchType={searchType}
                      handleCustomerClick={handleCustomerClick}
                    />
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>

                  <div className="pagination-numbers">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                      ) : (
                        <button
                          key={page}
                          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No customers found</h3>
              <p>Try searching with different criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !isLoading && (
        <div className="initial-state">
          <div className="initial-state-icon">🔎</div>
          <h3>Ready to Search</h3>
          <p>Select search criteria and enter a value to find customers</p>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;


// // Function defined outside the component or within a utility file
// const getB2BPrimaryPhone = (customer) => {
//   // Check if it's B2B and the necessary nested objects exist
//   if (customer.custType !== 'B2B' || !customer.b2b) {
//     return '-'; // Return placeholder if not B2B or data is missing
//   }

//   const { primaryContactId, contacts } = customer.b2b;

//   if (!contacts || contacts.length === 0) {
//     return '-'; // No contacts
//   }

//   // Find the contact whose 'id' matches the 'primaryContactId'
//   const primaryContact = contacts.find(contact => contact.id === primaryContactId);

//   // Return the phone number or '-' if the contact or phone is missing
//   return primaryContact?.phone || '-';
// };