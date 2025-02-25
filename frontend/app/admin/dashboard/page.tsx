"use client";

import { useEffect, useState } from "react";
import { 
  Card, Typography, CircularProgress, Grid, Button, Container, Divider
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useRouter } from "next/navigation";
import getProducts from "@/app/products/actions/get-products";
import { Product } from "@/app/products/interfaces/product.interface";

interface DashboardStats {
  totalProducts: number;
  totalVariants: number;
  totalStock: number;
  totalValue: number;
  mostExpensiveProduct: string;
  salesData: { name: string; sales: number }[];
  priceEvolution: { name: string; price: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const productsData = await getProducts();

        const totalProducts = productsData.length;
        const totalVariants = productsData.reduce((acc, p) => acc + p.variants.length, 0);
        const totalStock = productsData.reduce((acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stock, 0), 0);
        const totalValue = productsData.reduce((acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stock * p.price, 0), 0);

        const mostExpensive = productsData.reduce((prev, curr) => (curr.price > prev.price ? curr : prev), productsData[0]);

        // Générer des ventes simulées (remplacer par des données réelles si dispo)
        const salesData = productsData.map((p) => ({
          name: p.name,
          sales: Math.floor(Math.random() * 50),
        }));

        // Évolution des prix (à remplacer par des prix historiques si dispo)
        const priceEvolution = productsData.map((p) => ({
          name: p.name,
          price: p.price,
        }));

        setStats({
          totalProducts,
          totalVariants,
          totalStock,
          totalValue,
          mostExpensiveProduct: mostExpensive.name,
          salesData,
          priceEvolution,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des stats:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      {/* ✅ Titre du Dashboard */}
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 4, color: "#2D7DD2" }}>
        Dashboard Admin
      </Typography>

      {/* ✅ Bouton pour aller à la gestion des produits (bien visible) */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#2D7DD2",
          color: "#fff",
          fontWeight: "bold",
          mb: 4,
          display: "block",
          mx: "auto",
        }}
        onClick={() => router.push("/products")}
      >
        ➜ Gérer les Produits
      </Button>

      {/* ✅ Chargement */}
      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto" }} />
      ) : stats ? (
        <>
          {/* ✅ Section Stats Globales */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, backgroundColor: "#F0F4FF", borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Produits</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D7DD2" }}>
                  {stats.totalProducts}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, backgroundColor: "#F0F4FF", borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Variantes</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D7DD2" }}>
                  {stats.totalVariants}
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ p: 3, backgroundColor: "#F0F4FF", borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h6">Stock Total</Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2D7DD2" }}>
                  {stats.totalStock}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* ✅ Séparateur avant Graphiques */}
          <Divider sx={{ my: 4 }} />

          {/* ✅ Section Graphiques */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                📊 Ventes par produit
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#2D7DD2" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                💰 Comparaison des prix
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.priceEvolution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#E63946" />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography color="error" sx={{ textAlign: "center" }}>
          ❌ Erreur de chargement des statistiques
        </Typography>
      )}
    </Container>
  );
}
