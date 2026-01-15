import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/createCustomer.css';
import { useAuth } from '../../hooks/useAuth';
import { createCustomer } from '../../api/CustomerApi';

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    // Shared fields for the root CustomerDto
    custType: 'B2C', // Default
    status: 'Active',// Default
    // B2C (Individual) Fields
    b2c: {
      title: 'Mr', // Default
      firstName: '',
      secondName: '', // New field
      lastName: '',
      email: '',
      phone: '',
      custCategory: 'General', // Default value
      birthdate: '',
      gender: '',
      addresses: [{ street: '', city: '', state: '', zipCode: '', country: '' }], // Only handle one address for simplicity
    },

    // B2B (Business) Fields
    b2b: {
      companyName: '',
      commercialRegister: '',
      website: '',
      companyClass: '',
      industry: '',
      companySize: 'Small', // Default value
      primaryContact: {
        title: 'Mr', // Default
        firstName: '',
        secondName: '', // We'll map to secondName later
        lastName: '', // We'll map to second/thirdName later
        jobTitle: '',
        email: '',
        phone: '',
        address: { street: '', city: '', state: '', zipCode: '', country: '' }, // Address is on the business object
      }
    },
  });



  const [errors, setErrors] = useState({});
  const isB2B = formData.custType === 'B2B';

  // --- 2. HANDLERS ---
  const handleToggle = () => {
    const newType = isB2B ? 'B2C' : 'B2B';
    setFormData(prev => ({
      ...prev,
      custType: newType
    }));
  };


  const handlePrimaryContactChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      b2b: {
        ...prev.b2b,
        primaryContact: {
          ...prev.b2b.primaryContact,
          [name]: value
        }
      }
    }));
  };


  const handleNestedInputChange = (e, section) => {
    const { name, value } = e.target;

console.log("Handling nested input change:", section, name, value);

    // If the field should be updated at the root level
    if (section === 'root') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }

    // Otherwise update nested section (b2b or b2c)
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };


  const handleAddressInputChange = (e, section) => {
    const { name, value } = e.target;
    // B2C has addresses array, B2B has a single address on primaryContact (for this form)
    const addressPath = isB2B ? formData.b2b.primaryContact.address : formData.b2c.addresses[0];

    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        addresses: isB2B ? prev.b2c.addresses : [{ ...addressPath, [name]: value }],
        primaryContact: isB2B ? {
          ...prev.b2b.primaryContact,
          address: { ...addressPath, [name]: value }
        } : undefined
      }
    }));
  };




  const validateForm = () => {
    const newErrors = {};

    if (isB2B) {
      // B2B validation: Company name and Primary Contact info
      if (!formData.b2b.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.b2b.primaryContact.firstName.trim()) newErrors.primaryFirstName = 'Contact first name is required';
      if (!formData.b2b.primaryContact.email.trim()) newErrors.primaryEmail = 'Contact email is required';
      // Add B2B address validation here if required

    } else {
      // B2C validation: Individual info
      if (!formData.b2c.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.b2c.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.b2c.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.b2c.email)) newErrors.email = 'Email is invalid';
      if (!formData.b2c.phone.trim()) newErrors.phone = 'Phone number is required';
      // Add B2C address validation here if required
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // --- 4. SUBMIT AND DATA MAPPING ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const payload = mapFormDataToApi(formData);
    console.log("API Payload ready:", payload);
    try {
      if (!token) {
        alert("You are not authenticated.");
        return;
      }

console.log("Submitting payload to API:", payload);

      const response = await createCustomer(token, payload);

      console.log("Customer created successfully:", response.data);

      alert("Customer created successfully!"+response.data.id);
      navigate("/customer/search");
    } catch (error) {
      console.error("Error creating customer:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);
      }

      alert("Error creating customer.");
    }
  };


  // --- MAPPING FUNCTION ---
  const mapFormDataToApi = (data) => {
    // Note: Long and LocalDateTime fields are omitted/handled by BE.

    if (data.custType === 'B2C') {
      const address = data.b2c.addresses[0]; // Get the first (and only) address from the form

      // DTO: CustomerIndividualDto
      const b2cPayload = {
        title: data.b2c.title,
        firstName: data.b2c.firstName,
        secondName: data.b2c.secondName,
        lastName: data.b2c.lastName,
        custCategory: data.b2c.custCategory,
        email: data.b2c.email,
        phone: data.b2c.phone,
        birthdate: data.b2c.birthdate || null,
        gender: data.b2c.gender,
        idType: '', idNumber: '', // Not collected, but included for completeness
        addresses: [{ // DTO: CustomerAddressDto
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode ? parseInt(address.zipCode, 10) : null,
          country: address.country,
        }],
      };

      // DTO: CustomerDto
      return {
        custType: 'B2C',
        status: data.status,
        b2c: b2cPayload,
        b2b: null,
      };

    } else { // B2B
      const contact = data.b2b.primaryContact;

      // DTO: CompanyContactDto (The Primary Contact)
      const primaryContactPayload = {
        title: contact.title,
        firstName: contact.firstName,
        jobTitle: contact.jobTitle,
        email: contact.email,
        phone: contact.phone ? parseInt(contact.phone, 10) : null,
        // Mapping single 'lastName' from form to BE's 'secondName'
        secondName: contact.secondName,
        lastName: contact.lastName,
        // Defaults/Uncollected fields
         priority: 1,
         relation: 'Primary', idType: null, idNumber: null, birthdate: null,
      };

      // DTO: CustomerBusinessDto
      const b2bPayload = {
        companyName: data.b2b.companyName,
        commercialRegister: data.b2b.commercialRegister,
        website: data.b2b.website,
        companyClass: data.b2b.companyClass,
        industry: data.b2b.industry,
        companySize: data.b2b.companySize,
        // Address fields come directly from the primaryContact's address input
        street: contact.address.street,
        city: contact.address.city,
        state: contact.address.state,
        zipCode: contact.address.zipCode ? parseInt(contact.address.zipCode, 10) : null,
        country: contact.address.country,

        primaryContactId: null, // Will be set by BE after contact creation
        contacts: [primaryContactPayload],
      };

      // DTO: CustomerDto
      return {
        custType: 'B2B',
        status: data.status,
        b2c: null,
        b2b: b2bPayload,
      };
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };



  return (
    <div className="create-customer-container">
      <div className="create-customer-header">
        <h1 className='title'>Create New Customer</h1>
        <div className="switch-container">
          <span className="label">B2C (Individual)</span>
          <label className="switch">
            <input type="checkbox" checked={isB2B} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="label">B2B (Business)</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="customer-form">
        {/* Dynamic Information Section */}
        <div className="form-section">
          <h2 className="section-heading">
            {isB2B ? 'Primary Contact Details' : 'Individual Details'}
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <select
                id="title"
                name="title"
                value={isB2B ? formData.b2b.primaryContact.title : formData.b2c.title}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
              >
                <option value="Prospect">Mr</option>
                <option value="Active">Mrs</option>
                <option value="Inactive">Miss</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name <span className="required">*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={isB2B ? formData.b2b.primaryContact.firstName : formData.b2c.firstName}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
                className={errors.firstName || errors.primaryFirstName ? 'error' : ''}
                placeholder="Enter first name"
              />
              {(errors.firstName || errors.primaryFirstName) && <span className="error-message">{errors.firstName || errors.primaryFirstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="secondName">Second Name <span className="required">*</span></label>
              <input
                type="text"
                id="secondName"
                name="secondName"
                value={isB2B ? formData.b2b.primaryContact.secondName : formData.b2c.secondName}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
                className={errors.secondName ? 'error' : ''}
                placeholder="Enter last name"
              />
              {errors.secondName && <span className="error-message">{errors.secondName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name <span className="required">*</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={isB2B ? formData.b2b.primaryContact.lastName : formData.b2c.lastName}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={isB2B ? formData.b2b.primaryContact.email : formData.b2c.email}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
                className={errors.email ? 'error' : ''}
                placeholder="email@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone <span className="required">*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={isB2B ? formData.b2b.primaryContact.phone : formData.b2c.phone}
                onChange={(e) =>
                  isB2B ? handlePrimaryContactChange(e) : handleNestedInputChange(e, 'b2c')
                }
                className={errors.phone ? 'error' : ''}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            {isB2B && (<div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.b2b.primaryContact.jobTitle}
                onChange={(e) => handlePrimaryContactChange(e)}
                placeholder="Job title"
              />
            </div>)}
          </div>
        </div>

        {/* Company Information Section */}
        {isB2B && (
          <div className="form-section">
            <h2 className="section-heading">Company Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.b2b.companyName}
                  onChange={(e) => handleNestedInputChange(e, 'b2b')}
                  placeholder="Company name"
                />
              </div>


              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.b2b.website}
                  onChange={(e) => handleNestedInputChange(e, 'b2b')}
                  placeholder="https://company.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.b2b.industry}
                  onChange={(e) => handleNestedInputChange(e, 'b2b')}
                  placeholder="Industry"
                />
              </div>
            </div>
          </div>
        )}
        {/* Shared Information Section */}
        <div className="form-section">
          <h2 className="section-heading">Classification</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => handleNestedInputChange(e, 'root')}
              >
                <option value="Prospect">Prospect</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor={isB2B ? "commercialRegister" : "idNumber"}>{isB2B ? 'Commercial Registry' : 'Customer ID'}</label>
              <input
                type="text"
                id={isB2B ? "commercialRegister" : "idNumber"}
                name={isB2B ? "commercialRegister" : "idNumber"}
                value={isB2B ? formData.b2b.commercialRegister : formData.b2c.idNumber}
                onChange={(e) => handleNestedInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder={isB2B ? 'Commercial Registry' : 'Customer ID'}
              />
            </div>
            {!isB2B && (
              <div className="form-group">
                <label htmlFor="custCategory">Customer Category</label>
                <select
                  id="custCategory"
                  name="custCategory"
                  value={formData.b2c.custCategory}
                  onChange={(e) => handleNestedInputChange(e, 'b2c')}
                >
                  <option value="General">General</option>
                  <option value="VIP">VIP</option>
                  <option value="Loyalty">Loyalty</option>
                </select>
              </div>
            )}
            {isB2B && (
              <div className="form-group">
                <label htmlFor="companySize">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.b2b.companySize}
                  onChange={(e) => handleNestedInputChange(e, 'b2b')}
                >
                  <option value="Small">1-50 employees</option>
                  <option value="Medium">51-500 employees</option>
                  <option value="Large">500+ employees</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Address Information Section */}
        <div className="form-section">
          <h2 className="section-heading">
            {isB2B ? 'Company Address' : 'Individual Address'}
          </h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={isB2B ? formData.b2b.primaryContact.address.street : formData.b2c.addresses[0].street}
                onChange={(e) => handleAddressInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={isB2B ? formData.b2b.primaryContact.address.city : formData.b2c.addresses[0].city}
                onChange={(e) => handleAddressInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                value={isB2B ? formData.b2b.primaryContact.address.state : formData.b2c.addresses[0].state}
                onChange={(e) => handleAddressInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder="State"
              />
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">ZIP/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={isB2B ? formData.b2b.primaryContact.address.zipCode : formData.b2c.addresses[0].zipCode}
                onChange={(e) => handleAddressInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder="12345"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={isB2B ? formData.b2b.primaryContact.address.country : formData.b2c.addresses[0].country}
                onChange={(e) => handleAddressInputChange(e, isB2B ? 'b2b' : 'b2c')}
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomer;