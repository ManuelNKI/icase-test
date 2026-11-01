import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="Vista de Código QR Generado GF GourmetFlow Sistema en línea Detalle Platillo Reserva Código QR Paquetes Puntos Código QR de Reserva Presente este código al mesero para ingresar [QR-RES-2023-0815] ID Reserva: #RES-8492 Fecha/Hora: 15 Oct, 20:30 Mesa Asignada: Mesa 04 (4 personas) Estado: Pendiente validación Actualizar Código Volver a Mis Reservas GourmetFlow Mobile - Cliente";
export default function VistaDeCodigoQrGenerado(){return <OperationScreen title="Vista de Código QR Generado" capabilities={["rf-02","rf-04","rf-08"]} referenceText={referenceText}/>;}
