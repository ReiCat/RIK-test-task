import React, { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";

import { useFormik } from "formik";
import * as Yup from "yup";
import { updateCompany } from "../services/apiSource";

import CompanyClass from "./data/CompanyClass";

interface CompanyCompanyFormProps {
  registration_code: number;
  company: CompanyClass;
}

const CompanyCompanyForm: React.FC<CompanyCompanyFormProps> = (
  props: CompanyCompanyFormProps
): JSX.Element => {
  const [error, setError] = useState<string>("");
  const [company, setCompany] = useState<CompanyClass>(props.company);
  const [companyUpdated, setCompanyUpdated] = useState<boolean>(false);

  useEffect(() => {
    setCompany(props.company);
  }, [props.company]);

  const companyForm = useFormik({
    initialValues: {
      company_name: company?.company_name ? company?.company_name : "",
      registration_code: company?.registration_code
        ? company?.registration_code
        : 0,
      total_capital: company?.total_capital ? company.total_capital : 0,
      created_at: company?.created_at ? company?.created_at : "",
    },
    validationSchema: Yup.object({
      company_name: Yup.string()
        .required()
        .min(3, "Must be at least 3 symbols")
        .max(100, "Must be at most 100 symbols"),
      registration_code: Yup.string()
        .required()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(7, "Must be exactly 7 digits")
        .max(7, "Must be exactly 7 digits"),
      total_capital: Yup.number()
        .required()
        .min(2500, "The amount must be at least 2500"),
      created_at: Yup.date(),
    }),
    onSubmit: async (values) => {
      const newCompanyClass: CompanyClass = new CompanyClass();
      newCompanyClass.company_name = values.company_name.trim();
      newCompanyClass.registration_code = values.registration_code;
      newCompanyClass.total_capital = values.total_capital;
      newCompanyClass.created_at = values.created_at;

      updateCompany(props.registration_code, newCompanyClass)
        .then((updatedCompany) => {
          setCompanyUpdated(true);
        })
        .catch((err) => {
          setError(err.response.data.message);
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
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="total_capital">
          <Form.Label>Total capital</Form.Label>
          <Form.Control
            type="text"
            placeholder="Total capital"
            onChange={handleChange}
            value={companyForm.values.total_capital}
          />
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="created_at">
          <Form.Label>Created at</Form.Label>
          <Form.Control
            type="text"
            placeholder="Created at"
            onChange={handleChange}
            value={companyForm.values.created_at}
          />
        </Form.Group>
      </Row>
      <Button type="submit" variant="primary" size="lg">
        Edit
      </Button>
      {companyUpdated ? (
        <Alert variant="success" className="mt-3">
          <b>Company has been updated!</b>
        </Alert>
      ) : null}

      {error !== "" ? (
        <Alert className="mt-3">
          <b>{error}</b>
        </Alert>
      ) : null}
    </Form>
  );
};

export default CompanyCompanyForm;
