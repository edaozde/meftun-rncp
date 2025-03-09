"use client";

import { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import createProduct from "@/app/products/actions/create-product";

interface Variant {
  size: string;
  color: string;
  stock: number;
}

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      submitData.append("variants", JSON.stringify(variants));

      const response = await createProduct(submitData);
      if (!response.error) {
        router.push("/admin/products");
      }
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
    } finally {
      setLoading(false);
    }
  };

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
          Nouveau Produit
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
                    required
                    fullWidth
                    type="file"
                    label="Image du produit"
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
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: "#2D7DD2" }}
          >
            {loading ? "Création en cours..." : "Créer le produit"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
