import React, { useState } from 'react';


// Inside CustomerSearch component, add this small row component


const CustomerRow = ({ customer, searchType, handleCustomerClick }) => {
    const [isLoading, setIsLoading] = useState(false);

    const onView = async (e) => {
        e.stopPropagation();           // prevent row click
        if (isLoading) return;

        setIsLoading(true);
        try {
            await handleCustomerClick(customer);   // ← your async tab-opening logic
        } catch (err) {
            console.error("View customer failed:", err);
            // optional: toast.error("Could not open customer details");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <tr
            key={customer.customerId}
            className="customer-row"
            onClick={() => handleCustomerClick(customer)}   // row click still works
        >
            <td className="customer-id">{customer.customerId}</td>

            <td className="customer-name">
                <div className="name-avatar">
                    {searchType === 'B2B'
                        ? (customer.b2b?.companyName?.[0] || 'C').toUpperCase()
                        : (customer.b2c?.firstName?.[0] || 'U').toUpperCase()}
                    {searchType === 'B2B'
                        ? (customer.b2b?.companyName?.[1] || 'O').toUpperCase()
                        : (customer.b2c?.lastName?.[0] || 'N').toUpperCase()}
                </div>
                <span>
                    {searchType === 'B2B'
                        ? customer.b2b?.companyName || 'Unknown Company'
                        : `${customer.b2c?.firstName || 'Unknown'} ${customer.b2c?.lastName || 'Customer'}`}
                </span>
            </td>

            <td className="customer-email">
                {searchType === 'B2B'
                    ? customer.b2b?.contacts
                        ?.find((c) => c.id === customer.b2b?.primaryContactId)
                        ?.email || '-'
                    : customer.b2c?.email || '-'}
            </td>
            <td className="customer-phone">
                {searchType === 'B2B'
                    ? customer.b2b?.contacts
                        ?.find((c) => c.id === customer.b2b?.primaryContactId)
                        ?.phone || '-'
                    : customer.b2c?.phone || '-'}
            </td>
            {searchType === 'B2B' ? (
                <>
                    <td className="customer-industry">
                        {customer.b2b?.industry || '-'}
                    </td>
                    <td className="customer-taxid">
                        {customer.b2b?.commercialRegister || '-'}
                    </td>
                </>
            ) : (
                <>
                    <td className="customer-dob">
                        {customer.b2c?.birthdate || '-'}
                    </td>
                    <td className="customer-category">
                        {customer.b2c?.custCategory || '-'}
                    </td>
                </>
            )}
            <td>
                <span className={`status-badge ${(customer.status || 'unknown').toLowerCase()}`}>
                    {customer.status || 'Unknown'}
                </span>
            </td>

            <td className="customer-actions">
                <button
                    className={`action-btn view-btn ${isLoading ? 'loading' : ''}`}
                    onClick={onView}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>Loading...</>
                    ) : (
                        <>👁️ View</>
                    )}
                </button>
            </td>
        </tr>
    );
};

export default CustomerRow;