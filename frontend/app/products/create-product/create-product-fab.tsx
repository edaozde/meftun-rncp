"use client";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateProductModal from './create-produc-modal';


export default function CreateProductFab() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <CreateProductModal
        open={modalVisible}
        handleClose={() => setModalVisible(false)}
      />
      <Fab
        color="primary"
        onClick={() => setModalVisible(true)}
        sx={{
          position: "center",
          bottom: 30,
          right: 16, // ✅ Positionné en bas à droite comme sur les standards UI
          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      >
        <AddIcon />
      </Fab>
    </>
  );
}