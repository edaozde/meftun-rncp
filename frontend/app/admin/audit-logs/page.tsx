"use client";

import { useEffect, useState } from "react";
import { Typography, Box, Paper, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { AuditLog } from "../interfaces/audit-log.interface";
import HistoryIcon from '@mui/icons-material/History';

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/audit-logs`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des logs");
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Erreur lors du chargement des logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.startsWith('GET')) return theme.palette.info.main;
    if (action.startsWith('POST')) return theme.palette.success.main;
    if (action.startsWith('PUT')) return theme.palette.warning.main;
    if (action.startsWith('DELETE')) return theme.palette.error.main;
    return theme.palette.text.primary;
  };

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Date",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ color: theme.palette.primary.main, fontSize: '1.2rem' }} />
          <Typography>
            {new Date(params.value).toLocaleString("fr-FR")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "user",
      headerName: "Administrateur",
      width: 200,
      renderCell: (params) => (
        <Chip
          label={params.row.user.email}
          size="small"
          sx={{
            backgroundColor: theme.palette.primary.main + '20',
            color: theme.palette.primary.main,
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <Typography sx={{ 
          color: getActionColor(params.value),
          fontWeight: 500
        }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "product",
      headerName: "Produit concerné",
      width: 200,
      renderCell: (params) => (
        <Typography sx={{ 
          color: params.row.product ? theme.palette.text.primary : theme.palette.text.secondary,
          fontStyle: params.row.product ? 'normal' : 'italic'
        }}>
          {params.row.product?.name || "N/A"}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: "bold",
            color: theme.palette.primary.main 
          }}
        >
          Historique des actions administrateurs
        </Typography>
      </Box>

      <Paper
        sx={{
          height: 600,
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: theme.shadows[2],
        }}
      >
        <DataGrid
          rows={logs}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            height: "100%",
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.default,
              borderBottom: `2px solid ${theme.palette.divider}`,
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme.palette.action.hover,
            },
            "& .MuiDataGrid-toolbarContainer": {
              padding: 2,
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiButton-root": {
              color: theme.palette.primary.main,
            },
            "& .MuiDataGrid-cell:focus": {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Box>
  );
}
