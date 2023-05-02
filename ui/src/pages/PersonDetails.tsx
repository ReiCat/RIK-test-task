import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import NavBar from "../components/NavBar";
import { LINK_PATHS } from "../constants/paths";
import { fetchPerson, fetchPersonShareholders } from "../services/apiSource";
import PersonClass from "../components/data/PersonClass";
import ShareholderClass from "../components/data/ShareholderClass";

interface PersonDetailsProps {}

const PersonDetails: React.FC<PersonDetailsProps> = (
  props: PersonDetailsProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [person, setPerson] = useState<PersonClass | undefined>();
  const [personShareholders, setPersonShareholders] = useState<
    ShareholderClass[]
  >([]);
  let { personalCode } = useParams();

  useEffect(() => {
    const convertedRegistrationCode: number | undefined =
      personalCode !== undefined ? +personalCode : undefined;

    if (convertedRegistrationCode === undefined) return;
    fetchPerson(convertedRegistrationCode)
      .then((personEntry) => {
        setPerson(personEntry);
      })
      .catch((error) => {
        return;
      });
  }, []);

  useEffect(() => {
    if (person !== undefined) {
      fetchPersonShareholders(person.personal_code)
        .then((shareholders: any) => {
          setPersonShareholders(shareholders);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    }
  }, [person]);

  return (
    <>
      <NavBar active={LINK_PATHS.personDetails} />
      {person !== undefined ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Registration code</th>
              <th>Person name</th>
              <th>Total capital</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{person.personal_code}</td>
              <td>{person.first_name}</td>
              <td>{person.last_name}</td>
              <td>{person.created_at}</td>
              <td>{person.updated_at}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <Alert className="mt-3">
          <b>No person found</b>
        </Alert>
      )}

      <h3>Shares</h3>

      {Array.isArray(personShareholders) && personShareholders.length > 0 ? (
        <Table className="mt-3" striped bordered hover>
          <thead>
            <tr>
              <th>Company registration code</th>
              <th>Company name</th>
              <th>Capital</th>
              <th>Founder</th>
              <th>Created at</th>
              <th>Updated at</th>
            </tr>
          </thead>
          <tbody>
            {personShareholders.map((personShareholder, index) => {
              return (
                <tr key={index}>
                  <td>{personShareholder.company_registration_code}</td>
                  <td>{personShareholder.company_name}</td>
                  <td>{personShareholder.capital}</td>
                  <td>{personShareholder.founder ? "✓" : ""}</td>
                  <td>{personShareholder.created_at}</td>
                  <td>{personShareholder.updated_at}</td>
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

      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </>
  );
};

export default PersonDetails;
