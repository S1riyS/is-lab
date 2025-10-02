// src/modules/common/components/CrudPage.tsx
import { useState, useEffect } from 'react';
import {
    Stack,
    Button,
    Form,
    InputGroup,
    Alert,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
} from 'react-bootstrap';
import CrudTable from './CrudTable';
import { parseError } from '../api/baseApi';
import { CrudConfig } from '../types/crudConfig';
import { FormRenderer } from './FormRenderer';

interface CrudPageProps<T extends { id: number }> {
    config: CrudConfig<T>;
}

export default function CrudPage<T extends { id: number }>({ config }: CrudPageProps<T>) {
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [search, setSearch] = useState('');
    const {
        data,
        isLoading,
        refetch,
    } = config.useListQuery({ page, size, search: search || undefined });

    const [create] = config.useCreateMutation();
    const [update] = config.useUpdateMutation();
    const [remove] = config.useDeleteMutation();

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<T | null>(null);

    // Initialize empty form based on formFields
    const emptyForm = Object.fromEntries(
        config.formFields.map((field) => [
            field.key,
            field.type === 'number' ? null : '',
        ])
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
            alert(parseError(e));
        }
    };

    const handleEditSubmit = async () => {
        if (!showEdit) return;
        try {
            await update({ id: showEdit.id, body: editForm }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    };

    const handleDelete = async (row: T) => {
        if (!confirm(`Delete ${config.entityName.toLowerCase()} ${row.id}?`)) return;
        try {
            await remove(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <Stack gap={3}>
            <h2>{config.entityName}s</h2>

            <Stack direction="horizontal" gap={2} className="flex-wrap">
                <InputGroup>
                    <Form.Control
                        placeholder={`Search ${config.entityName.toLowerCase()}s...`}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Button variant="outline-secondary" onClick={() => refetch()}>
                        Search
                    </Button>
                </InputGroup>
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                    Create
                </Button>
            </Stack>

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
                    />
                    <Stack direction="horizontal" gap={2} className="align-items-center">
                        <Button
                            variant="outline-secondary"
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                            Prev
                        </Button>
                        <span>Page {data.number + 1} / {data.totalPages}</span>
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
            <Modal show={showCreate} onHide={() => setShowCreate(false)} centered>
                <ModalHeader closeButton>
                    <ModalTitle>Create {config.entityName}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormRenderer
                        formFields={config.formFields}
                        form={createForm}
                        setForm={setCreateForm}
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
                        setForm={setEditForm}
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