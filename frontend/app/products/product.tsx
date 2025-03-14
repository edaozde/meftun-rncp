"use client";

import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import { Product as IProduct } from "./interfaces/product.interface";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import NoImageIcon from "@mui/icons-material/Image";

interface ProductProps {
  product: IProduct;
  onDelete: (id: number) => void;
}

export default function Product({ product, onDelete }: ProductProps) {
  const router = useRouter();
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  const hasImage = product.images && product.images.length > 0;
  const mainImage = hasImage ? product.images[0].url : null;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Actions */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          top: -20,
          right: 8,
          zIndex: 2,
        }}
      >
        <Tooltip title="Modifier">
          <IconButton
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: theme.shadows[2],
              "&:hover": {
                bgcolor: theme.palette.primary.light,
                color: "white",
              },
            }}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton
            onClick={() => onDelete(product.id)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: theme.shadows[2],
              "&:hover": {
                bgcolor: theme.palette.error.light,
                color: "white",
              },
            }}
            size="small"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          pt: "100%",
          bgcolor: theme.palette.grey[100],
          overflow: "hidden",
        }}
      >
        {mainImage && !imageError ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${mainImage}`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1,
              color: theme.palette.text.secondary,
            }}
          >
            <NoImageIcon sx={{ fontSize: 40, opacity: 0.5 }} />
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Pas d'image
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontSize: "1.1rem",
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5em",
          }}
        >
          {product.description}
        </Typography>

        {/* Variants */}
        <Stack
          direction="row"
          spacing={0.5}
          flexWrap="wrap"
          sx={{ mb: 2, gap: 0.5 }}
        >
          {product.variants.map((variant, index) => (
            <Chip
              key={index}
              label={`${variant.size} - ${variant.color}`}
              size="small"
              variant="outlined"
              sx={{
                bgcolor: "background.paper",
                borderColor: theme.palette.divider,
              }}
            />
          ))}
        </Stack>

        {/* Stock Warning */}
        {product.variants.some((v) => v.stock < 5) && (
          <Chip
            label="Stock Faible"
            color="error"
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}

        {/* Price */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: theme.palette.primary.main,
            mt: "auto",
          }}
        >
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(product.price)}
        </Typography>
      </CardContent>
    </Card>
  );
}
