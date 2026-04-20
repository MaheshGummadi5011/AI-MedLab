import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { MdWarning } from "react-icons/md";

// ✅ NEW: Confirmation dialog for destructive actions
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "warning",
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const colorMap = {
    error: "#d32f2f",
    warning: "#f57c00",
    success: "#388e3c",
  };

  const color = colorMap[severity] || colorMap.warning;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: color,
          fontWeight: "bold",
        }}
      >
        <MdWarning size={24} />
        {title}
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <p className="text-gray-700">{message}</p>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={isLoading}
          sx={{ borderRadius: 1 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={severity}
          disabled={isLoading}
          sx={{
            borderRadius: 1,
            backgroundColor: color,
            "&:hover": {
              backgroundColor: color,
              opacity: 0.9,
            },
          }}
        >
          {isLoading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
