"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Product as IProduct } from "../../products/interfaces/product.interface";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import NoImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

interface AdminProductProps {
  product: IProduct;
  onDelete: (id: number) => void;
}

export default function AdminProduct({ product, onDelete }: AdminProductProps) {
  const theme = useTheme();
  const router = useRouter();
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
              label={`${variant.size} - ${variant.color} (${variant.stock})`}
              size="small"
              variant="outlined"
              color={variant.stock < 5 ? "error" : "default"}
              sx={{
                bgcolor: "background.paper",
                borderColor: theme.palette.divider,
              }}
            />
          ))}
        </Stack>

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
