// src/modules/common/components/DetailPageActions.tsx
import { useState } from "react";

import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { MdDelete, MdModeEdit } from "react-icons/md";

import { showErrorToast } from "@common/api/baseApi";
import { FormFieldConfig } from "@common/types/formFieldConfig";

import { FormRenderer } from "./FormRenderer";

interface DetailPageActionsProps<T extends { id: number }> {
  entity: T;
  entityName: string;
  formFields: FormFieldConfig<T>[];
  useUpdateMutation: any;
  useDeleteMutation: any;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  refetch?: () => void;
}

export default function DetailPageActions<T extends { id: number }>({
  entity,
  entityName,
  formFields,
  useUpdateMutation,
  useDeleteMutation,
  onUpdateSuccess,
  onDeleteSuccess,
  refetch,
}: DetailPageActionsProps<T>) {
  const [update] = useUpdateMutation();
  const [remove] = useDeleteMutation();

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editForm, setEditForm] = useState(entity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = async () => {
    setIsUpdating(true);
    try {
      await update({ id: entity.id, body: editForm }).unwrap();
      setShowEdit(false);
      refetch?.(); // Refetch the data to show updated values
      onUpdateSuccess?.();
    } catch (e) {
      showErrorToast(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await remove(entity.id).unwrap();
      setShowDelete(false);
      onDeleteSuccess?.();
    } catch (e) {
      showErrorToast(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const setEditFormWrapper = (form: Partial<T>) => {
    setEditForm((prev) => ({ ...prev, ...form }));
  };

  return (
    <>
      <div className="d-flex gap-2 justify-content-end">
        <Button
          variant="outline-primary"
          onClick={() => {
            setShowEdit(true);
            setEditForm(entity);
          }}
        >
          {/* Edit {entityName} */}
          <MdModeEdit /> Edit
        </Button>
        <Button variant="outline-danger" onClick={() => setShowDelete(true)}>
          {/* Delete {entityName} */}
          <MdDelete /> Delete
        </Button>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        centered
        size="lg"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            Edit {entityName} #{entity.id}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormRenderer
            formFields={formFields}
            form={editForm}
            setForm={setEditFormWrapper}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowEdit(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <ModalHeader closeButton>
          <ModalTitle>Confirm Delete</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Alert variant="warning">
            Are you sure you want to delete {entityName} #{entity.id}? This
            action cannot be undone.
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
