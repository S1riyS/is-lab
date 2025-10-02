import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreateTicketMutation, useDeleteTicketMutation, useListTicketsQuery, useUpdateTicketMutation, TicketDto } from '../api/ticketsApi';
import Modal from 'src/modules/common/components/Modal';

export default function TicketsPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListTicketsQuery({ page, size, search: search || undefined });
    const [createTicket] = useCreateTicketMutation();
    const [updateTicket] = useUpdateTicketMutation();
    const [deleteTicket] = useDeleteTicketMutation();

    const columns: Column<TicketDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'price', header: 'Price' },
        { key: 'comment', header: 'Comment' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | TicketDto>(null);
    const [createForm, setCreateForm] = useState({ name: '', price: 0, comment: '' });
    const [editForm, setEditForm] = useState({ name: '', price: 0, comment: '' });

    async function submitCreate() {
        try {
            await createTicket({ name: createForm.name, price: Number(createForm.price), comment: createForm.comment || undefined }).unwrap();
            setShowCreate(false);
            setCreateForm({ name: '', price: 0, comment: '' });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: TicketDto) {
        setShowEdit(row);
        setEditForm({ name: row.name, price: row.price, comment: row.comment ?? '' });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updateTicket({ id: showEdit.id, body: { name: editForm.name, price: Number(editForm.price), comment: editForm.comment || undefined } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: TicketDto) {
        if (!confirm(`Delete ticket ${row.id}?`)) return;
        try {
            await deleteTicket(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div style={{ display: 'grid', gap: 12 }}>
            <h2>Tickets</h2>
            <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button onClick={() => setPage(0)}>Search</button>
                <button onClick={() => setShowCreate(true)}>Create</button>
            </div>
            {isLoading && <div>Loading...</div>}
            {data && (
                <>
                    <CrudTable data={data.content} columns={columns} onEdit={openEdit} onDelete={handleDelete} />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</button>
                        <span>
                            Page {data.number + 1} / {data.totalPages}
                        </span>
                        <button disabled={data.number + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
                    </div>
                </>
            )}

            {showCreate && (
                <Modal title="Create ticket" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Price</label>
                            <input type="number" className="form-control" value={createForm.price} onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Comment</label>
                            <input className="form-control" value={createForm.comment} onChange={(e) => setCreateForm({ ...createForm, comment: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit ticket #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Name</label>
                            <input className="form-control" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Price</label>
                            <input type="number" className="form-control" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Comment</label>
                            <input className="form-control" value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




