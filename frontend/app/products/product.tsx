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
  Box
} from "@mui/material";
import { Product as IProduct } from "./interfaces/product.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { API_URL } from "../common/constants/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ **Styles pour les cartes**
const ProductCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  height: "100%", 
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledPrice = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.2rem",
  color: "#2D7DD2",
}));

interface ProductProps {
  product: IProduct;
  onDelete: (id: string) => void; // Fonction pour supprimer un produit
}

export default function Product({ product, onDelete }: ProductProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isValidColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  const variantsSummary = () => {
    if (!product.variants?.length) return null;

    const sizeCount = new Set(product.variants.map((v) => v.size)).size;
    const colorCount = new Set(product.variants.map((v) => v.color)).size;

    return (
      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          {sizeCount > 0 && (
            <Chip
              label={`${sizeCount} taille${sizeCount > 1 ? "s" : ""}`}
              size="small"
              sx={{
                backgroundColor: "#D0D7FF",
                color: "#2D7DD2",
                fontWeight: 600,
              }}
            />
          )}
          {colorCount > 0 && (
            <Chip
              label={`${colorCount} couleur${colorCount > 1 ? "s" : ""}`}
              size="small"
              sx={{
                backgroundColor: "#FFEBE8",
                color: "#E63946",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>
      </Stack>
    );
  };

  return (
    <ProductCard>
      {/* ✅ Ajout des boutons Modifier et Supprimer en haut */}
      <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
        <Tooltip title="Modifier">
          <IconButton onClick={() => router.push(`/products/edit/${product.id}`)} color="primary">
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton onClick={() => onDelete(product.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <CardActionArea
        onClick={() => router.push(`/products/edit/${product.id}`)} 
        sx={{ padding: "16px", height: "100%" }}
      >
        <Stack spacing={2} sx={{ height: "100%", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            {product.name}
          </Typography>

          {/* ✅ Image bien carrée et responsive */}
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              backgroundColor: "#F0F0F0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {product.imageExists && !imageError ? (
              <>
                {imageLoading && (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ position: "absolute", top: 0, left: 0 }}
                  />
                )}
                <Image
                  src={`${API_URL}/products/${product.id}.jpg`}
                  alt={`Image de ${product.name}`}
                  layout="fill"
                  objectFit="cover"
                  onError={() => setImageError(true)}
                  onLoadingComplete={() => setImageLoading(false)}
                />
              </>
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#666",
                  paddingTop: "45%",
                  position: "absolute",
                  width: "100%",
                }}
              >
                Image non disponible
              </Typography>
            )}
          </div>

          <Typography variant="body2" color="textSecondary">
            {product.description || "Aucune description disponible"}
          </Typography>

          {variantsSummary()}

          {/* ✅ Badge Stock faible */}
          {product.variants.some((v) => v.stock < 5) && (
            <Chip label="Stock Faible" color="error" size="small" sx={{ fontWeight: 600 }} />
          )}

          {/* ✅ Prix bien visible et attractif */}
          <StyledPrice>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
            }).format(product.price)}
          </StyledPrice>
        </Stack>
      </CardActionArea>
    </ProductCard>
  );
}
