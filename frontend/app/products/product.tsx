"use client";

import {
  Card,
  CardActionArea,
  Stack,
  Typography,
  Chip,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { Product as IProduct } from "./interfaces/product.interface";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from "../common/constants/api";

interface ProductProps {
  product: IProduct;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const isValidColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

  const variantsSummary = () => {
    if (!product.variants?.length) return null;

    const sizeCount = new Set(product.variants.map((v) => v.size)).size;
    const colorCount = new Set(product.variants.map((v) => v.color)).size;

    return (
      <div className="flex flex-col gap-2">
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
          {product.variants.length > 5 && (
            <span className="text-gray-500 dark:text-gray-400">
              +{product.variants.length - 5} autres
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    // Wrapper modifié pour occuper exactement la hauteur de l'écran sans débordement
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="w-full max-w-md">
        <CardActionArea
          onClick={() => router.push(`/products/${product.id}`)}
          className="focus:ring-2 focus:ring-primary-main dark:focus:ring-primary-light"
        >
          <Card className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <Stack spacing={2} className="p-4">
              <Typography variant="h6" component="h2">
                {product.name}
              </Typography>

              <div className="relative aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg">
                {product.imageExists && !imageError ? (
                  <>
                    {imageLoading && (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                      />
                    )}
                    <Image
                      src={`${API_URL}/products/${product.id}.jpg`}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      alt="Picture of the product"
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

              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-300"
              >
                {product.description || "Aucune description disponible"}
              </Typography>

              {variantsSummary()}

              <Typography
                variant="h6"
                className="font-bold text-primary-main dark:text-primary-light"
              >
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 2,
                }).format(product.price)}
              </Typography>
            </Stack>
          </Card>
        </CardActionArea>
      </div>
    </div>
  );
}
