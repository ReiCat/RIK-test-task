import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import NavBar from "../components/NavBar";
import CompanySearchForm from "../components/CompanySearchForm";
import { LINK_PATHS } from "../constants/paths";
import CompanyClass from "../components/data/CompanyClass";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = (
  props: HomePageProps
): JSX.Element => {
  const [companies, setCompanies] = useState<CompanyClass[]>([]);

  return (
    <>
      <NavBar active={LINK_PATHS.homePage} />
      <CompanySearchForm setCompanies={setCompanies} />

      {Array.isArray(companies) && companies.length > 0 ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Registration code</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => {
              return (
                <tr key={index}>
                  <td>{company.registration_code}</td>
                  <td>{company.company_name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Alert className="mt-3">
          <b>No companies found</b>
        </Alert>
      )}
    </>
  );
};

export default HomePage;
