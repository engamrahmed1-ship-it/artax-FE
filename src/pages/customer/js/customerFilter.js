export const getB2BPrimaryContact = (customer) => {
  if (customer.custType !== "B2B") return null;

  const { b2b } = customer;
  if (!b2b?.contacts?.length) return null;

  return (
    b2b.contacts.find(c => c.id === b2b.primaryContactId) ||
    b2b.contacts.find(c => c.relation === "Primary") ||
    null
  );
};

export const filterCustomers = ({
  customers,
  searchTerm,
  searchBy,
  searchType
}) => {
  const term = searchTerm.toLowerCase();

  return customers.filter(customer => {
    if (customer.custType !== searchType) return false;

    /* ---------- B2B ---------- */
    if (searchType === "B2B") {
      const b2b = customer.b2b;
      if (!b2b) return false;

      if (searchBy === "id") {
        return customer.customerId === Number(searchTerm);
      }

      if (searchBy === "phone") {
        const primary = getB2BPrimaryContact(customer);
        return primary?.phone?.toString().includes(searchTerm);
      }

      if (searchBy === "name") {
        return b2b.companyName?.toLowerCase().includes(term);
      }

      if (searchBy === "commercialRegister") {
        return b2b.commercialRegister?.includes(searchTerm);
      }
    }

    /* ---------- B2C ---------- */
    if (searchType === "B2C") {
      const b2c = customer.b2c;
      if (!b2c) return false;

      if (searchBy === "id") {
        return customer.customerId === Number(searchTerm);
      }

      if (searchBy === "phone") {
        return b2c.phone?.toString().includes(searchTerm);
      }

      if (searchBy === "name") {
        const fullName = `${b2c.firstName || ""} ${b2c.lastName || ""}`.toLowerCase();
        return fullName.includes(term);
      }

      if (searchBy === "nationalId") {
        return b2c.nationalId?.includes(searchTerm);
      }
    }

    return false;
  });
};
