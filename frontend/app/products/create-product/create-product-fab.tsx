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
      <div className="absolute left-10 bottom-10">
        <Fab color="primary" onClick={() => setModalVisible(true)}>
          <AddIcon />
        </Fab>
      </div>
    </>
  );
}