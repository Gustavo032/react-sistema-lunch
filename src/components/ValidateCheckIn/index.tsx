// import React, { useState } from 'react';
// import QrReader, { useQrReader } from 'react-qr-reader';

// const ReadQRCode = () => {
//   const [checkInId, setCheckInId] = useState('');

//   const handleScan = (result:any) => {
//     if (result) {
//       setCheckInId(result);
//     }
//   };

// 	const QrReaderInstance = QrReader.QrReader({constraints: {facingMode: 'environment'}});
//   return (
//     <div>
//       <h1>Check-in QR Code</h1>
//       <QrReaderInstance
//         constraints={{ facingMode: 'environment' }}
//         onScan={handleScan}
//         style={{ width: '100%' }}
//       />
//       <p>Check-in ID: {checkInId}</p>
//     </div>
//   );
// };

// export default ReadQRCode;

export function ReadQRCode(){
	return
}