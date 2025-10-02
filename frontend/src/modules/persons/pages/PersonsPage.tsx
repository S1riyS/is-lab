import { useState } from 'react';
import CrudTable, { Column } from 'src/modules/common/components/CrudTable';
import Modal from 'src/modules/common/components/Modal';
import { parseError } from 'src/modules/common/api/baseApi';
import { useCreatePersonMutation, useDeletePersonMutation, useListPersonsQuery, useUpdatePersonMutation } from '../api/personsApi';
import type { PersonDto, Color, Country } from '../api/types';

export default function PersonsPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState('');
    const { data, isLoading, refetch } = useListPersonsQuery({ page, size, search: search || undefined });
    const [createPerson] = useCreatePersonMutation();
    const [updatePerson] = useUpdatePersonMutation();
    const [deletePerson] = useDeletePersonMutation();

    const columns: Column<PersonDto>[] = [
        { key: 'id', header: 'ID' },
        { key: 'eyeColor', header: 'Eye' },
        { key: 'hairColor', header: 'Hair' },
        { key: 'locationId', header: 'Location' },
        { key: 'passportID', header: 'Passport' },
        { key: 'nationality', header: 'Nationality' },
    ];

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState<null | PersonDto>(null);
    const [createForm, setCreateForm] = useState({ eyeColor: '' as Color, hairColor: '' as Color, locationId: 0, passportID: '', nationality: '' as Country });
    const [editForm, setEditForm] = useState({ eyeColor: '' as Color, hairColor: '' as Color, locationId: 0, passportID: '', nationality: '' as Country });

    async function submitCreate() {
        try {
            await createPerson({ ...createForm, locationId: Number(createForm.locationId) }).unwrap();
            setShowCreate(false);
            setCreateForm({ eyeColor: '' as Color, hairColor: '' as Color, locationId: 0, passportID: '', nationality: '' as Country });
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    function openEdit(row: PersonDto) {
        setShowEdit(row);
        setEditForm({ eyeColor: row.eyeColor ?? ('' as Color), hairColor: row.hairColor ?? ('' as Color), locationId: row.locationId, passportID: row.passportID, nationality: row.nationality });
    }

    async function submitEdit() {
        if (!showEdit) return;
        try {
            await updatePerson({ id: showEdit.id, body: { ...editForm, locationId: Number(editForm.locationId) } }).unwrap();
            setShowEdit(null);
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    async function handleDelete(row: PersonDto) {
        if (!confirm(`Delete person ${row.id}?`)) return;
        try {
            await deletePerson(row.id).unwrap();
            refetch();
        } catch (e) {
            alert(parseError(e));
        }
    }

    return (
        <div className="vstack gap-3">
            <h2>Persons</h2>
            <div className="d-flex gap-2">
                <input className="form-control" placeholder="Search by passport" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                <Modal title="Create person" onClose={() => setShowCreate(false)} onSubmit={submitCreate}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Eye color</label>
                            <input className="form-control" value={createForm.eyeColor as string} onChange={(e) => setCreateForm({ ...createForm, eyeColor: e.target.value as Color })} />
                        </div>
                        <div>
                            <label className="form-label">Hair color</label>
                            <input className="form-control" value={createForm.hairColor as string} onChange={(e) => setCreateForm({ ...createForm, hairColor: e.target.value as Color })} />
                        </div>
                        <div>
                            <label className="form-label">Location ID</label>
                            <input type="number" className="form-control" value={createForm.locationId} onChange={(e) => setCreateForm({ ...createForm, locationId: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Passport ID</label>
                            <input className="form-control" value={createForm.passportID} onChange={(e) => setCreateForm({ ...createForm, passportID: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Nationality</label>
                            <input className="form-control" value={createForm.nationality as string} onChange={(e) => setCreateForm({ ...createForm, nationality: e.target.value as Country })} />
                        </div>
                    </form>
                </Modal>
            )}

            {showEdit && (
                <Modal title={`Edit person #${showEdit.id}`} onClose={() => setShowEdit(null)} onSubmit={submitEdit}>
                    <form className="vstack gap-3">
                        <div>
                            <label className="form-label">Eye color</label>
                            <input className="form-control" value={editForm.eyeColor as string} onChange={(e) => setEditForm({ ...editForm, eyeColor: e.target.value as Color })} />
                        </div>
                        <div>
                            <label className="form-label">Hair color</label>
                            <input className="form-control" value={editForm.hairColor as string} onChange={(e) => setEditForm({ ...editForm, hairColor: e.target.value as Color })} />
                        </div>
                        <div>
                            <label className="form-label">Location ID</label>
                            <input type="number" className="form-control" value={editForm.locationId} onChange={(e) => setEditForm({ ...editForm, locationId: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="form-label">Passport ID</label>
                            <input className="form-control" value={editForm.passportID} onChange={(e) => setEditForm({ ...editForm, passportID: e.target.value })} />
                        </div>
                        <div>
                            <label className="form-label">Nationality</label>
                            <input className="form-control" value={editForm.nationality as string} onChange={(e) => setEditForm({ ...editForm, nationality: e.target.value as Country })} />
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}




