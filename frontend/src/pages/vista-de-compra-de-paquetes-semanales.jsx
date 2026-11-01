import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="Compra de Paquetes Semanales - GourmetFlow GF GourmetFlow Sistema en línea Paquetes Semanales Cliente Paquete Ejecutivo Semanal 10 almuerzos completos incluidos $45.00 +450 puntos de bonificación Comprar Paquete Premium Semanal 14 comidas gourmet personalizadas $70.00 +700 puntos de bonificación Comprar Paquete Ligero Semanal 5 ensaladas y bebidas detox $25.00 +250 puntos de bonificación Comprar Platillo Reserva QR Paquetes Puntos";
export default function VistaDeCompraDePaquetesSemanales(){return <OperationScreen title="Vista de Compra de Paquetes Semanales" capabilities={["rf-03","rf-04","rf-08"]} referenceText={referenceText}/>;}
