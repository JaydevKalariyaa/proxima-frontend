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
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { calculatePricePerPiece, calculateTotalAmount, formatCurrency, generateId } from '../utils/calc';
import { useCreateSaleMutation } from '../store/api/salesApi';

const categories = [
  "Hardware",
  "Lamination & Highlighter",
  "Veneer",
  "Sofa & Curtains",
  "Modular"
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateSale = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: '',
    category: categories[0], // Default to first category
    room: '',
    product_name: '',
    product_code: '',
    size_finish: '',
    mrp: '',
    discount_type: 'percent',
    discount_value: '',
    quantity: '',
    price_per_piece: 0,
    total_amount: 0
  });

  const handleOpenDialog = () => {
    // Use category from last product if exists, otherwise use first category
    const lastProduct = products[products.length - 1];
    setCurrentProduct({
      id: generateId(),
      category: lastProduct ? lastProduct.category : categories[0],
      room: lastProduct ? lastProduct.room : '',
      product_name: '',
      product_code: '',
      size_finish: '',
      mrp: '',
      discount_type: 'percent',
      discount_value: '',
      quantity: '',
      price_per_piece: 0,
      total_amount: 0
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddProduct = () => {
    if (!currentProduct.product_name || !currentProduct.mrp || !currentProduct.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProducts(prev => [...prev, currentProduct]);
    setOpenDialog(false);
    toast.success('Product added successfully');
  };

  const removeProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    toast.info('Product removed');
  };

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => total + (product.total_amount || 0), 0);
  };

  const handleBack = () => {
    navigate('/sales');
  };

  const handleSaveAndNext = async() => {
    if (products.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    const saleData = {
      status: 'draft',
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
    
   const response = await createSale(saleData);
   console.log(response);
   if(response.data.success){
    
    navigate('/client-info', { 
      state: { 
        saleData: saleData,
        saleId: response.data.data.id 
      } 
    });
   }else{
    toast.error('Error saving sale. Please try again.');
   }
  
    
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {isCreating && <Loader />}
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
       
        paddingBottom: "16px",
       
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          
        }
      }}>
        <Tooltip title="Back to Sales List" arrow>
          <IconButton
            onClick={handleBack}
            size="medium"
            sx={{ 
              color: theme.palette.primary.main,
              
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: 'translateX(-2px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
         
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: '1.25rem',
              
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
             
            }}
          >
            Create New Sale
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        
      }}>
        <Box sx={{ width: '100%' }}>
          {/* Add Product Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            p: 1.5,
            
          }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              size="small"
              sx={{
                textTransform: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.35)}`,
                }
              }}
            >
              Add Product
            </Button>
          </Box>

          {/* Products Table */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
              boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`
            }}
          >
            <TableContainer sx={{ maxHeight: 'calc(100vh - 305px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        bgcolor: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                        color: theme.palette.text.primary,
                        fontSize: '0.875rem',
                        borderBottom: `2px solid ${theme.palette.primary.main}`,
                        py: 2,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                      }
                    }}
                  >
                    <TableCell align="left">Product Name</TableCell>
                    <TableCell align="center">Code</TableCell>
                    <TableCell align="left">Category</TableCell>
                    <TableCell align="left">Room</TableCell>
                    <TableCell align="center">MRP</TableCell>
                    <TableCell align="center">Discount</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                        <Box sx={{ color: 'text.secondary', textAlign: 'center' }}>
                          <Box sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2
                          }}>
                            <AddIcon sx={{ 
                              color: theme.palette.primary.main, 
                              fontSize: 32 
                            }} />
                          </Box>
                          <Typography variant="h6" gutterBottom sx={{ 
                            color: theme.palette.text.primary,
                            fontWeight: 600
                          }}>
                            No products added yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Start by adding your first product to create a sale
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenDialog}
                            sx={{ 
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                              borderRadius: 2,
                              px: 3,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                              '&:hover': {
                                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                                transform: 'translateY(-1px)'
                              }
                            }}
                          >
                            Add Your First Product
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow
                        key={product.id}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          transition: 'all 0.2s ease',
                          borderBottom: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <TableCell align="left">
                          <Typography variant="body2" fontWeight={500} sx={{
                            color: theme.palette.text.primary,
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {product.product_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: theme.palette.text.secondary,
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {product.product_code || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main
                            }} />
                            <Typography variant="body2" fontWeight={500} sx={{
                              color: theme.palette.text.primary
                            }}>
                              {product.category}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="body2" sx={{
                            color: theme.palette.text.primary,
                            fontStyle: product.room ? 'normal' : 'italic'
                          }}>
                            {product.room || 'Not specified'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={500} sx={{
                            color: theme.palette.text.primary
                          }}>
                            {formatCurrency(product.mrp)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            size="small"
                            label={`${product.discount_value}${product.discount_type === 'percent' ? '%' : '₹'}`}
                            sx={{ 
                              minWidth: 70,
                              height: 24,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={500} sx={{
                            color: theme.palette.text.primary
                          }}>
                            {product.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" fontWeight={700} sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: '0.9rem'
                          }}>
                            {formatCurrency(product.total_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Remove Product" arrow>
                            <IconButton
                              size="small"
                              onClick={() => removeProduct(product.id)}
                              sx={{ 
                                color: theme.palette.error.main,
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                                  transform: 'scale(1.1)',
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.3)}`
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Fixed Footer */}
      <Box 
        sx={{ 
          py: 2,
          px: 3,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            Grand Total
          </Typography>
          <Typography variant="h6" color="primary" fontWeight={600}>
            {formatCurrency(calculateGrandTotal())}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size="small"
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.grey[300],
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAndNext}
            size="small"
            disabled={products.length === 0}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
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
            overflow: 'hidden',
            maxWidth: '700px'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          position: 'relative',
          '&.MuiDialogTitle-root': {
            padding: '16px 16px 16px 16px !important'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${alpha(theme.palette.secondary.main, 0.8)}, ${alpha(theme.palette.primary.main, 0.8)})`
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: alpha(theme.palette.common.white, 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AddIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700,
              fontSize: '1.2rem'
            }}>
              Add New Product
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ 
          p: 2,
          '&.MuiDialogContent-root': {
            paddingTop: '16px !important'
          }
        }}>
          <Box>
            {/* Category and Room Selection */}
            <Fade in={openDialog} timeout={300}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  Product Classification
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12,sm:6}}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.primary.main
                        }
                      }}>
                        Category *
                      </InputLabel>
                      <Select
                        value={currentProduct.category}
                        label="Category *"
                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main
                              }} />
                              {category}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField
                      fullWidth
                      label="Room"
                     
                      value={currentProduct.room}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, room: e.target.value })}
                      placeholder="e.g., Living Room"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>

            <Divider sx={{ 
              my: 2,
              '&::before, &::after': {
                borderColor: alpha(theme.palette.primary.main, 0.2)
              }
            }} />

            {/* Product Details */}
            <Fade in={openDialog} timeout={500}>
              <Box>
                <Typography variant="subtitle1" sx={{ 
                  mb: 1.5, 
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  Product Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField
                      fullWidth
                      label="Product Name *"
                      value={currentProduct.product_name}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, product_name: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField
                      fullWidth
                      label="Product Code"
                      value={currentProduct.product_code}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, product_code: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:4}}>
                    <TextField
                      fullWidth
                      label="Size/Finish"
                      value={currentProduct.size_finish}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, size_finish: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:4}}>
                    <TextField
                      fullWidth
                      type="number"
                      label="MRP *"
                      value={currentProduct.mrp}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || '';
                        const pricePerPiece = calculatePricePerPiece(
                          value,
                          currentProduct.discount_type,
                          currentProduct.discount_value
                        );
                        setCurrentProduct({ 
                          ...currentProduct, 
                          mrp: value,
                          price_per_piece: pricePerPiece,
                          total_amount: calculateTotalAmount(pricePerPiece, currentProduct.quantity)
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ 
                            color: theme.palette.text.secondary,
                            mr: 1,
                            fontWeight: 500
                          }}>
                            ₹
                          </Box>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12,sm:6,md:4}}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Quantity *"
                      value={currentProduct.quantity}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || '';
                        setCurrentProduct({ 
                          ...currentProduct, 
                          quantity: value,
                          total_amount: calculateTotalAmount(currentProduct.price_per_piece, value)
                        });
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ 
                        color: theme.palette.text.secondary,
                        '&.Mui-focused': {
                          color: theme.palette.primary.main
                        }
                      }}>
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
                            total_amount: calculateTotalAmount(pricePerPiece, currentProduct.quantity)
                          });
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                            },
                            '&.Mui-focused': {
                              transform: 'translateY(-1px)',
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                            }
                          }
                        }}
                      >
                        <MenuItem value="percent">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: theme.palette.primary.main
                            }} />
                            Percent (%)
                          </Box>
                        </MenuItem>
                        <MenuItem value="amount">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: theme.palette.secondary.main
                            }} />
                            Amount (₹)
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{xs:12,sm:6}}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Discount Value"
                      value={currentProduct.discount_value}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || '';
                        const pricePerPiece = calculatePricePerPiece(
                          currentProduct.mrp,
                          currentProduct.discount_type,
                          value
                        );
                        setCurrentProduct({ 
                          ...currentProduct, 
                          discount_value: value,
                          price_per_piece: pricePerPiece,
                          total_amount: calculateTotalAmount(pricePerPiece, currentProduct.quantity)
                        });
                      }}
                      InputProps={{
                        startAdornment: (
                          <Box sx={{ 
                            color: theme.palette.text.secondary,
                            mr: 1,
                            fontWeight: 500
                          }}>
                            {currentProduct.discount_type === 'percent' ? '%' : '₹'}
                          </Box>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`
                          },
                          '&.Mui-focused': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Box>

          <Fade in={openDialog} timeout={700}>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Price per piece
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {formatCurrency(currentProduct.price_per_piece)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {formatCurrency(currentProduct.total_amount)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Fade>
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          gap: 1.5,
          borderTop: `1px solid ${theme.palette.grey[200]}`,
          background: alpha(theme.palette.grey[50], 0.5)
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            size="small"
            sx={{ 
              color: theme.palette.text.primary,
              borderColor: theme.palette.grey[300],
              borderRadius: 2,
              px: 2.5,
              textTransform: 'none',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                transform: 'translateY(-1px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}`
              }
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
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
              }
            }}
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateSale;