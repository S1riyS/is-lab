// src/modules/locations/LocationsPage.tsx
import CrudPage from 'src/modules/common/components/CrudPage';
import {
    useCreateLocationMutation,
    useDeleteLocationMutation,
    useListLocationsQuery,
    useUpdateLocationMutation,
} from '../api/locationsApi';
import type { LocationDto } from '../api/types';

const locationsConfig = {
    entityName: 'Location',
    useListQuery: useListLocationsQuery,
    useCreateMutation: useCreateLocationMutation,
    useUpdateMutation: useUpdateLocationMutation,
    useDeleteMutation: useDeleteLocationMutation,
    columns: [
        { key: 'id', header: 'ID' },
        { key: 'x', header: 'X' },
        { key: 'y', header: 'Y' },
        { key: 'z', header: 'Z' },
        { key: 'name', header: 'Name' },
    ],
    formFields: [
        { key: 'x', label: 'X', type: 'number' },
        { key: 'y', label: 'Y', type: 'number' },
        { key: 'z', label: 'Z', type: 'number' },
        { key: 'name', label: 'Name', type: 'text' },
    ],
};

export default function LocationsPage() {
    return <CrudPage<LocationDto> config={locationsConfig} />;
}