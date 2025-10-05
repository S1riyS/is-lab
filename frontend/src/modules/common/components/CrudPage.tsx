// src/modules/common/components/CrudPage.tsx
import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Row,
  Stack,
} from "react-bootstrap";
import { IoIosAddCircle, IoMdCreate } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { showErrorToast } from "@common/api/baseApi";
import { CrudConfig } from "@common/types/crudConfig";

import CrudTable from "./CrudTable";
import { FormRenderer } from "./FormRenderer";

interface CrudPageProps<T extends { id: number }> {
  config: CrudConfig<T>;
}

export default function CrudPage<T extends { id: number }>({
  config,
}: CrudPageProps<T>) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortParam = sortColumn ? `${sortColumn},${sortDirection}` : undefined;

  const { data, isLoading, refetch } = config.useListQuery({
    page,
    size,
    search: search || undefined,
    sort: sortParam,
  });

  const [create] = config.useCreateMutation();
  const [update] = config.useUpdateMutation();
  const [remove] = config.useDeleteMutation();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<T | null>(null);

  // Initialize empty form based on formFields
  const emptyForm = Object.fromEntries(
    config.formFields.map((field) => [
      field.key,
      field.type === "number" ? null : "",
    ]),
  ) as Record<keyof T, any>;

  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleCreateSubmit = async () => {
    try {
      await create(createForm).unwrap();
      setShowCreate(false);
      setCreateForm(emptyForm);
      refetch();
    } catch (e) {
      showErrorToast(e);
    }
  };

  const handleEditSubmit = async () => {
    if (!showEdit) return;
    try {
      await update({ id: showEdit.id, body: editForm }).unwrap();
      setShowEdit(null);
      refetch();
    } catch (e) {
      showErrorToast(e);
    }
  };

  const handleDelete = async (row: T) => {
    if (!confirm(`Delete ${config.entityName.toLowerCase()} ${row.id}?`))
      return;
    try {
      await remove(row.id).unwrap();
      refetch();
    } catch (e) {
      showErrorToast(e);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const setCreateFormWrapper = (form: Partial<T>) => {
    setCreateForm((prev) => ({ ...prev, ...form }));
  };

  const setEditFormWrapper = (form: Partial<T>) => {
    setEditForm((prev) => ({ ...prev, ...form }));
  };

  const handleRowClick = (row: T) => {
    const entityName = config.entityName.toLowerCase();
    // Handle special case for "coordinates" which is already plural
    const routeName =
      entityName === "coordinates" ? entityName : `${entityName}s`;
    navigate(`/${routeName}/${row.id}`);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    setPage(0); // Reset to first page when sorting
  };

  return (
    <Stack gap={3}>
      <h2>{config.entityName}s</h2>

      <Row className="mb-3 align-items-center">
        <Col>
          <InputGroup>
            <Form.Control
              placeholder={`Search ${config.entityName.toLowerCase()}s...`}
              value={search}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && refetch()}
            />
            <Button variant="outline-secondary" onClick={() => refetch()}>
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            <IoMdCreate /> Create
          </Button>
        </Col>
      </Row>

      {isLoading && <Alert variant="info">Loading...</Alert>}
      {data && (
        <>
          <CrudTable
            data={data.content}
            columns={config.columns}
            onEdit={(row) => {
              setShowEdit(row);
              setEditForm(row);
            }}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
            clickableRows={true}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <Stack direction="horizontal" gap={2} className="align-items-center">
            <Button
              variant="outline-secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <span>
              Page {data.number + 1} / {data.totalPages}
            </span>
            <Button
              variant="outline-secondary"
              disabled={data.number + 1 >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Stack>
        </>
      )}

      {/* Create Bootstrap Modal */}
      <Modal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        centered
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>Create {config.entityName}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormRenderer
            formFields={config.formFields}
            form={createForm}
            setForm={setCreateFormWrapper}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateSubmit}>
            Create
          </Button>
        </ModalFooter>
      </Modal>

      {/* Edit Bootstrap Modal */}
      <Modal
        show={!!showEdit}
        onHide={() => setShowEdit(null)}
        centered
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            Edit {config.entityName} #{showEdit?.id}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormRenderer
            formFields={config.formFields}
            form={editForm}
            setForm={setEditFormWrapper}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowEdit(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </Stack>
  );
}
