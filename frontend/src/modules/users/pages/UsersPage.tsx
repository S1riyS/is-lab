import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import Modal from 'src/modules/common/components/Modal';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreateUserMutation, useDeleteUserMutation, useListUsersQuery, useUpdateUserMutation } from '../api/usersApi';
import type { UserDto, UserRole } from '../api/types';

export default function UsersPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListUsersQuery({ page, size, search: search || undefined });
    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const columns: Column<UserDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'username', header: 'Username' },
        { key: 'role', header: 'Role' },
        { key: 'createdAt', header: 'Created' },
        { key: 'isActive', header: 'Active' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | UserDto>(null);
    const [createForm, setCreateForm] = useState({ username: '', password: '', role: '' as UserRole });
    const [editForm, setEditForm] = useState({ username: '', password: '', role: '' as UserRole, isActive: true });

    async function submitCreate() {
        try {
            await createUser({ username: createForm.username, password: createForm.password, role: createForm.role }).unwrap();
            setShowCreate(false);
            setCreateForm({ username: '', password: '', role: '' as UserRole });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: UserDto) {
        setShowEdit(row);
        setEditForm({ username: row.username, password: '', role: row.role, isActive: row.isActive });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updateUser({ id: showEdit.id, body: { username: editForm.username, password: editForm.password || undefined, role: editForm.role, isActive: editForm.isActive } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: UserDto) {
        if (!confirm(`Delete user ${row.id}?`)) return;
        try {
            await deleteUser(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div className="vstack gap-3">
            <h2>Users</h2>
            <div className="d-flex gap-2">
                <input className="form-control" placeholder="Search by username" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="btn btn-outline-secondary" onClick={() => setPage(0)}>Search</button>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create</button>
            </div>
            {isLoading && <div>Loading...</div>}
            {data && (
                <>
                    <CrudTable data={data.content} columns={columns} onEdit={openEdit} onDelete={handleDelete} />
                    <div className="d-flex gap-2 align-items-center">
                        <button className="btn btn-outline-secondary" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
                        <span>Page {data.number + 1} / {data.totalPages}</span>
                        <button className="btn btn-outline-secondary" disabled={data.number + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                    </div>
                </>
            )}

            {showCreate && (
                <Modal title="Create user" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Username</label>
                            <input className="form-control" value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Role</label>
                            <input className="form-control" value={createForm.role as string} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit user #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Username</label>
                            <input className="form-control" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Password (optional)</label>
                            <input type="password" className="form-control" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Role</label>
                            <input className="form-control" value={editForm.role as string} onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })} />
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} id="activeCheck" />
                            <label className="form-check-label" htmlFor="activeCheck">Active</label>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




