import React from "react";

import { Form } from "react-bootstrap";
import { BsMoon, BsSun } from "react-icons/bs";

import { useDarkMode } from "@hooks/useDarkMode";

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <Form.Check
      type="switch"
      id="dark-mode-toggle"
      label={
        <span className="d-flex align-items-center gap-2">
          {darkMode ? <BsMoon /> : <BsSun />}
          <span className="d-none d-md-inline">
            {darkMode ? "Dark" : "Light"}
          </span>
        </span>
      }
      checked={darkMode}
      onChange={toggleDarkMode}
      className="dark-mode-toggle"
    />
  );
};

export default DarkModeToggle;
