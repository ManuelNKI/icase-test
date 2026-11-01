import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="GourmetFlow - Detalle de Platillo GF GourmetFlow Sistema en línea [Imagen de Platillo] Lomito Saltado Especial Disponible Trozos de lomo fino salteados al wok con cebolla, tomates, ají amarillo, servido con papas fritas y arroz. Precio $18.50 Puntos a acumular +185 pts Cantidad - + Agregar al pedido - $18.50 Detalle Reservas QR Paquetes Puntos";
export default function VistaDeDetalleDePlatillo(){return <OperationScreen title="Vista de Detalle de Platillo" capabilities={["rf-01","rf-04","rf-05","rf-06","rf-07","rf-08","rf-10"]} referenceText={referenceText}/>;}
