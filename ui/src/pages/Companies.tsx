import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";
import CompanyClass from "../components/data/CompanyClass";
import { fetchCompanies } from "../services/apiSource";
import AddCompanyForm from "../components/AddCompanyForm";

interface CompaniesProps {}

const Companies: React.FC<CompaniesProps> = (
  props: CompaniesProps
): JSX.Element => {
  const [show, setShow] = useState(false);
  const [companies, setCompanies] = useState<CompanyClass[]>([]);

  useEffect(() => {
    fetchCompanies().then((companyEntries) => {
      setCompanies(companyEntries);
    });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <NavBar active={LINK_PATHS.companies} />
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleShow}>
          Add company
        </Button>
      </div>

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
                  <td>
                    <Button
                      href={`${LINK_PATHS.companies}/${company.registration_code}`}
                    >
                      Details
                    </Button>
                  </td>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddCompanyForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Companies;
