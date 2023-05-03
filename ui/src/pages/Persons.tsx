import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";

import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";
import PersonClass from "../components/data/PersonClass";
import { fetchPersons } from "../services/apiSource";
import PersonAddForm from "../components/PersonAddForm";

interface PersonsProps {}

const Persons: React.FC<PersonsProps> = (props: PersonsProps): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [show, setShow] = useState(false);
  const [persons, setPersons] = useState<PersonClass[]>([]);

  useEffect(() => {
    fetchPersons()
      .then((personEntries) => {
        setPersons(personEntries);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <NavBar active={LINK_PATHS.persons} />
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleShow}>
          Add person
        </Button>
      </div>

      {Array.isArray(persons) && persons.length > 0 ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Personal code</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person, index) => {
              return (
                <tr key={index}>
                  <td>{person.personal_code}</td>
                  <td>{person.first_name}</td>
                  <td>{person.last_name}</td>
                  <td>{person.created_at}</td>
                  <td>{person.updated_at}</td>
                  <td>
                    <LinkContainer
                      to={`${LINK_PATHS.persons}/${person.personal_code}`}
                    >
                      <Button>Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Alert className="mt-3">
          <b>No persons found</b>
        </Alert>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add person</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PersonAddForm />
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

export default Persons;
