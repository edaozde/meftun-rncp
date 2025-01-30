"use client";

import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import createProduct from "../actions/create-product";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface CreateProductModalProps {
  open: boolean;
  handleClose: () => void;
}

export default function CreateProductModal({
  open,
  handleClose,
}: CreateProductModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [variants, setVariants] = useState<{ size: string; color: string; stock: number }[]>([
    { size: "", color: "", stock: 1 },
  ]);
  const [response, setResponse] = useState<{ error?: string } | null>(null);

  const onClose = () => {
    setResponse(null);
    setFile(null);
    setFileName("");
    setName("");
    setDescription("");
    setPrice("");
    setVariants([{ size: "", color: "", stock: 1 }]);
    handleClose();
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 1 }]);
  };

  const updateVariant = (index: number, field: "size" | "color" | "stock", value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = field === "stock" ? Number(value) || 0 : value as string;
    setVariants(newVariants);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !description || price === "" || variants.length === 0) {
      setResponse({ error: "Tous les champs sont obligatoires !" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", String(price).replace(",", "."));
      const variantsBlob = new Blob([JSON.stringify(variants)], { type: "application/json" });
      formData.append("variants", variantsBlob);
      if (file) {
        formData.append("image", file);
      }
      console.log("Données envoyées :", Object.fromEntries(formData.entries()));
      const response = await createProduct(formData);
      setResponse(response);
      if (!response.error) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la création du produit :", error);
      setResponse({ error: "Une erreur est survenue, veuillez réessayer." });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {response?.error && <Typography color="error">{response.error}</Typography>}
            <TextField label="Name" variant="outlined" required value={name} onChange={(e) => setName(e.target.value)} />
            <TextField label="Description" variant="outlined" required value={description} onChange={(e) => setDescription(e.target.value)} />
            <TextField label="Price" type="number" variant="outlined" required value={price} onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")} />
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
              Charger image
              <input type="file" style={{ display: "none" }} onChange={(e) => { if (e.target.files) { setFile(e.target.files[0]); setFileName(e.target.files[0].name); } }} />
            </Button>
            <Typography>{fileName}</Typography>
            <Typography variant="h6">Variants</Typography>
            {variants.map((variant, index) => (
              <Stack direction="row" spacing={1} key={index} alignItems="center">
                <TextField label="Size" variant="outlined" value={variant.size} onChange={(e) => updateVariant(index, "size", e.target.value)} />
                <TextField label="Color" variant="outlined" value={variant.color} onChange={(e) => updateVariant(index, "color", e.target.value)} />
                <TextField label="Stock" type="number" variant="outlined" value={variant.stock} onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value, 10) || 0)} />
                <Button variant="text" color="error" onClick={() => removeVariant(index)}>Remove</Button>
              </Stack>
            ))}
            <Button onClick={addVariant} variant="outlined">Add Variant</Button>
            <Button type="submit" variant="contained">Créer</Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}