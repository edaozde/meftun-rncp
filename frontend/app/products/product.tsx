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
  Box,
  Grid,
} from "@mui/material";
import { Product as IProduct } from "./interfaces/product.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { API_URL } from "../common/constants/api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ProductProps {
  product: IProduct;
  onDelete: (id: number) => void;
}

export default function Product({ product, onDelete }: ProductProps) {
  const router = useRouter();
  const theme = useTheme();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        {" "}
        {/* ✅ Plus besoin de styles ici */}
        <Stack direction="row" justifyContent="space-between" sx={{ p: 1 }}>
          <Tooltip title="Modifier">
            <IconButton
              onClick={() => router.push(`/products/edit/${product.id}`)}
              color="primary"
            >
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
          sx={{ padding: "16px", textAlign: "center" }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme.palette.primary.main}
          >
            {product.name}
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              backgroundColor: theme.palette.grey[300],
              borderRadius: theme.shape.borderRadius,
              overflow: "hidden",
              marginTop: "8px",
            }}
          >
            {product.imageExists && !imageError ? (
              <>
                {imageLoading && (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                )}
                <Image
                  src={`${API_URL}/products/${product.id}.jpg`}
                  alt={`Photo du produit ${product.name}`}
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
                  color: theme.palette.text.secondary,
                }}
              >
                Image non disponible
              </Typography>
            )}
          </Box>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ marginTop: "8px" }}
          >
            {product.description || "Aucune description disponible"}
          </Typography>

          {product.variants.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ marginTop: "8px" }}
            >
              <Chip
                label={`${
                  new Set(product.variants.map((v) => v.size)).size
                } taille(s)`}
              />
              <Chip
                label={`${
                  new Set(product.variants.map((v) => v.color)).size
                } couleur(s)`}
              />
            </Stack>
          )}

          {product.variants.some((v) => v.stock < 5) && (
            <Chip
              label="Stock Faible"
              sx={{ backgroundColor: theme.palette.error.main }}
            />
          )}

          <Typography
            variant="h6"
            sx={{ marginTop: "8px", fontWeight: "bold" }}
          >
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 2,
            }).format(product.price)}
          </Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
