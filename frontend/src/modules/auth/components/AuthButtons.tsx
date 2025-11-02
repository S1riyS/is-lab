// src/modules/common/components/AuthButtons.tsx
import { useState } from "react";

import {
  Modal as BSModal,
  Badge,
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Stack,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

import RequestAdminRoleButton from "@adminRoleRequests/components/RequestAdminRoleButton";
import { showErrorToast } from "@common/api/baseApi";
import { RootState, useAppDispatch } from "@store";

import { useLoginMutation, useRegisterMutation } from "../api/authApi";
import { clearAuth, setAuth } from "../state/authSlice";

export default function AuthButtons() {
  const dispatch = useAppDispatch();
  const auth = useSelector((s: RootState) => s.auth);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  async function submitLogin() {
    try {
      const res = await login(loginForm).unwrap();
      dispatch(setAuth(res));
      setShowLogin(false);
      setLoginForm({ username: "", password: "" });
    } catch (e) {
      showErrorToast(e);
    }
  }

  async function submitRegister() {
    try {
      const res = await register(registerForm).unwrap();
      dispatch(setAuth(res));
      setShowRegister(false);
      setRegisterForm({ username: "", password: "", role: "USER" });
    } catch (e) {
      showErrorToast(e);
    }
  }

  function handleLogout() {
    dispatch(clearAuth());
  }

  if (auth.user) {
    const isAdmin = auth.user.role === "ADMIN";
    const isUser = auth.user.role === "USER";

    return (
      <Stack direction="horizontal" gap={2} className="align-items-center flex-wrap">
        <span>
          <FaUser /> {auth.user.username}{" "}
          {isAdmin && <Badge bg="danger">Admin</Badge>}
        </span>
        {/* {isUser && <RequestAdminRoleButton />} */}
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction="horizontal"
        gap={2}
        className="align-items-center flex-wrap"
      >
        <Button
          variant="outline-primary"
          size="sm"
          disabled={isLoggingIn}
          onClick={() => setShowLogin(true)}
        >
          Log in
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={isRegistering}
          onClick={() => setShowRegister(true)}
        >
          Sign up
        </Button>
      </Stack>

      {/* Login Modal */}
      <BSModal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <ModalHeader closeButton>
          <ModalTitle>Log in</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submitLogin();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />
            </Form.Group>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowLogin(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submitLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Log in"}
          </Button>
        </ModalFooter>
      </BSModal>

      {/* Register Modal */}
      <BSModal
        show={showRegister}
        onHide={() => setShowRegister(false)}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>Sign up</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              submitRegister();
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                required
              />
            </Form.Group>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowRegister(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={submitRegister}
            disabled={isRegistering}
          >
            {isRegistering ? "Signing up..." : "Sign up"}
          </Button>
        </ModalFooter>
      </BSModal>
    </>
  );
}
