import { useState } from 'react';

export default function ProductPage({ params }: { params: { productId: string } }) {
  const [showRentalForm, setShowRentalForm] = useState(false);

  const handleRentProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');

    const response = await fetch('http://localhost:3001/rentals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        productId: Number(params.productId),
        userId: 1, // Remplace avec l'ID utilisateur connecté
      }),
    });

    if (response.ok) {
      alert('Produit loué avec succès !');
    } else {
      alert('Erreur lors de la location.');
    }
  };

  return (
    <div>
      <h1>Détails du produit</h1>
      {/* Bouton pour ouvrir le formulaire de location */}
      <button onClick={() => setShowRentalForm(true)}>Louer ce produit</button>

      {showRentalForm && (
        <form onSubmit={handleRentProduct}>
          <label>
            Date de début :
            <input type="date" name="startDate" required />
          </label>
          <label>
            Date de fin :
            <input type="date" name="endDate" required />
          </label>
          <button type="submit">Confirmer la location</button>
        </form>
      )}
    </div>
  );
}
