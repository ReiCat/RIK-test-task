import React, { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import { addCompany } from "../services/apiSource";
import AddCompanyClass from "./data/AddCompanyClass";
import { SHAREHOLDER_TYPES } from "../constants/enums";
import { LINK_PATHS } from "../constants/paths";

interface AddCompanyFormProps {}

const AddCompanyForm: React.FC<AddCompanyFormProps> = (
  props: AddCompanyFormProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const companyForm = useFormik({
    initialValues: {
      company_name: "",
      registration_code: 0,
      founder_code: 0,
      founder_type: SHAREHOLDER_TYPES.INDIVIDUAL,
      founder_capital: 0,
      created_at: "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string(),
      registration_code: Yup.number(),
      founder_code: Yup.number(),
      founder_type: Yup.number(),
      founder_capital: Yup.number(),
      created_at: Yup.date(),
    }),
    onSubmit: async (values) => {
      const newCompanyClass: AddCompanyClass = new AddCompanyClass();
      newCompanyClass.company_name = values.company_name.trim();
      newCompanyClass.registration_code = values.registration_code;
      newCompanyClass.founder_code = values.founder_code;
      newCompanyClass.founder_type = values.founder_type;
      newCompanyClass.founder_capital = values.founder_capital;
      newCompanyClass.created_at = values.created_at;

      addCompany(newCompanyClass)
        .then((addedCompany) => {
          navigate(`${LINK_PATHS.companies}/${addedCompany.registration_code}`);
        })
        .catch((err) => {
          console.log("Add company error:", err);
        });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    companyForm.handleChange(e);
  };

  return (
    <Form noValidate onSubmit={companyForm.handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="company_name">
          <Form.Label>Company name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Company name"
            onChange={handleChange}
            value={companyForm.values.company_name}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="registration_code">
          <Form.Label>Registration code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Registration code"
            onChange={handleChange}
            value={companyForm.values.registration_code}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="founder_code">
          <Form.Label>Founder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Founder code"
            onChange={handleChange}
            value={companyForm.values.founder_code}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="founder_type">
          <Form.Label>Founder type</Form.Label>
          <Form.Control
            required
            type="radio"
            placeholder="Founder type"
            onChange={handleChange}
            value={companyForm.values.founder_type}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="founder_capital">
          <Form.Label>Founder capital</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Founder capital"
            onChange={handleChange}
            value={companyForm.values.founder_capital}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="created_at">
          <Form.Label>Date of establishment</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Date of establishment"
            onChange={handleChange}
            value={companyForm.values.created_at}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      {/* <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group> */}
      <Button type="submit" variant="primary" size="lg">
        Add
      </Button>
      {error ? <Alert variant="primary">{error}</Alert> : null}
    </Form>
  );
};

export default AddCompanyForm;
