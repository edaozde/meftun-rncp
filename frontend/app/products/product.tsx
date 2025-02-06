"use client";

import {
  Card,
  CardActionArea,
  Stack,
  Typography,
  Chip,
  Skeleton,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product as IProduct } from "./interfaces/product.interface";
import { API_URL } from "../common/constants/api";

interface ProductProps {
  product: IProduct;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Vérifie si la valeur "color" est un code hexadécimal valide.
   */
  const isValidColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  /**
   * Gère l'affichage des variantes de couleurs / tailles sous forme de puces.
   */
  const variantsSummary = () => {
    if (!product.variants?.length) return null;

    const sizeCount = new Set(product.variants.map((v) => v.size)).size;
    const colorCount = new Set(product.variants.map((v) => v.color)).size;

    return (
      <div className="flex flex-col gap-2">
        {/* Affiche le nombre total de tailles et de couleurs */}
        <div className="flex items-center gap-2">
          {sizeCount > 0 && (
            <Chip
              label={`${sizeCount} taille${sizeCount > 1 ? "s" : ""}`}
              size="small"
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
            />
          )}
          {colorCount > 0 && (
            <Chip
              label={`${colorCount} couleur${colorCount > 1 ? "s" : ""}`}
              size="small"
              className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-300"
            />
          )}
        </div>

        {/* Affiche jusqu'à 5 pastilles de couleurs */}
        <div className="flex flex-wrap gap-1">
          {product.variants.slice(0, 5).map((variant, index) => (
            <Tooltip key={index} title={variant.color} arrow>
              <div
                className="w-6 h-6 rounded-full border"
                style={{
                  backgroundColor: isValidColor(variant.color)
                    ? variant.color
                    : "#fff",
                  borderColor: isValidColor(variant.color)
                    ? variant.color
                    : "#666",
                }}
              />
            </Tooltip>
          ))}
          {/* Indique s'il y a plus de 5 couleurs */}
          {product.variants.length > 5 && (
            <span className="text-gray-500 dark:text-gray-400">
              +{product.variants.length - 5} autres
            </span>
          )}
        </div>
      </div>
    );
  };

  /**
   * Fonction de suppression du produit
   */
  const handleDeleteProduct = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de remonter à CardActionArea
    setIsDeleting(true); // Démarre l'état "en cours de suppression"
    try {
      const response = await fetch(`${API_URL}/products/${product.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        console.log("Produit supprimé avec succès");
        router.push("/products");
      } else {
        console.error("Erreur lors de la suppression du produit");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CardActionArea
      role="button"
      tabIndex={0}
      aria-label={`Voir le produit : ${product.name}`}
      onClick={() => {
        // Si on supprime le produit, on empêche la navigation
        if (!isDeleting) {
          router.push(`/products/${product.id}`);
        }
      }}
      className="focus:ring-2 focus:ring-primary-main dark:focus:ring-primary-light"
    >
      <Card
        className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        aria-busy={isDeleting} // Signale qu'une action (suppression) est en cours
      >
        <Stack spacing={2} className="p-4 relative">
          {/* Titre du produit */}
          <Typography variant="h6" component="h2" id={`product-title-${product.id}`}>
            {product.name}
          </Typography>

          {/* Bouton de suppression */}
          <IconButton
            component="span"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleDeleteProduct}
            color="error"
            aria-label="Supprimer le produit"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
            disabled={isDeleting}
          >
            <DeleteIcon />
          </IconButton>

          {/* Image du produit */}
          <div
            className="relative aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg"
            aria-labelledby={`product-title-${product.id}`}
          >
            {product.imageExists && !imageError ? (
              <>
                {imageLoading && (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                )}
                <Image
                  src={`${API_URL}/products/${product.id}.jpg`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  alt={`Image du produit : ${product.name}`}
                  onError={() => setImageError(true)}
                  onLoadingComplete={() => setImageLoading(false)}
                />
              </>
            ) : (
              <Typography className="text-gray-500 dark:text-gray-400">
                Image non disponible
              </Typography>
            )}
          </div>

          {/* Description */}
          <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
            {product.description || "Aucune description disponible"}
          </Typography>

          {/* Variantes (couleurs / tailles) */}
          {variantsSummary()}

          {/* Prix */}
          <Typography
            variant="h6"
            className="font-bold text-primary-main dark:text-primary-light"
          >
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </Typography>
        </Stack>
      </Card>
    </CardActionArea>
  );
}
