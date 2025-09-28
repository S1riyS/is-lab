import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import {
    TicketType,
    Color,
    Country,
    VenueType,
    UserRole
} from '../types';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any) => React.ReactNode;
    type?: 'text' | 'number' | 'select' | 'date' | 'enum';
    options?: { value: any; label: string }[];
}

interface GenericTableProps {
    title: string;
    columns: Column[];
    data: any[];
    loading: boolean;
    error: string | null;
    onRefresh: () => void;
    onCreate: (data: any) => Promise<void>;
    onUpdate: (id: number, data: any) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    createDialogContent?: (data: any, setData: (data: any) => void) => React.ReactNode;
    updateDialogContent?: (data: any, setData: (data: any) => void) => React.ReactNode;
    // Pagination props
    totalElements?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (event: unknown, newPage: number) => void;
    onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showPagination?: boolean;
}

const GenericTable: React.FC<GenericTableProps> = ({
    title,
    columns,
    data,
    loading,
    error,
    onRefresh,
    onCreate,
    onUpdate,
    onDelete,
    createDialogContent,
    updateDialogContent,
    totalElements = data.length,
    page: externalPage,
    rowsPerPage: externalRowsPerPage,
    onPageChange: externalOnPageChange,
    onRowsPerPageChange: externalOnRowsPerPageChange,
    showPagination = true
}) => {
    const [internalPage, setInternalPage] = useState(0);
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(10);

    // Use external pagination if provided, otherwise use internal
    const page = externalPage !== undefined ? externalPage : internalPage;
    const rowsPerPage = externalRowsPerPage !== undefined ? externalRowsPerPage : internalRowsPerPage;
    const onPageChange = externalOnPageChange || ((event: unknown, newPage: number) => setInternalPage(newPage));
    const onRowsPerPageChange = externalOnRowsPerPageChange || ((event: React.ChangeEvent<HTMLInputElement>) => {
        setInternalRowsPerPage(parseInt(event.target.value, 10));
        setInternalPage(0);
    });
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    // Remove the old handlers since we now use the external ones

    const handleCreate = () => {
        setFormData({});
        setCreateDialogOpen(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({ ...item });
        setUpdateDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await onDelete(id);
                onRefresh();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleCreateSubmit = async () => {
        try {
            await onCreate(formData);
            setCreateDialogOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    const handleUpdateSubmit = async () => {
        try {
            await onUpdate(editingItem.id, formData);
            setUpdateDialogOpen(false);
            onRefresh();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const renderCellValue = (value: any, column: Column) => {
        if (value === null || value === undefined) return '-';

        if (column.format) {
            return column.format(value);
        }

        if (column.type === 'date' && value) {
            return new Date(value).toLocaleDateString();
        }

        if (column.type === 'enum' && column.options) {
            const option = column.options.find(opt => opt.value === value);
            return option ? option.label : value;
        }

        return value.toString();
    };

    const renderFormField = (column: Column, value: any, onChange: (value: any) => void) => {
        if (column.type === 'select' && column.options) {
            return (
                <TextField
                    select
                    fullWidth
                    label={column.label}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    margin="normal"
                >
                    {column.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            );
        }

        if (column.type === 'number') {
            return (
                <TextField
                    fullWidth
                    label={column.label}
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    margin="normal"
                />
            );
        }

        if (column.type === 'date') {
            return (
                <TextField
                    fullWidth
                    label={column.label}
                    type="datetime-local"
                    value={value ? new Date(value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => onChange(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            );
        }

        return (
            <TextField
                fullWidth
                label={column.label}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                margin="normal"
            />
        );
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{title}</Typography>
                <Box>
                    <IconButton onClick={onRefresh} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ ml: 1 }}
                    >
                        Add New
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.map((row) => (
                            <TableRow hover key={row.id}>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}>
                                        {renderCellValue(row[column.id], column)}
                                    </TableCell>
                                ))}
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleEdit(row)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(row.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {showPagination && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            )}

            {/* Create Dialog */}
            <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Create New {title}</DialogTitle>
                <DialogContent>
                    {createDialogContent ? (
                        createDialogContent(formData, setFormData)
                    ) : (
                        <Box sx={{ pt: 1 }}>
                            {columns
                                .filter(col => col.id !== 'id')
                                .map((column) => (
                                    <Box key={column.id}>
                                        {renderFormField(column, formData[column.id], (value) =>
                                            setFormData({ ...formData, [column.id]: value })
                                        )}
                                    </Box>
                                ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateSubmit} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit {title}</DialogTitle>
                <DialogContent>
                    {updateDialogContent ? (
                        updateDialogContent(formData, setFormData)
                    ) : (
                        <Box sx={{ pt: 1 }}>
                            {columns
                                .filter(col => col.id !== 'id')
                                .map((column) => (
                                    <Box key={column.id}>
                                        {renderFormField(column, formData[column.id], (value) =>
                                            setFormData({ ...formData, [column.id]: value })
                                        )}
                                    </Box>
                                ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateSubmit} variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default GenericTable;
