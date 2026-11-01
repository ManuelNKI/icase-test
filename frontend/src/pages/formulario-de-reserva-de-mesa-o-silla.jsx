import React from 'react';
import OperationScreen from '../OperationScreen';
const referenceText="GourmetFlow - Reserva GourmetFlow Sistema en línea Menú Reserva QR Paquetes Puntos Nueva Reserva de Mesa Complete los datos para asegurar su lugar y acumular puntos. Fecha y Hora Número de Sillas / Personas Seleccionar Mesa Disponible Mesa 04 - Capacidad 4 (Disponible) Mesa 08 - Capacidad 2 (Disponible) Mesa 12 - Capacidad 6 (Ocupada) Al confirmar su reserva se generará un código QR único y acumulará puntos para su cuenta. Confirmar Reserva GourmetFlow App Cliente";
export default function FormularioDeReservaDeMesaOSilla(){return <OperationScreen title="Formulario de Reserva de Mesa o Silla" capabilities={["rf-02","rf-04","rf-07","rf-08"]} referenceText={referenceText}/>;}
