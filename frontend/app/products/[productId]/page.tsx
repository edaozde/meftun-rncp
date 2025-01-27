"use client";

import { useState, useEffect } from "react";
import { Stack, Typography, MenuItem, Select, Button, Box } from "@mui/material";
import Image from "next/image";
import { getProductImage } from "../product-image";
import { post } from "@/app/common/util/fetch";
import getProduct from "./get-product";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageExists: boolean;
  variants: {
    id: number;
    size: string;
    color: string;
    stock: number;
  }[];
}

interface SingleProductProps {
  params: { productId: string };
}

export default function SingleProduct({ params }: SingleProductProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [availableStock, setAvailableStock] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(+params.productId);
        setProduct(data);
      } catch (err) {
        setError("Erreur lors du chargement du produit");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]);

  // Gestion des sélections de variantes
  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      const selectedVariant = product.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );
      setAvailableStock(selectedVariant ? selectedVariant.stock : 0);
    }
  }, [selectedSize, selectedColor, product]);

  // Ajout au panier
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Veuillez sélectionner une taille et une couleur.");
      return;
    }

    const selectedVariant = product?.variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );

    if (!selectedVariant) {
      alert("Variante non trouvée");
      return;
    }

    try {
      await post("cart", {
        productId: product?.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });
      alert("Produit ajouté au panier !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout au panier");
    }
  };

  if (isLoading) return <Typography>Chargement...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Produit non trouvé</Typography>;

  return (
    <Box p={4}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* Image du produit */}
        {product.imageExists && (
          <Box flex={1}>
            <Image
              src={getProductImage(product.id)}
              width={500}
              height={500}
              alt={product.name}
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Box>
        )}

        {/* Détails du produit */}
        <Box flex={1}>
          <Stack spacing={3}>
            <Typography variant="h3">{product.name}</Typography>
            <Typography>{product.description}</Typography>
            <Typography variant="h4" color="primary">
              ${product.price.toFixed(2)}
            </Typography>

            {/* Sélection de la taille */}
            <Select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              displayEmpty
              fullWidth
              disabled={!product.variants.length}
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
              disabled={!product.variants.length}
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
            {selectedSize && selectedColor && (
              <Typography>
                {availableStock > 0
                  ? `Stock disponible : ${availableStock}`
                  : "Rupture de stock"}
              </Typography>
            )}

            {/* Bouton Ajouter au panier */}
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || availableStock === 0}
              fullWidth
            >
              Ajouter au panier
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}