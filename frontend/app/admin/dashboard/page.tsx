"use client";

import { Box, Grid, Paper, Typography, Button, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import getProducts from "@/app/products/actions/get-products";
import { Product } from "@/app/products/interfaces/product.interface";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardStats {
  totalProducts: number;
  totalVariants: number;
  lowStockProducts: number;
  totalStock: number;
  stockByProduct: Array<{ name: string; stock: number }>;
  variantsByProduct: Array<{ name: string; value: number }>;
}

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalVariants: 0,
    lowStockProducts: 0,
    totalStock: 0,
    stockByProduct: [],
    variantsByProduct: [],
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const products = await getProducts();

        // Calculer les statistiques de base
        const totalProducts = products.length;
        const totalVariants = products.reduce(
          (acc, product) => acc + product.variants.length,
          0
        );
        const totalStock = products.reduce(
          (acc, product) =>
            acc +
            product.variants.reduce((sum, variant) => sum + variant.stock, 0),
          0
        );
        const lowStockProducts = products.filter((product) =>
          product.variants.some((variant) => variant.stock < 10)
        ).length;

        // Données pour les graphiques
        const stockByProduct = products
          .map((product) => ({
            name:
              product.name.length > 15
                ? product.name.substring(0, 15) + "..."
                : product.name,
            stock: product.variants.reduce(
              (sum, variant) => sum + variant.stock,
              0
            ),
          }))
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 10);

        const variantsByProduct = products
          .map((product) => ({
            name:
              product.name.length > 15
                ? product.name.substring(0, 15) + "..."
                : product.name,
            value: product.variants.length,
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setStats({
          totalProducts,
          totalVariants,
          lowStockProducts,
          totalStock,
          stockByProduct,
          variantsByProduct,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Produits",
      value: stats.totalProducts,
      icon: InventoryIcon,
      color: theme.palette.primary.main,
      description: "Nombre total de produits dans le catalogue",
    },
    {
      title: "Total Variantes",
      value: stats.totalVariants,
      icon: CategoryIcon,
      color: theme.palette.secondary.main,
      description: "Nombre total de variantes tous produits confondus",
    },
    {
      title: "Stock Faible",
      value: stats.lowStockProducts,
      icon: WarningIcon,
      color: theme.palette.warning.main,
      description: "Produits avec un stock inférieur à 10 unités",
    },
    {
      title: "Stock Total",
      value: stats.totalStock,
      icon: InventoryIcon,
      color: theme.palette.error.main,
      description: "Nombre total d'unités en stock",
    },
  ];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
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
          Tableau de bord
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/admin/products/new")}
          color="primary"
        >
          Nouveau Produit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: 2,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: (theme) => theme.shadows[4],
                  },
                }}
                elevation={1}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography color="textSecondary" variant="h6" component="h2">
                    {stat.title}
                  </Typography>
                  <Icon sx={{ color: stat.color, fontSize: 40 }} />
                </Box>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{ fontWeight: "medium", mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.description}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Top 10 - Stock par produit
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={stats.stockByProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="stock"
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Distribution des variantes
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie
                  data={stats.variantsByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.variantsByProduct.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              👋 Bienvenue dans votre espace administrateur
            </Typography>
            <Typography>
              Cette interface vous permet de gérer votre catalogue de produits.
              Vous pouvez ajouter, modifier et supprimer des produits, ainsi que
              gérer leurs variantes et leurs stocks. Les fonctionnalités de
              vente et de gestion des commandes seront disponibles
              prochainement.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
