import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";
import { fetchCompany, fetchCompanyShareholders } from "../services/apiSource";
import CompanyClass from "../components/data/CompanyClass";
import ShareholderClass from "../components/data/ShareholderClass";
import EditCompanyForm from "../components/EditCompanyForm";

interface CompanyDetailsProps {}

const CompanyDetails: React.FC<CompanyDetailsProps> = (
  props: CompanyDetailsProps
): JSX.Element => {
  const [company, setCompany] = useState<CompanyClass | undefined>();
  const [companyShareholders, setCompanyShareholders] = useState<
    ShareholderClass[]
  >([]);
  let { registrationCode } = useParams();

  useEffect(() => {
    const convertedRegistrationCode: number | undefined =
      registrationCode !== undefined ? +registrationCode : undefined;

    if (convertedRegistrationCode === undefined) return;
    fetchCompany(convertedRegistrationCode)
      .then((companyEntry) => {
        setCompany(companyEntry);
      })
      .catch((error) => {
        return;
      });
  }, []);

  useEffect(() => {
    if (company !== undefined) {
      fetchCompanyShareholders(company.registration_code)
        .then((shareholders) => {
          setCompanyShareholders(shareholders);
        })
        .catch((error) => {});
    }
  }, [company]);

  return (
    <>
      <NavBar active={LINK_PATHS.companyDetails} />
      {company !== undefined ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Registration Code</th>
              <th>Company Name</th>
              <th>Total Capital</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{company.registration_code}</td>
              <td>{company.company_name}</td>
              <td>{company.total_capital}</td>
              <td>{company.created_at}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <Alert className="mt-3">
          <b>No company found</b>
        </Alert>
      )}

      <h3>Shareholders</h3>

      {Array.isArray(companyShareholders) && companyShareholders.length > 0 ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Shareholder Code</th>
              <th>Shareholder type</th>
              <th>Capital</th>
              <th>Founder</th>
            </tr>
          </thead>
          <tbody>
            {companyShareholders.map((companyShareholder, index) => {
              return (
                <tr key={index}>
                  <td>{companyShareholder.shareholder_code}</td>
                  <td>
                    {companyShareholder.shareholder_type === 1
                      ? "Physical"
                      : "Legal"}
                  </td>
                  <td>{companyShareholder.shareholder_capital}</td>
                  <td>{companyShareholder.founder ? "✓" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Alert className="mt-3">
          <b>No shareholders found</b>
        </Alert>
      )}
    </>
  );
};

export default CompanyDetails;
