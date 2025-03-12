"use client";

import { Box, Container } from "@mui/material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box 
      sx={{ 
        mt: "64px", // Espace pour le header fixe
        minHeight: 'calc(100vh - 64px)',
        bgcolor: '#f5f5f5',
        py: 3
      }}
    >
      <Container maxWidth="xl">
        {children}
      </Container>
    </Box>
  );
} 