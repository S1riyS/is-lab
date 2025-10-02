import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import Modal from 'src/modules/common/components/Modal';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreateEventMutation, useDeleteEventMutation, useListEventsQuery, useUpdateEventMutation } from '../api/eventsApi';
import type { EventDto } from '../api/types';

export default function EventsPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListEventsQuery({ page, size, search: search || undefined });
    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();
    const [deleteEvent] = useDeleteEventMutation();

    const columns: Column<EventDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'date', header: 'Date' },
        { key: 'minAge', header: 'Min age' },
        { key: 'description', header: 'Description' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | EventDto>(null);
    const [createForm, setCreateForm] = useState({ name: '', date: '', minAge: 0, description: '' });
    const [editForm, setEditForm] = useState({ name: '', date: '', minAge: 0, description: '' });

    async function submitCreate() {
        try {
            await createEvent({ name: createForm.name, date: createForm.date || undefined, minAge: Number(createForm.minAge) || undefined, description: createForm.description }).unwrap();
            setShowCreate(false);
            setCreateForm({ name: '', date: '', minAge: 0, description: '' });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: EventDto) {
        setShowEdit(row);
        setEditForm({ name: row.name, date: row.date ?? '', minAge: Number(row.minAge ?? 0), description: row.description ?? '' });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updateEvent({ id: showEdit.id, body: { name: editForm.name, date: editForm.date || undefined, minAge: Number(editForm.minAge) || undefined, description: editForm.description } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: EventDto) {
        if (!confirm(`Delete event ${row.id}?`)) return;
        try {
            await deleteEvent(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div className="vstack gap-3">
            <h2>Events</h2>
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
                <Modal title="Create event" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Date (ISO)</label>
                            <input className="form-control" placeholder="2025-10-01T12:00:00Z" value={createForm.date} onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Min age</label>
                            <input type="number" className="form-control" value={createForm.minAge} onChange={(e) => setCreateForm({ ...createForm, minAge: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Description</label>
                            <textarea className="form-control" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit event #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Date (ISO)</label>
                            <input className="form-control" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Min age</label>
                            <input type="number" className="form-control" value={editForm.minAge} onChange={(e) => setEditForm({ ...editForm, minAge: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Description</label>
                            <textarea className="form-control" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




