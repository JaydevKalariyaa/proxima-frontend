import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Tooltip,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Architecture as ArchitectureIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { validatePhoneNumber } from "../utils/calc";
import {
  useConfirmSaleandSaveClientInfoMutation,
  useCancelSaleMutation,
} from "../store/api/salesApi";

const ClientInfo = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    arc_name: "",
    arc_phone: "",
    arc_address: "",
    review_scanner: "",
  });

  const [errors, setErrors] = useState({});
  const [saleData, setSaleData] = useState(null);
  const [showArchitectSection, setShowArchitectSection] = useState(!isMobile);

  // Update showArchitectSection when isMobile changes
  useEffect(() => {
    setShowArchitectSection(!isMobile);
  }, [isMobile]);

  // RTK Query mutation hooks
  const [confirmSale, { isLoading: loading }] =
    useConfirmSaleandSaveClientInfoMutation();
  const [cancelSale, { isLoading: cancelLoading }] = useCancelSaleMutation();
  const [saleId, setSaleId] = useState(null);
  useEffect(() => {
    // Get sale data from navigation state
    const passedData = location.state?.saleData;
    const saleId = location.state?.saleId;
    console.log(location.state);
    if (passedData) {
      setSaleData(passedData);
      setSaleId(saleId);
    } else {
      // If no sale data, redirect back to create sale
      navigate("/create-sale");
    }
  }, [location.state, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Client name is required";
    }

    // if (!formData.phone.trim()) {
    //   newErrors.phone = "Client phone is required";
    // } else if (!validatePhoneNumber(formData.phone)) {
    //   newErrors.phone = "Please enter a valid 10-digit phone number";
    // }

    // if (!formData.address.trim()) {
    //   newErrors.address = "Client address is required";
    // }
    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (formData.arc_phone && !validatePhoneNumber(formData.arc_phone)) {
      newErrors.arc_phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Create client data object in the required format
      const clientInfo = {
        client: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          arc_name: formData.arc_name || null,
          arc_phone: formData.arc_phone || null,
          arc_address: formData.arc_address || null,
        },
      };
      console.log(saleId);
      // Call the API to confirm sale and save client info
      await confirmSale({
        saleId: saleId,
        clientInfo: clientInfo,
      }).unwrap();

      // Show success message and redirect
      toast.success(
        "Client information saved and sale confirmed successfully!"
      );
      navigate("/sales");
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error("Error saving client information. Please try again.");
    }
  };

  const handleBack = async () => {
    try {
      // Call cancel sale API before redirecting
      await cancelSale(saleId).unwrap();

      // Show success message
      toast.success("Selection cancelled successfully");

      // Navigate back to create sale page
      navigate("/create-sale", {
        state: {
          clientData: formData,
          saleData: saleData,
        },
      });
    } catch (error) {
      console.error("Error cancelling selection:", error);
      toast.error("Error cancelling selection. Please try again.");
    }
  };

  if (!saleData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 3,
          py: 2,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )}, ${alpha(theme.palette.secondary.main, 0.05)})`,
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <Tooltip title="Back to Create Sale" arrow>
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
            }}
          >
            Client Information
          </Typography>
        </Box>
      </Box> */}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          // backgroundColor: alpha(theme.palette.primary.main, 0.01),
        }}
      >
        <Box sx={{ width: "100%", paddingBottom: "56px" }}>
          <Fade in={true} timeout={300}>
            <Box>
              {/* Client and Architect Information - Side by Side on Large Screens */}
              <Grid
                container
                spacing={isMobile ? 2 : 4}
                sx={{ mb: isMobile ? 2 : 3 }}
              >
                {/* Client Information Section */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: isMobile ? 1.5 : 2,
                      color: theme.palette.text.primary,
                      fontWeight: 600,
                      fontSize: isMobile ? "1rem" : "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: isMobile ? "1.2rem" : "1.5rem",
                      }}
                    />
                    Client Information
                  </Typography>

                  <Grid container spacing={isMobile ? 2 : 3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Client Name *"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        size="medium"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: isMobile ? 1.5 : 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  )}`,
                            },
                            "&.Mui-focused": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.25
                                  )}`,
                            },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "0.875rem",
                            opacity: 0.6,
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.875rem",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Client Phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        placeholder="9876543210"
                        size="medium"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: isMobile ? 1.5 : 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  )}`,
                            },
                            "&.Mui-focused": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.25
                                  )}`,
                            },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "0.875rem",
                            opacity: 0.6,
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.875rem",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Client Address"
                        value={formData.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        error={!!errors.address}
                        helperText={errors.address}
                        multiline
                        rows={isMobile ? 2 : 2}
                        size="medium"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: isMobile ? 1.5 : 2,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  )}`,
                            },
                            "&.Mui-focused": {
                              transform: isMobile ? "none" : "translateY(-1px)",
                              boxShadow: isMobile
                                ? "none"
                                : `0 4px 12px ${alpha(
                                    theme.palette.primary.main,
                                    0.25
                                  )}`,
                            },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "0.875rem",
                            opacity: 0.6,
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: "0.875rem",
                          },
                          "& .MuiInputBase-input": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Mobile Add Architect Button */}
                {isMobile && !showArchitectSection && (
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ marginLeft: "auto", width: "fit-content" }}>
                      <Button
                        // variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setShowArchitectSection(true)}
                        sx={{
                          width: "100%",
                          py: 0.5,
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          color: theme.palette.primary.main,
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.05
                            ),
                          },
                        }}
                      >
                        Add Architect Information
                      </Button>
                    </Box>
                  </Grid>
                )}

                {/* Architect/Mistry Information Section */}
                {showArchitectSection && (
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: isMobile ? 1.5 : 2,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        fontSize: isMobile ? "1rem" : "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ArchitectureIcon
                        sx={{
                          color: theme.palette.primary.main,
                          fontSize: isMobile ? "1.2rem" : "1.5rem",
                        }}
                      />
                      Architect/Mistry Information
                    </Typography>

                    <Grid container spacing={isMobile ? 2 : 3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Architect/Mistry Name"
                          value={formData.arc_name}
                          onChange={(e) =>
                            handleChange("arc_name", e.target.value)
                          }
                          placeholder="Optional"
                          size="medium"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: isMobile ? 1.5 : 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.15
                                    )}`,
                              },
                              "&.Mui-focused": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.25
                                    )}`,
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "0.875rem",
                              opacity: 0.6,
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "0.875rem",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          fullWidth
                          label="Architect/Mistry Phone"
                          value={formData.arc_phone}
                          onChange={(e) =>
                            handleChange("arc_phone", e.target.value)
                          }
                          error={!!errors.arc_phone}
                          helperText={errors.arc_phone}
                          placeholder="9876543210"
                          size="medium"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: isMobile ? 1.5 : 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.15
                                    )}`,
                              },
                              "&.Mui-focused": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.25
                                    )}`,
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "0.875rem",
                              opacity: 0.6,
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "0.875rem",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Architect/Mistry Location"
                          value={formData.arc_address}
                          onChange={(e) =>
                            handleChange("arc_address", e.target.value)
                          }
                          placeholder="Optional"
                          multiline
                          rows={isMobile ? 2 : 2}
                          size="medium"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: isMobile ? 1.5 : 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.15
                                    )}`,
                              },
                              "&.Mui-focused": {
                                transform: isMobile
                                  ? "none"
                                  : "translateY(-1px)",
                                boxShadow: isMobile
                                  ? "none"
                                  : `0 4px 12px ${alpha(
                                      theme.palette.primary.main,
                                      0.25
                                    )}`,
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "0.875rem",
                              opacity: 0.6,
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "0.875rem",
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "1rem",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>

              <Divider
                sx={{
                  my: isMobile ? 2 : 3,
                  "&::before, &::after": {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              />

              {/* Review Scanner Section */}
              <Typography
                variant="h6"
                sx={{
                  mb: isMobile ? 1.5 : 2,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocationIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: isMobile ? "1.2rem" : "1.5rem",
                  }}
                />
                Review & Scanner
              </Typography>

              {/* QR Code Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: isMobile ? "center" : "flex-start",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 180 : 220,
                    height: isMobile ? 180 : 220,
                    backgroundImage:
                      "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UVI8L3RleHQ+PC9zdmc+')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                />
              </Box>
            </Box>
          </Fade>
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
        <Button
          variant="outlined"
          onClick={handleBack}
          size={isMobile ? "small" : "medium"}
          disabled={loading || cancelLoading}
          startIcon={
            cancelLoading ? (
              <CircularProgress size={isMobile ? 14 : 16} />
            ) : null
          }
          sx={{
            color: theme.palette.text.primary,
            borderColor: theme.palette.grey[300],
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            minWidth: isMobile ? "auto" : "auto",
            px: isMobile ? 1.5 : 2,
          }}
        >
          {cancelLoading ? "Cancelling..." : "Cancel"}
        </Button>
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={isMobile ? 14 : 16} />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          disabled={loading || cancelLoading}
          size={isMobile ? "small" : "medium"}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            minWidth: isMobile ? "auto" : "auto",
            px: isMobile ? 1.5 : 2,
          }}
        >
          {loading ? "Saving..." : "Save Client"}
        </Button>
      </Box>
    </Box>
  );
};

export default ClientInfo;