"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { Product } from "@/app/products/interfaces/product.interface";
import getProduct from "@/app/products/[productId]/get-product";
import updateProduct from "@/app/products/actions/update-product";

interface Variant {
  size: string;
  color: string;
  stock: number;
}

export default function EditProduct({
  params,
}: {
  params: { productId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null as File | null,
  });
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    size: "",
    color: "",
    stock: 0,
  });

  useEffect(() => {
    loadProduct();
  }, [params.productId]);

  const loadProduct = async () => {
    try {
      const data = await getProduct(parseInt(params.productId));
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        image: null,
      });
      setVariants(data.variants);
    } catch (error) {
      console.error("Erreur lors du chargement du produit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleAddVariant = () => {
    if (newVariant.size && newVariant.color && newVariant.stock > 0) {
      setVariants([...variants, newVariant]);
      setNewVariant({ size: "", color: "", stock: 0 });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      submitData.append("variants", JSON.stringify(variants));

      const response = await updateProduct(
        parseInt(params.productId),
        submitData
      );
      if (!response.error) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography color="error">Produit non trouvé</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: "#2D7DD2" }}
        >
          Modifier le Produit
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    required
                    fullWidth
                    label="Nom du produit"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />

                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />

                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Prix"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: "€",
                    }}
                  />

                  <TextField
                    fullWidth
                    type="file"
                    label="Nouvelle image du produit"
                    onChange={handleImageChange}
                    InputProps={{
                      inputProps: {
                        accept: "image/*",
                      },
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Variantes
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    label="Taille"
                    value={newVariant.size}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, size: e.target.value })
                    }
                  />

                  <TextField
                    label="Couleur"
                    value={newVariant.color}
                    onChange={(e) =>
                      setNewVariant({ ...newVariant, color: e.target.value })
                    }
                  />

                  <TextField
                    type="number"
                    label="Stock"
                    value={newVariant.stock}
                    onChange={(e) =>
                      setNewVariant({
                        ...newVariant,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                  />

                  <Button
                    variant="outlined"
                    onClick={handleAddVariant}
                    disabled={
                      !newVariant.size ||
                      !newVariant.color ||
                      newVariant.stock <= 0
                    }
                  >
                    Ajouter une variante
                  </Button>

                  <Box sx={{ mt: 2 }}>
                    {variants.map((variant, index) => (
                      <Chip
                        key={index}
                        label={`${variant.size} - ${variant.color} (${variant.stock})`}
                        onDelete={() => handleRemoveVariant(index)}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ backgroundColor: "#2D7DD2" }}
          >
            {saving
              ? "Enregistrement en cours..."
              : "Enregistrer les modifications"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
