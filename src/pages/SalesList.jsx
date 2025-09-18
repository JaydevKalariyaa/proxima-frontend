import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllClientsQuery } from '../store/api/salesApi';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  useTheme,
  IconButton,
  Tooltip,
  useMediaQuery,
  Fade,
  Zoom,
  ButtonGroup,
  alpha
} from '@mui/material';
import Loader from '../components/Loader';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const SalesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: salesData, isLoading } = useGetAllClientsQuery();
  
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use API data
  useEffect(() => {
    if (salesData?.data) {
      setFilteredSales(salesData.data);
    } else {
      setFilteredSales([]);
    }
  }, [salesData]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      // If search is empty, show all data
      setFilteredSales(salesData?.data || []);
      return;
    }
    
    const dataToFilter = salesData?.data || [];
    const filtered = dataToFilter.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      (client.address && client.address.toLowerCase().includes(term)) ||
      (client.arc_name && client.arc_name.toLowerCase().includes(term)) ||
      (client.arc_phone && client.arc_phone.includes(term))
    );
    
    setFilteredSales(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/view-sale/${id}`);
  };

 

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log('Delete:', id);
  };

  return (
    <Box>
          <Fade in timeout={800}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 4,
              position: 'relative'
            }}>
          <TextField
                placeholder={isMobile ? "Search clients..." : "Search by client name, phone, address, or architect..."}
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                      <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
                sx={{ 
                  flex: 1,
                  maxWidth: 'sm',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      '& fieldset': {
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '&.Mui-focused': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      transform: 'scale(1.01)',
                    }
                  }
                }}
              />
              <Zoom in timeout={1000}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/client-info')}
                  sx={{
                    height: 54,
                    px: 4,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: theme.shadows[4],
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    }
                  }}
                >
                  Add New Client
                </Button>
              </Zoom>
            </Box>
          </Fade>

          {isLoading ? (
            <Loader message="Loading client data..." />
        ) : filteredSales.length === 0 ? (
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}`
              }}
            >
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No clients found matching your search' : 'No client details available'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-sale')}
                  sx={{ mt: 2, textTransform: 'none' }}
              >
                Add Your First Client
              </Button>
            )}
          </Paper>
        ) : (
            <Fade in timeout={1000}>
              <Paper 
                elevation={0}
                sx={{ 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: theme.shadows[2]
                  }
                }}
              >
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.02),
                          '& th': {
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: '0.95rem',
                            borderBottom: `2px solid ${theme.palette.grey[200]}`
                          }
                        }}
                      >
                        <TableCell>Client Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Architect</TableCell>
                        <TableCell>Architect Phone</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell align="right" sx={{ width: 160, pr: 3 }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(rowsPerPage > 0
                        ? filteredSales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : filteredSales
                      ).map((client) => (
                        <TableRow
                          key={client.id}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.02)
                            }
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {client.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {client.phone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {client.address || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {client.arc_name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {client.arc_phone || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              {formatDate(client.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <ButtonGroup 
                              variant="outlined" 
                              size="small"
                              sx={{ 
                                gap: 1,
                                '& .MuiButton-root': {
                                  minWidth: '36px',
                                  height: '36px',
                                  padding: 0,
                                  borderRadius: '8px !important',
                                  border: `1px solid ${theme.palette.grey[200]}`,
                                  '&:hover': {
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                  }
                                }
                              }}
                            >
                              <Tooltip title="View Details" arrow>
                                <Button
                                  onClick={() => handleViewDetails(client.id)}
                                  sx={{ 
                                    color: theme.palette.primary.main,
                                    '&:hover': { 
                                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    }
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Edit" arrow>
                                <Button
                                  onClick={() => handleViewDetails(client.id)}
                                  sx={{ 
                                    color: theme.palette.warning.main,
                                    '&:hover': { 
                                      backgroundColor: alpha(theme.palette.warning.main, 0.05),
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Delete" arrow>
                                <Button
                                  onClick={() => handleDelete(client.id)}
                                  sx={{ 
                                    color: theme.palette.error.main,
                                    '&:hover': { 
                                      backgroundColor: alpha(theme.palette.error.main, 0.05),
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </Button>
                              </Tooltip>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box
                  sx={{
                    borderTop: `1px solid ${theme.palette.grey[200]}`,
                    backgroundColor: alpha(theme.palette.primary.main, 0.01)
                  }}
                >
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredSales.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '.MuiTablePagination-select': {
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.paper
                      },
                      '.MuiTablePagination-displayedRows': {
                        fontWeight: 500
                      }
                    }}
                      />
                    </Box>
              </Paper>
            </Fade>
           
        )}
        </Box>
  );
};

export default SalesList;
