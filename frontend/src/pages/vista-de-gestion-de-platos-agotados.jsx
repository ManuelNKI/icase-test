import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="Gestión de Platos Agotados - GourmetFlow GF GourmetFlow Vista de Gestión de Platos Agotados Sistema en línea Gestión de Platos Agotados Personal de Cocina PC Todas las categorías Entradas Platos Fuertes Bebidas Actualizar Disponibilidad ID Platillo Nombre Precio Estado Actual Acción PLT-001 Lomo Saltado Tradicional $18.50 Disponible Marcar Agotado PLT-002 Ceviche Clásico $15.00 Agotado Marcar Disponible PLT-003 Ají de Gallina $14.00 Disponible Marcar Agotado";
export default function VistaDeGestionDePlatosAgotados(){return <OperationScreen title="Vista de Gestión de Platos Agotados" capabilities={["rf-01","rf-05","rf-06"]} referenceText={referenceText}/>;}
