import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import Modal from 'src/modules/common/components/Modal';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreateLocationMutation, useDeleteLocationMutation, useListLocationsQuery, useUpdateLocationMutation } from '../api/locationsApi';
import type { LocationDto } from '../api/types';

export default function LocationsPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListLocationsQuery({ page, size, search: search || undefined });
    const [createLocation] = useCreateLocationMutation();
    const [updateLocation] = useUpdateLocationMutation();
    const [deleteLocation] = useDeleteLocationMutation();

    const columns: Column<LocationDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'x', header: 'X' },
        { key: 'y', header: 'Y' },
        { key: 'z', header: 'Z' },
        { key: 'name', header: 'Name' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | LocationDto>(null);
    const [createForm, setCreateForm] = useState({ x: 0 as number | null, y: 0, z: 0, name: '' });
    const [editForm, setEditForm] = useState({ x: 0 as number | null, y: 0, z: 0, name: '' });

    async function submitCreate() {
        try {
            await createLocation({ x: createForm.x ?? undefined, y: Number(createForm.y), z: Number(createForm.z), name: createForm.name || undefined }).unwrap();
            setShowCreate(false);
            setCreateForm({ x: 0, y: 0, z: 0, name: '' });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: LocationDto) {
        setShowEdit(row);
        setEditForm({ x: row.x ?? 0, y: row.y, z: row.z, name: row.name ?? '' });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updateLocation({ id: showEdit.id, body: { x: editForm.x ?? undefined, y: Number(editForm.y), z: Number(editForm.z), name: editForm.name || undefined } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: LocationDto) {
        if (!confirm(`Delete location ${row.id}?`)) return;
        try {
            await deleteLocation(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div className="vstack gap-3">
            <h2>Locations</h2>
            <div className="d-flex gap-2">
                <input className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <Modal title="Create location" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">X</label>
                            <input type="number" className="form-control" value={createForm.x ?? 0} onChange={(e) => setCreateForm({ ...createForm, x: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Y</label>
                            <input type="number" className="form-control" value={createForm.y} onChange={(e) => setCreateForm({ ...createForm, y: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Z</label>
                            <input type="number" className="form-control" value={createForm.z} onChange={(e) => setCreateForm({ ...createForm, z: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit location #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">X</label>
                            <input type="number" className="form-control" value={editForm.x ?? 0} onChange={(e) => setEditForm({ ...editForm, x: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Y</label>
                            <input type="number" className="form-control" value={editForm.y} onChange={(e) => setEditForm({ ...editForm, y: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Z</label>
                            <input type="number" className="form-control" value={editForm.z} onChange={(e) => setEditForm({ ...editForm, z: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




