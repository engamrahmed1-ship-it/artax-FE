import React from 'react';

const OverviewTab = ({ customerData, isEditing, handleInputChange }) => {
  const InfoCard = ({ title, children }) => (
    <div className="info-card">
      <h3 className="card-title">{title}</h3>
      {children}
    </div>
  );

  const StatCard = ({ customerData }) => (
    <div className="info-card stats-card">
      <h3 className="card-title">Customer Statistics</h3>
      <div className="stat-item">
        <span className="stat-label">Date Joined</span>
        <span className="stat-value">{customerData.dateJoined}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Last Contact</span>
        <span className="stat-value">{customerData.lastContact}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Total Purchases</span>
        <span className="stat-value highlight">{customerData.totalPurchases}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Lifetime Value</span>
        <span className="stat-value highlight">{customerData.lifetimeValue}</span>
      </div>
    </div>
  );

  const FormInput = ({ label, name, type = 'text', value, disabled, onChange }) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );

  return (
    <div className="overview-grid">
      {/* Contact Information Card */}
      <InfoCard title="Contact Information">
        <FormInput
          label="First Name"
          name="firstName"
          value={customerData.firstName}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <FormInput
          label="Last Name"
          name="lastName"
          value={customerData.lastName}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={customerData.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <FormInput
          label="Phone"
          name="phone"
          type="tel"
          value={customerData.phone}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </InfoCard>

      {/* Company Information Card */}
      <InfoCard title="Company Information">
        <FormInput
          label="Company"
          name="company"
          value={customerData.company}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <FormInput
          label="Position"
          name="position"
          value={customerData.position}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={customerData.status}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
          </select>
        </div>
      </InfoCard>

      {/* Address Card */}
      <InfoCard title="Address">
        <FormInput
          label="Street"
          name="street"
          value={customerData.street}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
        <div className="form-row">
          <FormInput
            label="City"
            name="city"
            value={customerData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <FormInput
            label="State"
            name="state"
            value={customerData.state}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div className="form-row">
          <FormInput
            label="ZIP Code"
            name="zipCode"
            value={customerData.zipCode}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <FormInput
            label="Country"
            name="country"
            value={customerData.country}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </InfoCard>

      {/* Statistics Card */}
      <StatCard customerData={customerData} />
    </div>
  );
};

export default OverviewTab;
