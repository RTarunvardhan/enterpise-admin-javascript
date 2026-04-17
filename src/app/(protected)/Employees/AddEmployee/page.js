"use client";

import { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button,
  useTheme, alpha, Paper
} from "@mui/material";
import dynamic from "next/dynamic";
import { Save, Clear } from "@mui/icons-material";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

// DATA
const depts = ["IT Services", "Human Resources", "Digital Marketing", "Financial Operations", "Product Management"];
const roles = ["Senior Developer", "Junior Developer", "HR Specialist", "Business Analyst", "QA Engineer", "Project Lead", "UX Designer"];
const bloodGroups = ["A+", "B+", "O+", "AB+"];
const genders = ["Male", "Female"];

export default function AddEmployee() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const portalTarget = mounted ? document.body : null;

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    department: "", designation: "", salary: "",
    joiningDate: "", dateOfBirth: "",
    gender: "", bloodGroup: "",
    accountNumber: "", panCard: "",
  });

  // ─────────────────────────────
  // HANDLERS
  // ─────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSelect = (name, option) => {
    setFormData((p) => ({ ...p, [name]: option?.value || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // ─────────────────────────────
  // REACT SELECT THEME
  // ─────────────────────────────
  const selectStyles =
  {
    control: (base, state) => ({
      ...base,
      minHeight: 28,
      height: 40,
      fontSize: 13,
      borderRadius: 6,
      padding: "0px 4px",

      background: isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.03)",

      border: `1px solid ${state.isFocused
        ? theme.palette.primary.main
        : isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.08)"
        }`,

      boxShadow: state.isFocused
        ? `0 0 0 1px ${theme.palette.primary.main}`
        : "none",

      "&:hover": {
        borderColor: theme.palette.primary.main,
        background: isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.05)",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: 12,
      color: theme.palette.text.primary,
    }),

    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      fontSize: 12,
    }),

    placeholder: (base) => ({
      ...base,
      fontSize: 11,
      color: isDark
        ? "rgba(255,255,255,0.4)"
        : "rgba(0,0,0,0.4)",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: 40,
    }),

    dropdownIndicator: (base) => ({
      ...base,
      padding: 4,
      color: theme.palette.text.primary,
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),

    menu: (base) => ({
      ...base,
      borderRadius: 8,
      overflow: "hidden",
      background: isDark
        ? "rgba(15,23,42,0.95)"
        : "#ffffff",
      backdropFilter: "blur(10px)",
      border: `1px solid ${theme.palette.divider}`,
      fontSize: 12,
      padding: 0
    }),

    option: (base, state) => ({
      ...base,
      fontSize: 12,
      cursor: "pointer",

      background: state.isSelected
        ? theme.palette.primary.main
        : state.isFocused
          ? isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.05)"
          : "transparent",

      color: state.isSelected
        ? "#fff"
        : theme.palette.text.primary,
    }),
  }

  const glass = {
    p: 3,
    borderRadius: 3,
    background: alpha(isDark ? "#1e293b" : "#fff", 0.5),
    backdropFilter: "blur(12px)",
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  };

  const inputSx = {
    "& .MuiInputBase-root": {
      fontSize: 13,
      height: 40,
    },
    "& .MuiInputBase-input": {
      py: 0.8,
      fontSize: 13,
    },
    "& .MuiInputLabel-root": {
      fontSize: 12,
      top: "-2px",
    },
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,       // ← required for flex children to shrink
        borderRadius: 4,
        background: alpha(isDark ? "#3d3d3d" : "#ffffff", isDark ? 0.4 : 0.7),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(isDark ? "#ffffff" : "#000000", 0.1)}`,
        boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
        width: "100%"
      }}
    >
      <Typography variant="h6" mb={2}>
        Add Employee
      </Typography>

      <Paper component="form" onSubmit={handleSubmit} sx={glass}>

        {/* BASIC */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <TextField autoComplete="off" fullWidth label="First Name" name="firstName" sx={inputSx} onChange={handleChange} />
          <TextField autoComplete="off" fullWidth label="Last Name" name="lastName" sx={inputSx} onChange={handleChange} />
          <TextField autoComplete="off" fullWidth label="Email" name="email" sx={inputSx} onChange={handleChange} />
          <TextField autoComplete="off" fullWidth label="Phone" name="phone" sx={inputSx} onChange={handleChange} />
        </Box>

        {/* SELECTS */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>

          <Box sx={{ flex: 1 }}>
            <Typography fontSize={11}>Department</Typography>
            <Select
              instanceId="department"
              styles={selectStyles}
              menuPortalTarget={portalTarget}
              // placeholder="Select"
              options={depts.map(d => ({ label: d, value: d }))}
              onChange={(opt) => handleSelect("department", opt)}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography fontSize={11}>Designation</Typography>
            <Select
              instanceId="designation"
              styles={selectStyles}
              menuPortalTarget={portalTarget}
              // placeholder=""
              options={roles.map(r => ({ label: r, value: r }))}
              onChange={(opt) => handleSelect("designation", opt)}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography fontSize={11}>Gender</Typography>
            <Select
              instanceId="gender"
              styles={selectStyles}
              menuPortalTarget={portalTarget}
              // placeholder=""
              options={genders.map(g => ({ label: g, value: g }))}
              onChange={(opt) => handleSelect("gender", opt)}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography fontSize={11}>Blood Group</Typography>
            <Select
              instanceId="bloodGroup"
              styles={selectStyles}
              menuPortalTarget={portalTarget}
              // placeholder=""
              options={bloodGroups.map(b => ({ label: b, value: b }))}
              onChange={(opt) => handleSelect("bloodGroup", opt)}
            />
          </Box>

        </Box>

        {/* DATES */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          <TextField autoComplete="off" type="date" label="Joining Date" name="joiningDate" sx={inputSx} InputLabelProps={{ shrink: true }} fullWidth onChange={handleChange} />
          <TextField autoComplete="off" type="date" label="DOB" name="dateOfBirth" sx={inputSx} InputLabelProps={{ shrink: true }} fullWidth onChange={handleChange} />
          <TextField autoComplete="off" fullWidth label="Salary" name="salary" sx={inputSx} onChange={handleChange} />
          <TextField autoComplete="off" fullWidth label="Account Number" name="accountNumber" sx={inputSx} onChange={handleChange} />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
          <TextField autoComplete="off" fullWidth label="PAN Card" name="panCard" sx={inputSx} onChange={handleChange} style={{ mb: 2 }} />
        </Box>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, }}>
          <Button variant="contained" sx={{ bgcolor: "#ef4444" }} startIcon={<Clear />}>Cancel</Button>
          <Button variant="contained" type="submit" startIcon={<Save />}>Save</Button>
        </Box>

      </Paper>
    </Box>
  );
}