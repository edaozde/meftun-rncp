"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import createProduct from "@/app/products/actions/create-product";
import { Product } from "@/app/products/interfaces/product.interface";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "" as string | number,
    variants: [{ size: "", color: "", stock: 1 }],
  });
  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price") {
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          price: "",
        }));
      } else {
        const parsedValue = parseFloat(value);
        setFormData((prev) => ({
          ...prev,
          price: isNaN(parsedValue) ? "" : parsedValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVariantChange = (
    index: number,
    field: keyof (typeof formData.variants)[0],
    value: string
  ) => {
    const newVariants = [...formData.variants];
    if (field === "stock") {
      newVariants[index][field] = parseInt(value) || 0;
    } else {
      newVariants[index][field] = value;
    }
    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 1 }],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.description || formData.price === "") {
        setError("Tous les champs sont obligatoires !");
        setLoading(false);
        return;
      }

      const hasEmptyVariant = formData.variants.some((v) => !v.size || !v.color);
      if (hasEmptyVariant) {
        setError("Toutes les variantes doivent avoir une taille et une couleur.");
        setLoading(false);
        return;
      }

      const parsedPrice = parseFloat(formData.price.toString().replace(",", "."));
      if (isNaN(parsedPrice)) {
        setError("Le prix doit être un nombre valide !");
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", parsedPrice.toString());
      submitData.append("variants", JSON.stringify(formData.variants));

      if (file) {
        submitData.append("image", file);
      }

      console.log("Données envoyées via FormData:", {
        name: formData.name,
        description: formData.description,
        price: parsedPrice,
        variants: formData.variants
      });

      const response = await createProduct(submitData);

      if (response.error) {
        throw new Error(response.error);
      }

      router.push("/admin/products");
      router.refresh();

    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => router.push("/admin/products")}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Nouveau Produit
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nom du produit"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  required
                />

                <TextField
                  fullWidth
                  label="Prix"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  inputProps={{
                    step: "0.01",
                    min: "0",
                  }}
                  InputProps={{
                    startAdornment: "€",
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  border: "2px dashed",
                  borderColor: "divider",
                  textAlign: "center",
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Typography color="textSecondary">
                  {file
                    ? file.name
                    : "Glissez une image ou cliquez pour sélectionner"}
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Variantes
              </Typography>
              <Stack spacing={2}>
                {formData.variants.map((variant, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Taille"
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Couleur"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Stock"
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(index, "stock", e.target.value)
                      }
                      required
                      fullWidth
                    />
                    {formData.variants.length > 1 && (
                      <IconButton
                        onClick={() => removeVariant(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Stack>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addVariant}
                  variant="outlined"
                >
                  Ajouter une variante
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                fullWidth
                size="large"
              >
                {loading ? "Création en cours..." : "Créer le produit"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
