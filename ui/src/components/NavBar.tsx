import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import menuData, { menuDataItem } from "../constants/menu";

interface NavBarProps {
  active?: string;
}

const NavBar: React.FC<NavBarProps> = (props: NavBarProps) => {
  const isActive = (path: string) => {
    return path === props.active ? "active" : "";
  };

  const renderMenu = (data: menuDataItem[]) => {
    return data.map((menuItem: menuDataItem, index: number) => {
      return (
        <li key={index}>
          <Nav.Link
            as={Link}
            className={isActive(menuItem.path)}
            to={menuItem.path}
          >
            {menuItem.name}
          </Nav.Link>
        </li>
      );
    });
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Companies viewer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{renderMenu(menuData)}</Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
