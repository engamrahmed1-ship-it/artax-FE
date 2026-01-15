import React from 'react';
import "../css/customerInfo.css"

const PurchasesTab = ({ purchases }) => {
  return (
    <div className="purchases-section">
      <h3 className="section-title">Purchase History</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(purchase => (
            <tr key={purchase.id}>
              <td>{purchase.date}</td>
              <td>{purchase.product}</td>
              <td className="amount">{purchase.amount}</td>
              <td>
                <span className="status-badge completed">{purchase.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesTab;
