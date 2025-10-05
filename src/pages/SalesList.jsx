import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteClientMutation, useGetAllClientsQuery } from '../store/api/salesApi';
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
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import Loader from '../components/Loader';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const SalesList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCounts, setTotalCounts] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [columnConfigOpen, setColumnConfigOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    phone: true,
    address: !isMobile,
    architect: !isMobile,
    architectPhone: !isMobile,
    createdDate: !isMobile,
  });
  const { data: salesData, isLoading } = useGetAllClientsQuery({
    page: page + 1,
    page_size: rowsPerPage,
    search: debouncedSearchTerm,
  });
  const [deleteClient, { isLoadingDelete }] = useDeleteClientMutation();
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  // Use API data
  useEffect(() => {
    if (salesData?.data) {
      setFilteredSales(salesData?.data?.results);
      setTotalCounts(salesData?.data?.total_count);
    } else {
      setFilteredSales([]);
    }
  }, [salesData]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Debouncing will handle the API call automatically
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/view-sale/${id}`);
  };

  const handleDelete = (id) => {
    // Show confirmation dialog
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      const response = await deleteClient(clientToDelete);
      if (response?.data?.success || response?.data) {
        toast.success(response?.message || "Client Removed Successfully.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete client entry");
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleColumnConfigClose = () => {
    setColumnConfigOpen(false);
  };

  // Update visible columns when screen size changes
  useEffect(() => {
    setVisibleColumns({
      name: true,
      phone: true,
      address: !isMobile,
      architect: !isMobile,
      architectPhone: !isMobile,
      createdDate: !isMobile,
    });
  }, [isMobile]);

  return (
    <Box>
      <Fade in timeout={800}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: isMobile ? 1.5 : 2,
            mb: isMobile ? 2 : 4,
            position: "relative",
          }}
        >
          <TextField
            placeholder={
              isMobile
                ? "Search clients..."
                : "Search selections by client name, phone, address, or architect..."
            }
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
              maxWidth: "sm",
              "& .MuiOutlinedInput-root": {
                borderRadius: isMobile ? 2 : 3,
                backgroundColor: theme.palette.background.paper,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  transform: isMobile ? "none" : "scale(1.01)",
                },
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Zoom in timeout={1000}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create-sale")}
                sx={{
                  height: isMobile ? 40 : 54,
                  px: isMobile ? 2 : 4,
                  flex: 4,
                  borderRadius: isMobile ? 2 : 3,
                  textTransform: "none",
                  fontSize: isMobile ? "0.875rem" : "1.1rem",
                  fontWeight: 600,
                  boxShadow: theme.shadows[4],
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: isMobile ? "none" : "translateY(-2px)",
                    boxShadow: isMobile ? theme.shadows[4] : theme.shadows[8],
                  },
                  "&:active": {
                    transform: isMobile ? "none" : "translateY(1px)",
                  },
                }}
              >
                Create Selection
              </Button>
            </Zoom>
            {isMobile && (
              <Tooltip title="Configure Columns" arrow>
                <IconButton
                  onClick={() => setColumnConfigOpen(true)}
                  sx={{
                    height: 40,
                    width: 40,
                    borderRadius: 2,
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      boxShadow: theme.shadows[2],
                    },
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Fade>

      {isLoading ? (
        <Loader message="Loading client data..." />
      ) : filteredSales.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 3 : 6,
            textAlign: "center",
            borderRadius: isMobile ? 2 : 3,
            border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.02
            )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: isMobile ? 30 : 40,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 1,
              }}
            >
              {searchTerm ? "No Results Found" : "No Client Data Available"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 400,
                lineHeight: 1.6,
              }}
            >
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all clients."
                : "Get started by creating your first client selection to manage your projects effectively."}
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: isMobile ? 2 : 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              overflow: "hidden",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: isMobile ? "none" : theme.shadows[2],
              },
            }}
          >
            <TableContainer
              sx={{
                maxHeight: isMobile ? "calc(100vh - 200px)" : "none",
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  minWidth: isMobile ? "" : 650,
                  // tableLayout: "fixed",
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.02),
                      "& th": {
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "0.95rem",
                        borderBottom: `2px solid ${theme.palette.grey[200]}`,
                      },
                    }}
                  >
                    {visibleColumns.name && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 150 : "auto",
                        }}
                      >
                        Client Name
                      </TableCell>
                    )}
                    {visibleColumns.phone && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 120 : "auto",
                        }}
                      >
                        Phone
                      </TableCell>
                    )}
                    {visibleColumns.address && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 150 : "auto",
                        }}
                      >
                        Address
                      </TableCell>
                    )}
                    {visibleColumns.architect && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 150 : "auto",
                        }}
                      >
                        Architect
                      </TableCell>
                    )}
                    {visibleColumns.architectPhone && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 120 : "auto",
                        }}
                      >
                        Architect Phone
                      </TableCell>
                    )}
                    {visibleColumns.createdDate && (
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: isMobile ? 150 : "auto",
                        }}
                      >
                        Created Date
                      </TableCell>
                    )}
                    <TableCell
                      align="right"
                      sx={{
                        width: 80,
                        pr: isMobile ? 2 : 3,
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                        zIndex: 10,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSales?.map((client) => (
                    <TableRow
                      key={client.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.02
                          ),
                        },
                      }}
                    >
                      {visibleColumns.name && (
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ width: isMobile ? "20%" : "auto" }}
                        >
                          <Typography
                            variant={isMobile ? "body2" : "body1"}
                            sx={{
                              fontWeight: 500,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.name}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.phone && (
                        <TableCell sx={{ width: isMobile ? "15%" : "auto" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.phone}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.address && (
                        <TableCell sx={{ width: isMobile ? "20%" : "auto" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.address || "-"}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.architect && (
                        <TableCell sx={{ width: isMobile ? "15%" : "auto" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.arc_name || "-"}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.architectPhone && (
                        <TableCell sx={{ width: isMobile ? "15%" : "auto" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.arc_phone || "-"}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.createdDate && (
                        <TableCell sx={{ width: isMobile ? "15%" : "auto" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: isMobile ? "0.75rem" : "0.875rem",
                            }}
                          >
                            {formatDate(client.created_at)}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell
                        align="right"
                        sx={{
                          width: isMobile ? 60 : 160,
                          pr: isMobile ? 0.5 : 3,
                          position: "sticky",
                          right: 0,
                          backgroundColor: theme.palette.background.paper,
                          zIndex: 5,
                        }}
                      >
                        <ButtonGroup
                          variant="outlined"
                          size="small"
                          sx={{
                            gap: 1,
                            "& .MuiButton-root": {
                              minWidth: isMobile ? "30px" : "36px",
                              height: isMobile ? "30px" : "36px",
                              padding: 0,
                              borderRadius: isMobile
                                ? "6px !important"
                                : "8px !important",
                              border: `1px solid ${theme.palette.grey[200]}`,
                              "&:hover": {
                                border: `1px solid ${theme.palette.grey[300]}`,
                              },
                            },
                          }}
                        >
                          <Tooltip title="View Details" arrow>
                            <Button
                              onClick={() => handleViewDetails(client.id)}
                              sx={{
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.05
                                  ),
                                },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <Button
                              onClick={() => handleDelete(client.id)}
                              sx={{
                                color: theme.palette.error.main,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.05
                                  ),
                                },
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
                backgroundColor: alpha(theme.palette.primary.main, 0.01),
              }}
            >
              <TablePagination
                rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
                component="div"
                count={totalCounts}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                  ".MuiTablePagination-displayedRows": {
                    fontWeight: 500,
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                  ".MuiTablePagination-selectLabel": {
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  },
                }}
              />
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this client? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isLoadingDelete}
          >
            {isLoadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Column Configuration Dialog */}
      <Dialog
        open={columnConfigOpen}
        onClose={handleColumnConfigClose}
        aria-labelledby="column-config-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          id="column-config-dialog-title"
          sx={{
            pb: 1,
            fontSize: "1.1rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Configure Columns
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              { key: "name", label: "Client Name" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
              { key: "architect", label: "Architect" },
              { key: "architectPhone", label: "Architect Phone" },
              { key: "createdDate", label: "Created Date" },
            ].map((column) => (
              <Box
                key={column.key}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                  border: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
                  borderRadius: 1,
                  backgroundColor: visibleColumns[column.key]
                    ? alpha(theme.palette.primary.main, 0.05)
                    : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    flex: 1,
                  }}
                >
                  {column.label}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleColumnToggle(column.key)}
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: visibleColumns[column.key]
                      ? theme.palette.primary.main
                      : alpha(theme.palette.grey[300], 0.3),
                    color: visibleColumns[column.key]
                      ? "white"
                      : theme.palette.grey[600],
                    border: `1px solid ${
                      visibleColumns[column.key]
                        ? theme.palette.primary.main
                        : alpha(theme.palette.grey[300], 0.5)
                    }`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: visibleColumns[column.key]
                        ? theme.palette.primary.dark
                        : alpha(theme.palette.grey[400], 0.3),
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {visibleColumns[column.key] ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <CloseIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleColumnConfigClose}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesList;
