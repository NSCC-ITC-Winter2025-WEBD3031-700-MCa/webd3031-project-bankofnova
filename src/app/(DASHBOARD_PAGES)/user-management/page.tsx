'use client';
import { useEffect, useState } from 'react';
import PageContainer from '../components/container/PageContainer';
import { useSession } from 'next-auth/react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, CircularProgress, TablePagination, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  role: string;
}

const UsersPage = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user/AllUsers') // Updated API route
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to fetch users');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;

    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedUserId }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setUsers(users.filter(user => user.id !== selectedUserId));
      } else {
        setError(result.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }

    // Close dialog after deletion
    setOpenDialog(false);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setOpenDialog(true); // Open confirmation dialog
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page is changed
  };

  // Paginate users
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <PageContainer title="Users" description="Manage user accounts">
      <Typography variant="h5" gutterBottom sx={{ color: '#333' }}> {/* Adjust text color */}
        Manage Users
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{
            maxWidth: '100%', margin: 'auto', boxShadow: 3, overflowX: 'auto', backgroundColor: '#fafafa'
          }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: '#2C3E50' }}> {/* Primary color for header */}
                <TableRow>
                  <TableCell sx={{ color: '#ECF0F1' }}><b>ID</b></TableCell> {/* Header text color */}
                  <TableCell sx={{ color: '#ECF0F1' }}><b>Name</b></TableCell>
                  <TableCell sx={{ color: '#ECF0F1' }}><b>Email</b></TableCell>
                  <TableCell sx={{ color: '#ECF0F1' }}><b>Registered At</b></TableCell>
                  <TableCell sx={{ color: '#ECF0F1' }}><b>Role</b></TableCell>
                  <TableCell sx={{ color: '#ECF0F1' }}><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map(user => (
                  <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#BDC3C7' } }}> {/* Hover effect */}
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                    <TableCell
                      sx={{
                        color: user.role === 'admin' ? '#E74C3C' : '#3498DB', // Red for Admin, Blue for User
                        fontWeight: 'bold'
                      }}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClick(user.id)} // Open confirmation dialog
                        sx={{ backgroundColor: '#E74C3C', '&:hover': { backgroundColor: '#C0392B' } }} // Red button with hover effect
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-select': { backgroundColor: '#ECF0F1', color: '#2C3E50' }, // Background for select dropdown
              '.MuiTablePagination-actions': { color: '#2C3E50' } // Color for pagination actions
            }}
          />
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UsersPage;
