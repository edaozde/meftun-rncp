"use client";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Product as IProduct } from "../interfaces/product.interface";
import updateProduct from "../actions/update-product";

interface UpdateProductModalProps {
  open: boolean;
  handleClose: () => void;
  product: IProduct;
}

export default function UpdateProductModal({
  open,
  handleClose,
  product,
}: UpdateProductModalProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<{ error?: string }>({});

  // 🛠 Mettre à jour les valeurs si on change de produit
  useEffect(() => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
  }, [product]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description || price === "") {
      setResponse({ error: "Tous les champs sont obligatoires !" });
      return;
    }

    const parsedPrice = parseFloat(price.replace(",", "."));
    if (isNaN(parsedPrice)) {
      setResponse({ error: "Le prix doit être un nombre valide !" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", parsedPrice.toString());

      if (file) {
        formData.append("image", file);
      }

      console.log(`📤 Envoi de la requête PUT pour modifier le produit ${product.id}`);
      const response = await updateProduct(product.id, formData);
      console.log("✅ Réponse API :", response);

      if (!response.error) {
        handleClose(); // ✅ Ferme le modal après succès
      } else {
        setResponse({ error: response.error });
      }
    } catch (error) {
      console.error("🚨 Erreur :", error);
      setResponse({ error: "Une erreur est survenue, veuillez réessayer." });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Modifier le produit</DialogTitle>
      <DialogContent>
        <Stack spacing={2} component="form" onSubmit={handleSubmit}>
          <TextField label="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <TextField label="Prix" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Button component="label">
            Charger une image
            <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </Button>
        </Stack>
        {response.error && (
          <p style={{ color: "red", marginTop: "10px" }}>{response.error}</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
}
