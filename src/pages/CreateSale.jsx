import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Tooltip,
  Stack,
  Chip,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  calculatePricePerPiece,
  calculateTotalAmount,
  formatCurrency,
  generateId,
} from "../utils/calc";
import { useCreateSaleMutation } from "../store/api/salesApi";

const categories = [
  "Hardware",
  "Lamination & Highlighter",
  "Veneer",
  "Sofa & Curtains",
  "Modular",
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateSale = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [products, setProducts] = useState([]);
  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [columnConfigOpen, setColumnConfigOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    category: true,
    room: true,
    productName: true,
    code: !isMobile,
    sizeFinish: !isMobile,
    mrp: true,
    discount: !isMobile,
    pricePerProduct: !isMobile,
    quantity: true,
    total: true,
  });
  const [currentProduct, setCurrentProduct] = useState({
    id: "",
    category: categories[0], // Default to first category
    room: "",
    product_name: "",
    product_code: "",
    size_finish: "",
    mrp: "",
    discount_type: "percent",
    discount_value: "",
    quantity: "",
    price_per_piece: 0,
    total_amount: 0,
  });

  const handleOpenDialog = () => {
    // Use category from last product if exists, otherwise use first category
    const lastProduct = products[products.length - 1];
    setCurrentProduct({
      id: generateId(),
      category: lastProduct ? lastProduct.category : categories[0],
      room: lastProduct ? lastProduct.room : "",
      product_name: "",
      product_code: "",
      size_finish: "",
      mrp: "",
      discount_type: "percent",
      discount_value: "",
      quantity: "",
      price_per_piece: 0,
      total_amount: 0,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddProduct = () => {
    if (
      !currentProduct.product_name ||
      !currentProduct.mrp ||
      !currentProduct.quantity
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProducts((prev) => [...prev, currentProduct]);
    setOpenDialog(false);
    toast.success("Product added successfully");
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    toast.info("Product removed");
  };

  const calculateGrandTotal = () => {
    return products.reduce(
      (total, product) => total + (product.total_amount || 0),
      0
    );
  };

  const handleBack = () => {
    navigate("/sales");
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

  const handleSaveAndNext = async () => {
    if (products.length === 0) {
      toast.error("Please add at least one product");
      return;
    }

    const saleData = {
      status: "draft",
      items: products?.map((item) => ({
        product_name: item.product_name,
        product_code: item.product_code,
        size_finish: item.size_finish,
        discount_type: item.discount_type,
        discount_value: item.discount_value,
        quantity: item.quantity,
        category: item.category,
        room: item.room,
        mrp: item.mrp,
      })),
    };
    try {
      const response = await createSale(saleData);
      console.log(response);
      if (response?.data?.success) {
        navigate("/client-info", {
          state: {
            saleData: saleData,
            saleId: response.data.data.id,
          },
        });
      } else {
        toast.error("Error saving selection. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving selection. Please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {isCreating && <Loader />}
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,

          paddingBottom: "16px",

          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
          },
        }}
      >
        <Tooltip title="Back to Selections List" arrow>
          <IconButton
            onClick={handleBack}
            size="medium"
            sx={{
              color: theme.palette.primary.main,

              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: "translateX(-2px)",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: "1.25rem",

              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            Create New Selection
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* Add Product Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: isMobile ? 1 : 1.5,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              size={isMobile ? "small" : "medium"}
              sx={{
                textTransform: "none",
                height: isMobile ? 40 : "auto",
                px: isMobile ? 2 : 3,
                borderRadius: isMobile ? 2 : 3,
                fontSize: isMobile ? "0.875rem" : "1rem",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.primary.main,
                  0.25
                )}`,
                "&:hover": {
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.35
                  )}`,
                },
              }}
            >
              Add Product
            </Button>
          </Box>

          {/* Products Table */}
          {products.length === 0 ? (
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
                  <AddIcon
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
                  No Products Added Yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    maxWidth: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Start by adding your first product to create a selection and
                  manage your inventory effectively.
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                borderRadius: isMobile ? 2 : 3,
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.common.black,
                  0.05
                )}`,
              }}
            >
              <TableContainer
                sx={{
                  maxHeight: isMobile
                    ? "calc(100vh - 200px)"
                    : "calc(100vh - 305px)",
                  overflowX: "auto",
                }}
              >
                <Table stickyHeader sx={{ minWidth: isMobile ? "" : 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          bgcolor: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.08
                          )}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                          color: theme.palette.text.primary,
                          fontSize: isMobile ? "0.75rem" : "0.875rem",
                          borderBottom: `2px solid ${theme.palette.primary.main}`,
                          py: isMobile ? 1 : 2,
                          position: "sticky",
                          top: 0,
                          zIndex: 10,
                        },
                      }}
                    >
                      {visibleColumns.category && (
                        <TableCell
                          align="left"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 100 : "auto",
                          }}
                        >
                          Category
                        </TableCell>
                      )}
                      {visibleColumns.room && (
                        <TableCell
                          align="left"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 100 : "auto",
                          }}
                        >
                          Room
                        </TableCell>
                      )}
                      {visibleColumns.productName && (
                        <TableCell
                          align="left"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 150 : "auto",
                          }}
                        >
                          Product Name
                        </TableCell>
                      )}
                      {visibleColumns.code && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 80 : "auto",
                          }}
                        >
                          Code
                        </TableCell>
                      )}
                      {visibleColumns.sizeFinish && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 100 : "auto",
                          }}
                        >
                          Size/Finish
                        </TableCell>
                      )}
                      {visibleColumns.mrp && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 80 : "auto",
                          }}
                        >
                          MRP
                        </TableCell>
                      )}
                      {visibleColumns.discount && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 80 : "auto",
                          }}
                        >
                          Discount
                        </TableCell>
                      )}
                      {visibleColumns.pricePerProduct && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 100 : "auto",
                          }}
                        >
                          Price per Product
                        </TableCell>
                      )}
                      {visibleColumns.quantity && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 80 : "auto",
                          }}
                        >
                          Quantity
                        </TableCell>
                      )}
                      {visibleColumns.total && (
                        <TableCell
                          align="center"
                          sx={{
                            width: "auto",
                            minWidth: isMobile ? 80 : "auto",
                          }}
                        >
                          Total
                        </TableCell>
                      )}
                      <TableCell
                        align="center"
                        sx={{
                          width: isMobile ? 60 : 80,
                          pr: isMobile ? 1 : 2,
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
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            boxShadow: `0 2px 8px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          transition: "all 0.2s ease",
                          borderBottom: `1px solid ${alpha(
                            theme.palette.grey[200],
                            0.5
                          )}`,
                          "&:last-child": {
                            borderBottom: "none",
                          },
                        }}
                      >
                        {visibleColumns.category && (
                          <TableCell align="left">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: theme.palette.primary.main,
                                }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                  color: theme.palette.text.primary,
                                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                                }}
                              >
                                {product.category}
                              </Typography>
                            </Box>
                          </TableCell>
                        )}
                        {visibleColumns.room && (
                          <TableCell align="left">
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.primary,
                                fontStyle: product.room ? "normal" : "italic",
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              {product.room || "Not specified"}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.productName && (
                          <TableCell align="left">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                color: theme.palette.text.primary,
                                maxWidth: isMobile ? 150 : 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              {product.product_name}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.code && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontFamily: "monospace",
                                fontSize: isMobile ? "0.7rem" : "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {product.product_code || "-"}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.sizeFinish && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                                fontWeight: 500,
                              }}
                            >
                              {product.size_finish || "-"}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.mrp && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              {formatCurrency(product.mrp)}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.discount && (
                          <TableCell align="center">
                            <Chip
                              size="small"
                              label={`${product.discount_value}${
                                product.discount_type === "percent" ? "%" : "₹"
                              }`}
                              sx={{
                                minWidth: isMobile ? 50 : 70,
                                height: isMobile ? 20 : 24,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                fontSize: isMobile ? "0.7rem" : "0.75rem",
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.2
                                )}`,
                              }}
                            />
                          </TableCell>
                        )}
                        {visibleColumns.pricePerProduct && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                color: theme.palette.primary.main,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              {formatCurrency(
                                product.total_amount / product.quantity
                              )}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.quantity && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={500}
                              sx={{
                                color: theme.palette.text.primary,
                                fontSize: isMobile ? "0.75rem" : "0.875rem",
                              }}
                            >
                              {product.quantity}
                            </Typography>
                          </TableCell>
                        )}
                        {visibleColumns.total && (
                          <TableCell align="center">
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{
                                color: theme.palette.primary.main,
                                fontSize: isMobile ? "0.8rem" : "0.9rem",
                              }}
                            >
                              {formatCurrency(product.total_amount)}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell
                          align="center"
                          sx={{
                            width: isMobile ? 60 : 80,
                            pr: isMobile ? 1 : 2,
                            position: "sticky",
                            right: 0,
                            backgroundColor: theme.palette.background.paper,
                            zIndex: 5,
                          }}
                        >
                          <Tooltip title="Remove Product" arrow>
                            <IconButton
                              size="small"
                              onClick={() => removeProduct(product.id)}
                              sx={{
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                border: `1px solid ${alpha(
                                  theme.palette.error.main,
                                  0.2
                                )}`,
                                width: isMobile ? 28 : 32,
                                height: isMobile ? 28 : 32,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.2
                                  ),
                                  transform: "scale(1.1)",
                                  boxShadow: `0 4px 12px ${alpha(
                                    theme.palette.error.main,
                                    0.3
                                  )}`,
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Box
        sx={{
          py: isMobile ? 1.5 : 2,
          px: isMobile ? 2 : 3,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: isMobile ? "0.75rem" : "0.875rem" }}
          >
            Grand Total
          </Typography>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            color="primary"
            fontWeight={600}
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            {formatCurrency(calculateGrandTotal())}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: isMobile ? 0.5 : 1 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size={isMobile ? "small" : "medium"}
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.grey[300],
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              px: isMobile ? 1.5 : 2,
              py: isMobile ? 0.5 : 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAndNext}
            size={isMobile ? "small" : "medium"}
            disabled={products.length === 0}
            sx={{
              background:
                products.length === 0
                  ? "grey"
                  : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              px: isMobile ? 1.5 : 2,
              py: isMobile ? 0.5 : 1,
            }}
          >
            Save & Next
          </Button>
        </Box>
      </Box>

      {/* Add Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 3,

            border: `1px solid ${theme.palette.grey[200]}`,
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            overflow: "hidden",
            maxWidth: "700px",
            width: "100%",
            margin: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            position: "relative",
            "&.MuiDialogTitle-root": {
              padding: "16px 16px 16px 16px !important",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${alpha(
                theme.palette.secondary.main,
                0.8
              )}, ${alpha(theme.palette.primary.main, 0.8)})`,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: alpha(theme.palette.common.white, 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AddIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.2rem",
              }}
            >
              Add New Product
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 2,
            "&.MuiDialogContent-root": {
              paddingTop: "16px !important",
            },
          }}
        >
          <Box>
            {/* Category and Room Selection */}
            <Fade in={openDialog} timeout={300}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1.5,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Product Classification
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{
                          color: theme.palette.text.secondary,
                          "&.Mui-focused": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Category *
                      </InputLabel>
                      <Select
                        value={currentProduct.category}
                        label="Category *"
                        onChange={(e) =>
                          setCurrentProduct({
                            ...currentProduct,
                            category: e.target.value,
                          })
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            },
                            "&.Mui-focused": {
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.25
                              )}`,
                            },
                          },
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: theme.palette.primary.main,
                                }}
                              />
                              {category}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Room"
                      value={currentProduct.room}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          room: e.target.value,
                        })
                      }
                      placeholder="e.g., Living Room"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>

            <Divider
              sx={{
                my: 2,
                "&::before, &::after": {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            />

            {/* Product Details */}
            <Fade in={openDialog} timeout={500}>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1.5,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Product Name *"
                      value={currentProduct.product_name}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          product_name: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Product Code"
                      value={currentProduct.product_code}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          product_code: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Size/Finish"
                      value={currentProduct.size_finish}
                      onChange={(e) =>
                        setCurrentProduct({
                          ...currentProduct,
                          size_finish: e.target.value,
                        })
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="MRP *"
                      value={currentProduct.mrp}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || "";
                        const pricePerPiece = calculatePricePerPiece(
                          value,
                          currentProduct.discount_type,
                          currentProduct.discount_value
                        );
                        setCurrentProduct({
                          ...currentProduct,
                          mrp: value,
                          price_per_piece: pricePerPiece,
                          total_amount: calculateTotalAmount(
                            pricePerPiece,
                            currentProduct.quantity
                          ),
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              color: theme.palette.text.secondary,
                              mr: 1,
                              fontWeight: 500,
                            }}
                          >
                            ₹
                          </Box>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity *"
                      value={currentProduct.quantity}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || "";
                        setCurrentProduct({
                          ...currentProduct,
                          quantity: value,
                          total_amount: calculateTotalAmount(
                            currentProduct.price_per_piece,
                            value
                          ),
                        });
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{
                          color: theme.palette.text.secondary,
                          "&.Mui-focused": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Discount Type
                      </InputLabel>
                      <Select
                        value={currentProduct.discount_type}
                        label="Discount Type"
                        onChange={(e) => {
                          const value = e.target.value;
                          const pricePerPiece = calculatePricePerPiece(
                            currentProduct.mrp,
                            value,
                            currentProduct.discount_value
                          );
                          setCurrentProduct({
                            ...currentProduct,
                            discount_type: value,
                            price_per_piece: pricePerPiece,
                            total_amount: calculateTotalAmount(
                              pricePerPiece,
                              currentProduct.quantity
                            ),
                          });
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.15
                              )}`,
                            },
                            "&.Mui-focused": {
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${alpha(
                                theme.palette.primary.main,
                                0.25
                              )}`,
                            },
                          },
                        }}
                      >
                        <MenuItem value="percent">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: theme.palette.primary.main,
                              }}
                            />
                            Percent (%)
                          </Box>
                        </MenuItem>
                        <MenuItem value="amount">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: theme.palette.secondary.main,
                              }}
                            />
                            Amount (₹)
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Discount Value"
                      value={currentProduct.discount_value}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || "";
                        const pricePerPiece = calculatePricePerPiece(
                          currentProduct.mrp,
                          currentProduct.discount_type,
                          value
                        );
                        setCurrentProduct({
                          ...currentProduct,
                          discount_value: value,
                          price_per_piece: pricePerPiece,
                          total_amount: calculateTotalAmount(
                            pricePerPiece,
                            currentProduct.quantity
                          ),
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              color: theme.palette.text.secondary,
                              mr: 1,
                              fontWeight: 500,
                            }}
                          >
                            {currentProduct.discount_type === "percent"
                              ? "%"
                              : "₹"}
                          </Box>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                          },
                          "&.Mui-focused": {
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.25
                            )}`,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Box>

          <Fade in={openDialog} timeout={700}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price per piece
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {formatCurrency(currentProduct.price_per_piece)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {formatCurrency(currentProduct.total_amount)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            gap: 1.5,
            borderTop: `1px solid ${theme.palette.grey[200]}`,
            background: alpha(theme.palette.grey[50], 0.5),
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            size="small"
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.grey[300],
              borderRadius: 2,
              px: 2.5,
              textTransform: "none",
              fontWeight: 500,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.error.main,
                  0.15
                )}`,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            size="small"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              borderRadius: 2,
              px: 2.5,
              textTransform: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: `0 6px 16px ${alpha(
                  theme.palette.primary.main,
                  0.4
                )}`,
              },
            }}
          >
            Add Product
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
              { key: "category", label: "Category" },
              { key: "room", label: "Room" },
              { key: "productName", label: "Product Name" },
              { key: "code", label: "Code" },
              { key: "sizeFinish", label: "Size/Finish" },
              { key: "mrp", label: "MRP" },
              { key: "discount", label: "Discount" },
              { key: "pricePerProduct", label: "Price per Product" },
              { key: "quantity", label: "Quantity" },
              { key: "total", label: "Total" },
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

export default CreateSale;