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
  Home as HomeIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { formatCurrency } from "../utils/calc";
import { useGetSaleItemsByClientQuery } from "../store/api/salesApi";
import * as XLSX from "xlsx";

const ViewSale = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  // Use RTK Query hook to fetch sale items by client ID
  const {
    data: saleData,
    isLoading: loading,
    error,
  } = useGetSaleItemsByClientQuery(id);

  // Transform API data to match component structure
  const transformApiData = (apiData) => {
    if (!apiData || !apiData.items) return null;

    return {
      id: apiData.id,
      client_info: {
        client_name: apiData.client?.name || "-",
        client_phone: apiData.client?.phone || "-",
        client_address: apiData.client?.address || "-",
      },
      arc_mistry_info: {
        arc_mistry_name: apiData.client?.arc_name || "-",
        arc_mistry_phone: apiData.client?.arc_phone || "-",
        arc_mistry_location: apiData.client?.arc_location || "-",
      },
      products: apiData.items.map((item) => ({
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
        total_amount: parseFloat(item.total_amount),
      })),
      grand_total: parseFloat(apiData.total_amount),
      created_at: apiData.created_at,
      status: apiData.status,
    };
  };

  // Fallback dummy data in same format as API response
  const fallbackApiData = {
    id: 1,
    created_by: "demo@example.com",
    client: {
      client_name: "John Doe",
      client_phone: "9876543210",
      client_address: "123 Main Street, Apartment 4B, New York, NY 10001",
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
        sale: 1,
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
        sale: 1,
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
        sale: 1,
      },
      {
        id: 4,
        room: "Living Room",
        category: "Electronics",
        product_name: 'Smart TV 55"',
        product_code: "TV-055",
        size_finish: "4K UHD",
        description: null,
        quantity: 1,
        mrp: "65000.00",
        discount_type: "amount",
        discount_value: "5000.00",
        price_per_piece: "60000.00",
        total_amount: "60000.00",
        sale: 1,
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
        sale: 1,
      },
    ],
    total_amount: "136975.00",
  };

  // Use API data if available, otherwise use fallback dummy data
  const dataToUse = saleData || fallbackApiData;
  const transformedSaleData =
    dataToUse && dataToUse.data && dataToUse.data.length > 0
      ? transformApiData(dataToUse?.data[0])
      : null;
  console.log(transformedSaleData, dataToUse);
  const handleBack = () => {
    navigate("/sales");
  };

  const handleDownload = () => {
    try {
      console.log("XLSX library loaded:", XLSX);
      console.log("XLSX.utils:", XLSX.utils);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Create comprehensive data in one sheet
      const allData = [
        // Header section
        ["SELECTION DETAILS REPORT"],
        [""], // Empty row
        ["CLIENT INFORMATION"],
        [
          "Client Name:",
          transformedSaleData.client_info.client_name,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "Phone Number:",
          transformedSaleData.client_info.client_phone,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "Address:",
          transformedSaleData.client_info.client_address,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [""], // Empty row
        ["SALE INFORMATION"],
        [
          "Sale ID:",
          transformedSaleData.id,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "Sale Date:",
          new Date(transformedSaleData.created_at).toLocaleDateString(),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [
          "Grand Total:",
          formatCurrency(transformedSaleData.grand_total),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        [""], // Empty row
        [""], // Empty row
        // Products header
        [
          "S.No",
          "Category",
          "Room",
          "Product Name",
          "Product Code",
          "Size/Finish",
          "Product Image",
          "MRP",
          "Discount Type",
          "Discount Value",
          "Quantity",
          "Price per Piece",
          "Total Amount",
        ],
      ];

      // Add products data with serial numbers
      transformedSaleData.products.forEach((product, index) => {
        allData.push([
          index + 1, // Serial number
          product.category,
          product.room || "General",
          product.product_name,
          product.product_code || "-",
          product.size_finish || "-",
          "", // Empty cell for product image
          product.mrp,
          product.discount_type,
          product.discount_value,
          product.quantity,
          product.total_amount / product.quantity,
          product.total_amount,
        ]);
      });

      // Add grand total row
      allData.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "GRAND TOTAL:",
        transformedSaleData.grand_total,
      ]);

      const sheet = XLSX.utils.aoa_to_sheet(allData);

      // Set column widths for better formatting
      const colWidths = [
        { wch: 20 }, // S.No
        { wch: 15 }, // Category
        { wch: 15 }, // Room
        { wch: 30 }, // Product Name
        { wch: 15 }, // Product Code
        { wch: 20 }, // Size/Finish
        { wch: 25 }, // Product Image
        { wch: 12 }, // MRP
        { wch: 15 }, // Discount Type
        { wch: 15 }, // Discount Value
        { wch: 10 }, // Quantity
        { wch: 15 }, // Price per Piece
        { wch: 15 }, // Total Amount
      ];
      sheet["!cols"] = colWidths;

      // Add borders and formatting
      const range = XLSX.utils.decode_range(sheet["!ref"]);

      // Style the header row (row 14 - products header)
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 14, c: col });
        if (!sheet[cellAddress]) sheet[cellAddress] = { v: "" };
        sheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Style the main title
      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (!sheet[titleCell]) sheet[titleCell] = { v: "" };
      sheet[titleCell].s = {
        font: { bold: true, size: 16, color: { rgb: "366092" } },
        alignment: { horizontal: "center" },
      };

      // Style section headers
      const sectionHeaders = [2, 7]; // Client Information and Sale Information
      sectionHeaders.forEach((row) => {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (!sheet[cellAddress]) sheet[cellAddress] = { v: "" };
        sheet[cellAddress].s = {
          font: { bold: true, size: 12, color: { rgb: "366092" } },
          fill: { fgColor: { rgb: "E7E6E6" } },
        };
      });

      // Style client and sale information rows with 2-column span
      const infoRows = [3, 4, 5, 8, 9, 10]; // Client name, phone, address, sale ID, date, grand total
      infoRows.forEach((row) => {
        // Style the label column
        const labelCell = XLSX.utils.encode_cell({ r: row, c: 0 });
        if (!sheet[labelCell]) sheet[labelCell] = { v: "" };
        sheet[labelCell].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "F2F2F2" } },
          border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } },
          },
        };

        // Style the value column
        const valueCell = XLSX.utils.encode_cell({ r: row, c: 1 });
        if (!sheet[valueCell]) sheet[valueCell] = { v: "" };
        sheet[valueCell].s = {
          border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } },
          },
        };
      });

      // Style the grand total row
      const grandTotalRow = allData.length - 1;
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: grandTotalRow,
          c: col,
        });
        if (!sheet[cellAddress]) sheet[cellAddress] = { v: "" };
        sheet[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "D9E1F2" } },
          border: {
            top: { style: "medium", color: { rgb: "366092" } },
            bottom: { style: "medium", color: { rgb: "366092" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Add borders to all data cells
      for (let row = 15; row < grandTotalRow; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!sheet[cellAddress]) sheet[cellAddress] = { v: "" };
          if (!sheet[cellAddress].s) sheet[cellAddress].s = {};
          sheet[cellAddress].s.border = {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } },
          };
        }
      }

      XLSX.utils.book_append_sheet(workbook, sheet, "Sale Details");

      // Generate Excel file and download
      const fileName = `${transformedSaleData.client_info.client_name}'s_selection_${transformedSaleData.id}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      XLSX.writeFile(workbook, fileName);
      console.log("Excel file downloaded:", fileName);
    } catch (error) {
      console.error("Error creating Excel file:", error);
      // Fallback to CSV if Excel fails
      const csvData = [
        ["CLIENT INFORMATION"],
        ["Client Name", transformedSaleData.client_info.client_name],
        ["Phone Number", transformedSaleData.client_info.client_phone],
        ["Address", transformedSaleData.client_info.client_address],
        [""],
        ["PRODUCTS"],
        [
          "S.No",
          "Category",
          "Room",
          "Product Name",
          "Product Code",
          "Size/Finish",
          "Product Image",
          "MRP",
          "Discount Type",
          "Discount Value",
          "Quantity",
          "Price per Piece",
          "Total Amount",
        ],
      ];

      transformedSaleData.products.forEach((product, index) => {
        csvData.push([
          index + 1,
          product.category,
          product.room || "General",
          product.product_name,
          product.product_code || "-",
          product.size_finish || "-",
          "", // Empty for product image
          product.mrp,
          product.discount_type,
          product.discount_value,
          product.quantity,
          product.total_amount / product.quantity,
          product.total_amount,
        ]);
      });

      csvData.push([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "GRAND TOTAL:",
        transformedSaleData.grand_total,
      ]);

      const csvContent = csvData
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `sale_details_${transformedSaleData.id}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Group products by category and then by room
  const groupProductsByCategory = (products) => {
    const grouped = {};

    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = {};
      }

      const room = product.room || "General";
      if (!grouped[product.category][room]) {
        grouped[product.category][room] = [];
      }

      grouped[product.category][room].push(product);
    });

    return grouped;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography>Loading sale details...</Typography>
      </Box>
    );
  }

  if (error) {
    // Show warning but still display fallback data
    console.warn("API failed, using fallback data:", error);
  }

  if (!transformedSaleData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography>Sale not found</Typography>
      </Box>
    );
  }

  const groupedProducts = groupProductsByCategory(transformedSaleData.products);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          // px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },

          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "white",
          },
        }}
      >
        <Tooltip title="Back to Selections List" arrow>
          <IconButton
            onClick={handleBack}
            size="small"
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
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 1.5 },
            flexGrow: 1,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            Selection Details
          </Typography>
        </Box>

        <Tooltip title="Download Sale Details" arrow>
          <IconButton
            onClick={handleDownload}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                transform: "scale(1.05)",
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
              },
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Box sx={{ width: "100%", padding: "16px 0" }}>
          <Fade in={true} timeout={300}>
            <Box>
              {/* Client and Architect Information */}
              <Grid
                container
                spacing={{ xs: 2, sm: 4 }}
                sx={{ mb: { xs: 3, sm: 4 } }}
              >
                {/* Client Information */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.common.black,
                        0.05
                      )}`,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <PersonIcon
                          sx={{ color: theme.palette.primary.main }}
                        />
                        Client Information
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Client Name
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {transformedSaleData.client_info.client_name}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Phone Number
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                              }}
                            />
                            {transformedSaleData.client_info.client_phone}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Address
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <LocationIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                                mt: 0.5,
                              }}
                            />
                            {transformedSaleData.client_info.client_address}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Architect Information */}
                {/* <Grid size={{ xs: 12, lg: 6 }}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.common.black,
                        0.05
                      )}`,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <ArchitectureIcon
                          sx={{ color: theme.palette.primary.main }}
                        />
                        Architect/Mistry Information
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Name
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {
                              transformedSaleData.arc_mistry_info
                                .arc_mistry_name
                            }
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Phone Number
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                              }}
                            />
                            {
                              transformedSaleData.arc_mistry_info
                                .arc_mistry_phone
                            }
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <LocationIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                                mt: 0.5,
                              }}
                            />
                            {
                              transformedSaleData.arc_mistry_info
                                .arc_mistry_location
                            }
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid> */}
              </Grid>

              {/* Products by Category */}
              <Typography
                variant="h6"
                sx={{
                  mb: { xs: 2, sm: 3 },
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
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
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1
                    )}`,
                    boxShadow: `0 2px 8px ${alpha(
                      theme.palette.common.black,
                      0.05
                    )}`,
                    "&:before": { display: "none" },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: "8px 8px 0 0",
                      "&.Mui-expanded": {
                        borderRadius: "8px 8px 0 0",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <CategoryIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
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
                        {room !== "General" && (
                          <Box
                            sx={{
                              px: 3,
                              py: 1,
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.02
                              ),
                              borderBottom: `1px solid ${alpha(
                                theme.palette.primary.main,
                                0.1
                              )}`,
                              mb: 1,
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <HomeIcon
                                sx={{
                                  fontSize: 18,
                                  color: theme.palette.primary.main,
                                }}
                              />
                              Room: {room}
                            </Typography>
                          </Box>
                        )}

                        {/* Desktop Table View */}
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.02
                                    ),
                                  }}
                                >
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Product Name
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Code
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Size/Finish
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    MRP
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Discount
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Qty
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    Total
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {products.map((product) => (
                                  <TableRow
                                    key={product.id}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: alpha(
                                          theme.palette.primary.main,
                                          0.02
                                        ),
                                      },
                                    }}
                                  >
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        fontWeight={500}
                                      >
                                        {product.product_name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontFamily: "monospace",
                                          fontSize: "0.75rem",
                                          color: theme.palette.text.secondary,
                                        }}
                                      >
                                        {product.product_code}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                      >
                                        {product.size_finish}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        variant="body2"
                                        fontWeight={500}
                                      >
                                        {formatCurrency(product.mrp)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip
                                        size="small"
                                        label={`${product.discount_value}${
                                          product.discount_type === "percent"
                                            ? "%"
                                            : "₹"
                                        }`}
                                        sx={{
                                          minWidth: 60,
                                          height: 20,
                                          fontSize: "0.7rem",
                                          bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                          ),
                                          color: theme.palette.primary.main,
                                          fontWeight: 500,
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        variant="body2"
                                        fontWeight={500}
                                      >
                                        {product.quantity}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{
                                          color: theme.palette.primary.main,
                                        }}
                                      >
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
                        <Box sx={{ display: { xs: "block", md: "none" } }}>
                          {products.map((product) => (
                            <Card
                              key={product.id}
                              sx={{
                                mb: 2,
                                ml: 1,
                                mr: 1,
                                border: `1px solid ${alpha(
                                  theme.palette.primary.main,
                                  0.1
                                )}`,
                                borderRadius: 2,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.02
                                  ),
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                {/* Product Name Header */}
                                <Box
                                  sx={{
                                    mb: 1.5,

                                    pb: 1,
                                    borderBottom: `1px solid ${alpha(
                                      theme.palette.grey[300],
                                      0.3
                                    )}`,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                      fontSize: "1rem",
                                      lineHeight: 1.3,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    {product.product_name}
                                  </Typography>
                                </Box>

                                {/* Product Details - 2 items per row */}
                                <Box
                                  sx={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 1.5,
                                    mb: 1.5,
                                  }}
                                >
                                  {/* Product Code */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      Product Code
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontFamily: "monospace",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {product.product_code || "-"}
                                    </Typography>
                                  </Box>

                                  {/* Size/Finish */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      Size/Finish
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.8rem",
                                        fontWeight: 500,
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {product.size_finish || "-"}
                                    </Typography>
                                  </Box>

                                  {/* MRP */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      MRP
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {formatCurrency(product.mrp)}
                                    </Typography>
                                  </Box>

                                  {/* Quantity */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      Quantity
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      {product.quantity}
                                    </Typography>
                                  </Box>

                                  {/* Discount */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      Discount
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={`${product.discount_value}${
                                        product.discount_type === "percent"
                                          ? "%"
                                          : "₹"
                                      }`}
                                      sx={{
                                        fontSize: "0.7rem",
                                        height: 20,
                                        bgcolor: alpha(
                                          theme.palette.primary.main,
                                          0.1
                                        ),
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </Box>

                                  {/* Price per Piece */}
                                  <Box
                                    sx={{
                                      p: 1,
                                      backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.05
                                      ),
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: "0.7rem",
                                        fontWeight: 500,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.5,
                                        display: "block",
                                        mb: 0.25,
                                      }}
                                    >
                                      Price per Piece
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      {formatCurrency(
                                        product.total_amount / product.quantity
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Total Amount - Full Width */}
                                <Box
                                  sx={{
                                    p: 1.5,
                                    backgroundColor: alpha(
                                      theme.palette.primary.main,
                                      0.1
                                    ),
                                    borderRadius: 1,
                                    textAlign: "center",
                                    border: `1px solid ${alpha(
                                      theme.palette.primary.main,
                                      0.2
                                    )}`,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: theme.palette.text.secondary,
                                      fontSize: "0.7rem",
                                      fontWeight: 500,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      display: "block",
                                      mb: 0.25,
                                    }}
                                  >
                                    Total Amount
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                      color: theme.palette.primary.main,
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    {formatCurrency(product.total_amount)}
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
              <Card
                sx={{
                  mt: { xs: 3, sm: 4 },
                  borderRadius: 2,
                  border: `2px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                    }}
                  >
                    Grand Total:{" "}
                    {formatCurrency(transformedSaleData.grand_total)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Sale Date:{" "}
                    {new Date(
                      transformedSaleData.created_at
                    ).toLocaleDateString()}
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
