import React, { FC, useState, useEffect, ChangeEvent } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useFormik } from "formik";
import * as Yup from "yup";

import { searchCompanies } from "../services/apiSource";
import CompanySearchClass from "./data/CompanySearchClass";

interface CompanySearchFormProps {
  setCompanies: Function;
}

const CompanySearchForm: React.FC<CompanySearchFormProps> = (
  props: CompanySearchFormProps
): JSX.Element => {
  const companyForm = useFormik({
    initialValues: {
      company_name: "",
      registration_code: 0,
      shareholder_name: "",
      shareholder_code: 0,
    },
    validationSchema: Yup.object({
      company_name: Yup.string(),
      registration_code: Yup.number(),
      shareholder_name: Yup.string(),
      shareholder_code: Yup.number(),
    }),
    onSubmit: async (values) => {
      const newCompanySearchClass = new CompanySearchClass();
      newCompanySearchClass.company_name = values.company_name;
      newCompanySearchClass.registration_code = values.registration_code;
      newCompanySearchClass.shareholder_name = values.shareholder_name;
      newCompanySearchClass.shareholder_code = values.shareholder_code;
      searchCompanies(newCompanySearchClass).then((data) => {
        props.setCompanies(data);
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
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="shareholder_name">
          <Form.Label>Shareholder name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder name"
            onChange={handleChange}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="6" controlId="shareholder_code">
          <Form.Label>Shareholder code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Shareholder code"
            onChange={handleChange}
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
        Search
      </Button>
    </Form>
  );
};

export default CompanySearchForm;