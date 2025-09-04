import React from 'react';
import { SPIN_DURATION_MS, WHEEL_COLORS } from '../constants';

interface WheelProps {
  restaurants: string[];
  rotation: number;
}

// Un composant d'aide pour afficher chaque étiquette de restaurant.
// Il positionne et fait pivoter le texte pour qu'il s'intègre bien dans chaque segment de la roue.
const RestaurantLabel: React.FC<{ restaurant: string; angle: number }> = ({ restaurant, angle }) => {
  const labelStyle: React.CSSProperties = {
    // Positionne l'origine du conteneur au centre de la roue
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Fait pivoter l'ensemble du conteneur de l'étiquette pour qu'il pointe vers l'extérieur au milieu du segment
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
  };

  const textStyle: React.CSSProperties = {
    display: 'inline-block',
    // Le texte est poussé vers l'extérieur du centre et tourné de 90 degrés pour qu'il soit droit.
    transform: `translate(100px, -50%) rotate(90deg)`,
    // Une ombre de texte plus forte améliore la lisibilité sur différentes couleurs de fond.
    textShadow: '0px 2px 4px rgba(0,0,0,0.6)',
    textAlign: 'center',
    width: '150px', // Donne une largeur pour aider au centrage du texte plus long
  };

  // Logique pour forcer un saut de ligne pour des noms de restaurant spécifiques.
  const getLabelContent = () => {
    switch (restaurant) {
      case 'Galerie Lafayette':
        return <>Galerie<br />Lafayette</>;
      case 'demander à Kassy':
        return <>demander<br />à Kassy</>;
      case 'Prêt à manger':
        return <>Prêt<br />à manger</>;
      case 'Chinois à 10€':
        return <>Chinois<br />à 10€</>;
      case 'Ne pas manger':
        return <>Ne pas<br />manger</>;
      default:
        return restaurant;
    }
  };

  return (
    <div style={labelStyle}>
      <span className="text-sm font-bold text-white" style={textStyle}>
        {getLabelContent()}
      </span>
    </div>
  );
};


const Wheel: React.FC<WheelProps> = ({ restaurants, rotation }) => {
  const numRestaurants = restaurants.length;
  const segmentAngle = 360 / numRestaurants;

  // Génère programmatiquement le dégradé conique pour les segments de la roue en utilisant les couleurs importées.
  const gradientParts = restaurants.map((_, index) => {
    const startAngle = index * segmentAngle;
    const endAngle = startAngle + segmentAngle;
    // Utilise la couleur du tableau WHEEL_COLORS, en revenant au début s'il y a plus de restaurants que de couleurs.
    const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
    return `${color} ${startAngle}deg ${endAngle}deg`;
  });
  
  // L'angle `from` dans le conic-gradient est décalé pour aligner correctement le pointeur
  // avec le milieu des segments, et non les bords.
  const conicGradient = `conic-gradient(from -${segmentAngle / 2}deg, ${gradientParts.join(', ')})`;
  
  // Styles dynamiques nécessaires pour l'animation de rotation et l'arrière-plan.
  const wheelStyle: React.CSSProperties = {
    background: conicGradient,
    transform: `rotate(${rotation}deg)`,
    transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`, // effet de ralentissement plus agréable
  };

  return (
    <div className="relative w-[500px] h-[500px] rounded-full border-8 border-slate-700 shadow-2xl bg-slate-800">
      <div className="w-full h-full rounded-full overflow-hidden" style={wheelStyle}>
        {restaurants.map((restaurant, index) => {
          // Calcule l'angle pour le milieu de chaque segment.
          const angle = segmentAngle * index + segmentAngle / 2;
          return <RestaurantLabel key={index} restaurant={restaurant} angle={angle} />;
        })}
      </div>
    </div>
  );
};

export default Wheel;