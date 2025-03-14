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
      console.log("Données reçues:", data);

      if (!Array.isArray(data)) {
        console.error("Les données reçues ne sont pas un tableau:", data);
        return;
      }

      const uniqueProducts = data.filter(
        (product, index, self) =>
          index === self.findIndex((p) => p.id === product.id)
      );
      console.log("Produits uniques:", uniqueProducts);
      setProducts(uniqueProducts || []);
    } catch (error) {
      console.error("Erreur détaillée lors du chargement des produits:", error);
      setProducts([]); // Assurez-vous d'avoir un tableau vide en cas d'erreur
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
      width: 120,
      renderCell: (params: GridRenderCellParams<ProductType>) => {
        const hasImage = params.row.images && params.row.images.length > 0;
        console.log("Product images:", params.row.images);
        console.log(
          "Image URL:",
          hasImage
            ? `${process.env.NEXT_PUBLIC_API_URL}${params.row.images[0].url}`
            : "No image"
        );
        return (
          <Box
            sx={{
              position: "relative",
              width: 80,
              height: 80,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {hasImage ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${params.row.images[0].url}`}
                alt={params.row.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="80px"
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "grey.100",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "grey.500",
                  fontSize: "0.75rem",
                }}
              >
                Pas d'image
              </Box>
            )}
          </Box>
        );
      },
    },
    {
      field: "name",
      headerName: "Nom du Produit",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: 500,
            color: "text.primary",
            "&:hover": {
              color: "primary.main",
              cursor: "pointer",
            },
          }}
        >
          {params.row.name}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Prix",
      width: 120,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
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
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "variants",
      headerName: "Variantes",
      width: 250,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.row.variants.map((variant, index) => (
            <Chip
              key={index}
              label={`${variant.size} - ${variant.color}`}
              size="small"
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light + "20",
                },
              }}
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
          <Tooltip title="Voir les détails">
            <IconButton
              size="small"
              onClick={() => router.push(`/admin/products/${params.row.id}`)}
              sx={{ color: theme.palette.info.main }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={() =>
                router.push(`/admin/products/edit/${params.row.id}`)
              }
              sx={{ color: theme.palette.primary.main }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              sx={{ color: theme.palette.error.main }}
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

      <Paper sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          loading={loading}
          components={{ Toolbar: GridToolbar }}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "2px solid",
              borderColor: "primary.main",
            },
          }}
        />
      </Paper>
    </Box>
  );
}
