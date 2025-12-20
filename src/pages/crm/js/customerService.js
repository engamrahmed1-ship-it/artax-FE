export const buildCustomerSearchParams = ({
  searchTerm,
  searchBy,
  searchType
}) => {
  const term = searchTerm.trim();

  if (!term) {
    throw new Error("EMPTY_TERM");
  }

  const params = {
    page: 0,
    size: 100,
    custType: searchType
  };

  if (searchBy === "id") {
    const id = Number(term);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("INVALID_ID");
    }
    params.id = id;
    return params;
  }

  if (searchBy === "phone") {
    params.phone = term;
    return params;
  }

  if (searchType === "B2B") {
    if (searchBy === "name") params.companyName = term;
    if (searchBy === "commercialRegister") params.commercialRegister = term;
  }

  if (searchType === "B2C") {
    if (searchBy === "name") params.name = term;
    if (searchBy === "nationalId") params.nationalId = term;
  }

  return params;
};
