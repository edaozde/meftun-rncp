"use client";

import { Stack, Typography, MenuItem, Select, Button } from "@mui/material";
import getProduct from "./get-product";
import Image from "next/image";
import { getProductImage } from "../product-image";
import Grid from "@mui/material/Grid"; // Utilise la version stable de Grid
import { useState, useEffect } from "react";

interface SingleProductProps {
  params: { productId: string };
}

export default function SingleProduct({ params }: SingleProductProps) {
  // Simuler les données d'un produit et ses variantes
  const product = {
    id: +params.productId,
    name: "Produit Exemple",
    description: "Description du produit exemple.",
    price: 99.99,
    imageExists: true,
    variants: [
      { size: "S", color: "Red", stock: 5 },
      { size: "M", color: "Blue", stock: 3 },
      { size: "L", color: "Black", stock: 0 },
    ],
  };

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableStock, setAvailableStock] = useState(0);

  // Met à jour le stock disponible en fonction des sélections
  useEffect(() => {
    const variant = product.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    setAvailableStock(variant ? variant.stock : 0);
  }, [selectedSize, selectedColor, product.variants]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Veuillez sélectionner une taille et une couleur.");
      return;
    }

    if (availableStock > 0) {
      alert(
        `Produit ajouté au panier avec la taille ${selectedSize} et la couleur ${selectedColor}.`
      );
    } else {
      alert("Cette variante est en rupture de stock.");
    }
  };

  return (
    <Grid container marginBottom={"2rem"} rowGap={3}>
      {product.imageExists && (
        <Grid md={6} xs={12}>
          <Image
            src={getProductImage(product.id)}
            width={0}
            height={0}
            className="w-full sm:w-3/4 h-auto"
            sizes="100vw"
            alt="Picture of the product"
          />
        </Grid>
      )}
      <Grid md={6} xs={12}>
        <Stack gap={3}>
          <Typography variant="h2">{product.name}</Typography>
          <Typography>{product.description}</Typography>
          <Typography variant="h4">${product.price}</Typography>

          {/* Sélection de la taille */}
          <Select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Sélectionnez une taille
            </MenuItem>
            {[...new Set(product.variants.map((v) => v.size))].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>

          {/* Sélection de la couleur */}
          <Select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Sélectionnez une couleur
            </MenuItem>
            {[...new Set(product.variants.map((v) => v.color))].map((color) => (
              <MenuItem key={color} value={color}>
                {color}
              </MenuItem>
            ))}
          </Select>

          {/* Affichage du stock */}
          <Typography>
            {selectedSize && selectedColor
              ? availableStock > 0
                ? `Stock disponible : ${availableStock}`
                : "Rupture de stock"
              : "Sélectionnez une taille et une couleur pour voir le stock."}
          </Typography>

          {/* Bouton Ajouter au panier */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={availableStock === 0}
          >
            Ajouter au panier
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
