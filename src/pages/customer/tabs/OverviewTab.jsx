import React from 'react';
import "../css/customerInfo.css"

const InfoCard = ({ title, children, className = "" }) => (
  <div className={`info-card ${className}`}>
    <h3 className="card-title">{title}</h3>
    {children}
  </div>
);

const StatCard = ({ data }) => (
  <InfoCard title="Customer Statistics" className="stats-card">
    <div className="stat-item">
      <span className="stat-label">Date Joined</span>
      <span className="stat-value">{data.dateJoined || '—'}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Last Contact</span>
      <span className="stat-value">{data.lastContact || '—'}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Total Purchases</span>
      <span className="stat-value highlight">{data.totalPurchases || '—'}</span>
    </div>
    <div className="stat-item">
      <span className="stat-label">Lifetime Value</span>
      <span className="stat-value highlight">{data.lifetimeValue || '—'}</span>
    </div>
  </InfoCard>
);

const FormInput = ({ label, name, type = 'text', value, disabled, onChange }) => (
  <div className="form-group">
    <label>{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      autoComplete="off"
    />
  </div>
);

const OverviewTab = ({ customerData, isEditing, handleInputChange }) => {
  const isB2B = customerData.custType === 'B2B';
  const isB2C = customerData.custType === 'B2C';

  return (
    <div className="overview-grid">
      {/* 1. Contact Information */}
      <InfoCard title={isB2B ? "Primary Contact Information" : "Personal Information"}>
        <div className="form-row">
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
        </div>
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
        {isB2B && (
          <FormInput
            label="Position"
            name="position"
            value={customerData.position}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        )}
      </InfoCard>

      {/* 2. Business Details (B2B) */}
      {isB2B && (
        <InfoCard title="Business Details">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={customerData.status}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="status-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
          <FormInput
            label="Company Name"
            name="company"
            value={customerData.company}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div className="form-row">
            <FormInput
              label="Commercial Register"
              name="b2b.commercialRegister"
              value={customerData.b2b?.commercialRegister}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <FormInput
              label="Website"
              name="b2b.website"
              value={customerData.b2b?.website}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-row">
            <FormInput
              label="Industry"
              name="b2b.industry"
              value={customerData.b2b?.industry}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <FormInput
              label="Company Class"
              name="b2b.companyClass"
              value={customerData.b2b?.companyClass}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <FormInput
            label="Company Size"
            name="b2b.companySize"
            value={customerData.b2b?.companySize}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </InfoCard>
      )}

      {/* 3. Individual Details (B2C) */}
      {isB2C && (
        <InfoCard title="Individual Details">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={customerData.status}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="status-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
          <FormInput
            label="Customer Category"
            name="b2c.custCategory"
            value={customerData.b2c?.custCategory}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div className="form-row">
            <FormInput
              label="ID Type"
              name="b2c.idType"
              value={customerData.b2c?.idType}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
            <FormInput
              label="ID Number"
              name="b2c.idNumber"
              value={customerData.b2c?.idNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <FormInput
            label="Birthdate"
            name="b2c.birthdate"
            type="date"
            value={customerData.b2c?.birthdate}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </InfoCard>
      )}

      {/* 4. Address Card */}
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
            type="number"
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

      <StatCard data={customerData} />
    </div>
  );
};

export default OverviewTab;