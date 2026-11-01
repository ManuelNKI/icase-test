import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="Vista de Saldo de Puntos GF GourmetFlow Sistema en línea Saldo Disponible 1,250 Puntos Equivalente a $12.50 USD en consumo ★ Todos Ganados Canjeados Compra en Sucursal Central 12 Oct 2023, 14:30 +150 pts Canje por Postre Gratis 10 Oct 2023, 20:15 -300 pts Pedido Móvil #4489 05 Oct 2023, 13:10 +220 pts Canjear Puntos Menú Reservas QR Paquetes Puntos";
export default function VistaDeSaldoDePuntos(){return <OperationScreen title="Vista de Saldo de Puntos" capabilities={["rf-04","rf-08"]} referenceText={referenceText}/>;}
