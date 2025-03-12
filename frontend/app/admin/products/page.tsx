"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Chip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Image from "next/image";
import { Product as ProductType } from "../../products/interfaces/product.interface";
import getProducts from "../../products/actions/get-products";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      const uniqueProducts = data.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );
      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const getTotalStock = (product: ProductType) => {
    return product.variants.reduce(
      (total, variant) => total + variant.stock,
      0
    );
  };

  const columns: GridColDef[] = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params: GridRenderCellParams<ProductType>) => {
        const hasImage = params.row.images && params.row.images.length > 0;
        return (
          <Box sx={{ position: "relative", width: 50, height: 50 }}>
            {hasImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${params.row.images[0].url}`}
                alt={params.row.name}
                fill
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
            ) : (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "grey.500",
                }}
              >
                No img
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Nom",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "price",
      headerName: "Prix",
      width: 120,
      renderCell: (params) => (
        <Typography>
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(params.row.price)}
        </Typography>
      ),
    },
    {
      field: "stock",
      headerName: "Stock Total",
      width: 120,
      renderCell: (params) => {
        const totalStock = getTotalStock(params.row);
        return (
          <Chip
            label={totalStock}
            color={
              totalStock < 10
                ? "error"
                : totalStock < 20
                ? "warning"
                : "success"
            }
            size="small"
          />
        );
      },
    },
    {
      field: "variants",
      headerName: "Variantes",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {params.row.variants.map((variant, index) => (
            <Chip
              key={index}
              label={`${variant.size}`}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Voir">
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/products/${params.row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={() =>
                router.push(`/admin/products/${params.row.id}/edit`)
              }
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
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
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Gestion des Produits
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/products/new")}
        >
          Nouveau Produit
        </Button>
      </Box>

      <Paper
        sx={{
          height: "calc(100vh - 220px)",
          width: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: "action.hover",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
