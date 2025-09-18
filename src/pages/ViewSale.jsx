import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Architecture as ArchitectureIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { formatCurrency } from '../utils/calc';
import { useGetSaleItemsByClientQuery } from '../store/api/salesApi';

const ViewSale = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Use RTK Query hook to fetch sale items by client ID
  const { 
    data: saleData, 
    isLoading: loading, 
    error
  } = useGetSaleItemsByClientQuery(id);

  // Transform API data to match component structure
  const transformApiData = (apiData) => {
    if (!apiData || !apiData.items) return null;
    
    return {
      id: apiData.id,
      client_info: apiData.client || {
        client_name: 'N/A',
        client_phone: 'N/A',
        client_address: 'N/A'
      },
      arc_mistry_info: {
        arc_mistry_name: 'N/A',
        arc_mistry_phone: 'N/A',
        arc_mistry_location: 'N/A'
      },
      products: apiData.items.map(item => ({
        id: item.id,
        category: item.category,
        room: item.room,
        product_name: item.product_name,
        product_code: item.product_code,
        size_finish: item.size_finish,
        mrp: parseFloat(item.mrp),
        discount_type: item.discount_type,
        discount_value: parseFloat(item.discount_value),
        quantity: item.quantity,
        price_per_piece: parseFloat(item.price_per_piece),
        total_amount: parseFloat(item.total_amount)
      })),
      grand_total: parseFloat(apiData.total_amount),
      created_at: apiData.created_at,
      status: apiData.status
    };
  };

  // Fallback dummy data in same format as API response
  const fallbackApiData = {
    id: 1,
    created_by: "demo@example.com",
    client: {
      client_name: "John Doe",
      client_phone: "9876543210", 
      client_address: "123 Main Street, Apartment 4B, New York, NY 10001"
    },
    status: "completed",
    created_at: "2024-01-15T10:30:00Z",
    items: [
      {
        id: 1,
        room: "Living Room",
        category: "Furniture",
        product_name: "Modern Sofa Set",
        product_code: "SOFA-001",
        size_finish: "3-Seater, Grey",
        description: null,
        quantity: 1,
        mrp: "45000.00",
        discount_type: "percent",
        discount_value: "10.00",
        price_per_piece: "40500.00",
        total_amount: "40500.00",
        sale: 1
      },
      {
        id: 2,
        room: "Kitchen",
        category: "modular",
        product_name: "Cabinet",
        product_code: "MD002",
        size_finish: "Large",
        description: null,
        quantity: 1,
        mrp: "2000.00",
        discount_type: "amount",
        discount_value: "200.00",
        price_per_piece: "1800.00",
        total_amount: "1800.00",
        sale: 1
      },
      {
        id: 3,
        room: "Bedroom",
        category: "veneer",
        product_name: "Veneer Sheet",
        product_code: "VN003",
        size_finish: "Standard",
        description: null,
        quantity: 5,
        mrp: "100.00",
        discount_type: "amount",
        discount_value: "5.00",
        price_per_piece: "95.00",
        total_amount: "475.00",
        sale: 1
      },
      {
        id: 4,
        room: "Living Room",
        category: "Electronics",
        product_name: "Smart TV 55\"",
        product_code: "TV-055",
        size_finish: "4K UHD",
        description: null,
        quantity: 1,
        mrp: "65000.00",
        discount_type: "amount",
        discount_value: "5000.00",
        price_per_piece: "60000.00",
        total_amount: "60000.00",
        sale: 1
      },
      {
        id: 5,
        room: "Kitchen",
        category: "Appliances",
        product_name: "Refrigerator 300L",
        product_code: "REF-300",
        size_finish: "Stainless Steel",
        description: null,
        quantity: 1,
        mrp: "35000.00",
        discount_type: "percent",
        discount_value: "8.00",
        price_per_piece: "32200.00",
        total_amount: "32200.00",
        sale: 1
      }
    ],
    total_amount: "136975.00"
  };

  // Use API data if available, otherwise use fallback dummy data
  const dataToUse = saleData || fallbackApiData;
  const transformedSaleData = dataToUse ? transformApiData(dataToUse) : null;

  const handleBack = () => {
    navigate('/sales');
  };


  // Group products by category and then by room
  const groupProductsByCategory = (products) => {
    const grouped = {};
    
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = {};
      }
      
      const room = product.room || 'General';
      if (!grouped[product.category][room]) {
        grouped[product.category][room] = [];
      }
      
      grouped[product.category][room].push(product);
    });
    
    return grouped;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading sale details...</Typography>
      </Box>
    );
  }

  if (error) {
    // Show warning but still display fallback data
    console.warn('API failed, using fallback data:', error);
  }

  if (!transformedSaleData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Sale not found</Typography>
      </Box>
    );
  }

  const groupedProducts = groupProductsByCategory(transformedSaleData.products);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 2 },
       
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        }
      }}>
        <Tooltip title="Back to Sales List" arrow>
          <IconButton
            onClick={handleBack}
            size="small"
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
        <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexGrow: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap'
            }}
          >
            Sale Details - #{transformedSaleData.id}
            {error && (
              <Chip 
                label="Demo Data" 
                size="small"
                sx={{ 
                  fontSize: '0.65rem',
                  height: 20,
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: theme.palette.warning.main
                }}
              />
            )}
          </Typography>
          <Chip 
            label={transformedSaleData.status} 
            color={getStatusColor(transformedSaleData.status)}
            size="small"
            sx={{ 
              textTransform: 'capitalize',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
    
      }}>
        <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
          <Fade in={true} timeout={300}>
            <Box>
              {/* Client and Architect Information */}
              <Grid container spacing={{ xs: 2, sm: 4 }} sx={{ mb: { xs: 3, sm: 4 } }}>
                {/* Client Information */}
                <Grid size={{xs:12,lg:6}}>
                  <Card sx={{ 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`
                  }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" sx={{ 
                        mb: 2, 
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <PersonIcon sx={{ color: theme.palette.primary.main }} />
                        Client Information
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Client Name
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {transformedSaleData.client_info.client_name}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Phone Number
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                            {transformedSaleData.client_info.client_phone}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Address
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mt: 0.5 }} />
                            {transformedSaleData.client_info.client_address}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Architect Information */}
                <Grid size={{xs:12,lg:6}}>
                  <Card sx={{ 
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`
                  }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography variant="h6" sx={{ 
                        mb: 2, 
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <ArchitectureIcon sx={{ color: theme.palette.primary.main }} />
                        Architect/Mistry Information
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Name
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {transformedSaleData.arc_mistry_info.arc_mistry_name}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Phone Number
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                            {transformedSaleData.arc_mistry_info.arc_mistry_phone}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Location
                          </Typography>
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LocationIcon sx={{ fontSize: 16, color: theme.palette.primary.main, mt: 0.5 }} />
                            {transformedSaleData.arc_mistry_info.arc_mistry_location}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>


              {/* Products by Category */}
              <Typography variant="h6" sx={{ 
                mb: { xs: 2, sm: 3 }, 
                color: theme.palette.text.primary,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}>
                <CategoryIcon sx={{ color: theme.palette.primary.main }} />
                Products by Category
              </Typography>

              {Object.entries(groupedProducts).map(([category, rooms]) => (
                <Accordion 
                  key={category}
                  defaultExpanded
                  sx={{ 
                    mb: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: '8px 8px 0 0',
                      '&.Mui-expanded': {
                        borderRadius: '8px 8px 0 0'
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CategoryIcon sx={{ color: theme.palette.primary.main }} />
                      {category}
                      <Chip 
                        label={`${Object.values(rooms).flat().length} items`}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Typography>
                  </AccordionSummary>
                  
                  <AccordionDetails sx={{ p: 0 }}>
                    {Object.entries(rooms).map(([room, products]) => (
                      <Box key={room} sx={{ mb: 2 }}>
                        {room !== 'General' && (
                          <Box sx={{ 
                            px: 3, 
                            py: 1, 
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                          }}>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}>
                              <HomeIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                              {room}
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Desktop Table View */}
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.02) }}>
                                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>Size/Finish</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>MRP</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>Discount</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 600 }}>Total</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {products.map((product) => (
                                  <TableRow key={product.id} sx={{ 
                                    '&:hover': { 
                                      backgroundColor: alpha(theme.palette.primary.main, 0.02)
                                    }
                                  }}>
                                    <TableCell>
                                      <Typography variant="body2" fontWeight={500}>
                                        {product.product_name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ 
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        color: theme.palette.text.secondary
                                      }}>
                                        {product.product_code}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" color="text.secondary">
                                        {product.size_finish}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="body2" fontWeight={500}>
                                        {formatCurrency(product.mrp)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip 
                                        size="small"
                                        label={`${product.discount_value}${product.discount_type === 'percent' ? '%' : '₹'}`}
                                        sx={{ 
                                          minWidth: 60,
                                          height: 20,
                                          fontSize: '0.7rem',
                                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                                          color: theme.palette.primary.main,
                                          fontWeight: 500
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="body2" fontWeight={500}>
                                        {product.quantity}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="body2" fontWeight={600} sx={{ 
                                        color: theme.palette.primary.main
                                      }}>
                                        {formatCurrency(product.total_amount)}
                                      </Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>

                        {/* Mobile Card View */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                          {products.map((product) => (
                            <Card key={product.id} sx={{ 
                              mb: 2, 
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                              '&:hover': { 
                                backgroundColor: alpha(theme.palette.primary.main, 0.02)
                              }
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="body1" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
                                    {product.product_name}
                                  </Typography>
                                  <Typography variant="h6" fontWeight={700} sx={{ 
                                    color: theme.palette.primary.main
                                  }}>
                                    {formatCurrency(product.total_amount)}
                                  </Typography>
                                </Box>
                                
                                <Typography variant="body2" sx={{ 
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                  color: theme.palette.text.secondary,
                                  mb: 1
                                }}>
                                  {product.product_code}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {product.size_finish}
                                </Typography>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                  <Typography variant="body2">
                                    MRP: <strong>{formatCurrency(product.mrp)}</strong>
                                  </Typography>
                                  <Chip 
                                    size="small"
                                    label={`${product.discount_value}${product.discount_type === 'percent' ? '%' : '₹'} off`}
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                                      color: theme.palette.primary.main,
                                      fontWeight: 500
                                    }}
                                  />
                                  <Typography variant="body2" fontWeight={500}>
                                    Qty: {product.quantity}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Grand Total */}
              <Card sx={{ 
                mt: { xs: 3, sm: 4 },
                borderRadius: 2,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
              }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}>
                    Grand Total: {formatCurrency(transformedSaleData.grand_total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Sale Date: {new Date(transformedSaleData.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewSale;
