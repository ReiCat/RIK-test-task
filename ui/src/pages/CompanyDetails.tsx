import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";
import { fetchCompany, fetchCompanyShareholders } from "../services/apiSource";
import CompanyClass from "../components/data/CompanyClass";
import CompanyShareholderClass from "../components/data/CompanyShareholderClass";
import ShareholderAddForm from "../components/ShareholderAddForm";

interface CompanyDetailsProps {}

const CompanyDetails: React.FC<CompanyDetailsProps> = (
  props: CompanyDetailsProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [show, setShow] = useState(false);
  const [company, setCompany] = useState<CompanyClass | undefined>();
  const [companyShareholders, setCompanyShareholders] = useState<
    CompanyShareholderClass[]
  >([]);
  let { registrationCode } = useParams();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchCompany(Number(registrationCode))
      .then((companyEntry) => {
        setCompany(companyEntry);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (company !== undefined) {
      fetchCompanyShareholders(company.registration_code)
        .then((shareholders) => {
          setCompanyShareholders(shareholders);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    }
  }, [company]);

  const addToCompanyShareholders = (
    newCompanyShareholders: CompanyShareholderClass[]
  ) => {
    return setCompanyShareholders(newCompanyShareholders);
  };

  return (
    <>
      <NavBar active={LINK_PATHS.companyDetails} />
      {company !== undefined ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Registration code</th>
              <th>Company Name</th>
              <th>Total capital</th>
              <th>Created at</th>
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

      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleShow}>
          Add shareholder
        </Button>
      </div>

      {Array.isArray(companyShareholders) && companyShareholders.length > 0 ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Shareholder code</th>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add shareholder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ShareholderAddForm
            registration_code={registrationCode!}
            handleClose={handleClose}
            addToCompanyShareholders={addToCompanyShareholders}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </>
  );
};

export default CompanyDetails;
