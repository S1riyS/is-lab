import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import Modal from 'src/modules/common/components/Modal';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreateVenueMutation, useDeleteVenueMutation, useListVenuesQuery, useUpdateVenueMutation } from '../api/venuesApi';
import type { VenueDto, VenueType } from '../api/types';

export default function VenuesPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListVenuesQuery({ page, size, search: search || undefined });
    const [createVenue] = useCreateVenueMutation();
    const [updateVenue] = useUpdateVenueMutation();
    const [deleteVenue] = useDeleteVenueMutation();

    const columns: Column<VenueDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'capacity', header: 'Capacity' },
        { key: 'type', header: 'Type' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | VenueDto>(null);
    const [createForm, setCreateForm] = useState({ name: '', capacity: 0, type: '' as VenueType });
    const [editForm, setEditForm] = useState({ name: '', capacity: 0, type: '' as VenueType });

    async function submitCreate() {
        try {
            await createVenue({ name: createForm.name, capacity: Number(createForm.capacity), type: createForm.type }).unwrap();
            setShowCreate(false);
            setCreateForm({ name: '', capacity: 0, type: '' as VenueType });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: VenueDto) {
        setShowEdit(row);
        setEditForm({ name: row.name, capacity: row.capacity, type: row.type });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updateVenue({ id: showEdit.id, body: { name: editForm.name, capacity: Number(editForm.capacity), type: editForm.type } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: VenueDto) {
        if (!confirm(`Delete venue ${row.id}?`)) return;
        try {
            await deleteVenue(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div className="vstack gap-3">
            <h2>Venues</h2>
            <div className="d-flex gap-2">
                <input className="form-control" placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <Modal title="Create venue" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Capacity</label>
                            <input type="number" className="form-control" value={createForm.capacity} onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Type</label>
                            <input className="form-control" value={createForm.type} onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as VenueType })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit venue #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Capacity</label>
                            <input type="number" className="form-control" value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Type</label>
                            <input className="form-control" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value as VenueType })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




