"use client";

import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { Product as IProduct } from "../../products/interfaces/product.interface";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import NoImageIcon from "@mui/icons-material/Image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface ShopProductProps {
  product: IProduct;
}

export default function ShopProduct({ product }: ShopProductProps) {
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
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
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

        {/* Price and Add to Cart */}
        <Box sx={{ 
          mt: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartIcon />}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Ajouter
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 