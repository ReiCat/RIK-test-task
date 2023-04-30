import React from "react";
import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";

interface CompanyDetailsProps {}

const CompanyDetails: React.FC<CompanyDetailsProps> = (
  props: CompanyDetailsProps
): JSX.Element => {
  return (
    <>
      <NavBar active={LINK_PATHS.companyDetails} />
    </>
  );
};

export default CompanyDetails;
