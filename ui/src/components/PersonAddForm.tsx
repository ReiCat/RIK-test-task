import React, { FunctionComponent, useState, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import PersonAddClass from "./data/PersonAddClass";
import { addPerson } from "../services/apiSource";
import { LINK_PATHS } from "../constants/paths";

interface PersonAddFormProps {}

const PersonAddForm: FunctionComponent<PersonAddFormProps> = (
  props: PersonAddFormProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const personAddForm = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      personal_code: 0,
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .required()
        .min(1, "Must be at least 1 symbol")
        .max(100, "Must be at most 100 symbols"),
      last_name: Yup.string()
        .required()
        .min(1, "Must be at least 1 symbol")
        .max(100, "Must be at most 100 symbols"),
      personal_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const newPerson = new PersonAddClass();
      newPerson.first_name = values.first_name;
      newPerson.last_name = values.last_name;
      newPerson.personal_code = values.personal_code;
      addPerson(newPerson)
        .then((addedPerson: any) => {
          navigate(`${LINK_PATHS.persons}/${addedPerson.data.personal_code}`);
        })
        .catch((err) => {
          setError(err.response.data.message);
        });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    personAddForm.handleChange(e);
  };

  return (
    <Form onSubmit={personAddForm.handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="first_name">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            onChange={handleChange}
            isInvalid={!!personAddForm.errors?.first_name}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="last_name">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            onChange={handleChange}
            isInvalid={!!personAddForm.errors?.last_name}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="12" controlId="personal_code">
          <Form.Label>Personal code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Personal code"
            onChange={handleChange}
            isInvalid={!!personAddForm.errors?.personal_code}
          />
        </Form.Group>
      </Row>
      <Button type="submit" variant="primary" size="lg">
        Add
      </Button>
      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </Form>
  );
};

export default PersonAddForm;
