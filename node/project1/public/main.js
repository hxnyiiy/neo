
// // Geolocation으로 현재 위치 받아서 백엔드로 전송
// function sendCurrentLocation() {
//     if (!navigator.geolocation) {
//       alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
//       return;
//     }
  
//     navigator.geolocation.getCurrentPosition(
//       position => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
  
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', 'http://192.168.1.39:3000/currentloc');
//         xhr.setRequestHeader('Content-Type', 'application/json');
        
//         xhr.onreadystatechange = function() {
//           if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//               const data = JSON.parse(xhr.responseText);
//               console.log('위치 전송 성공:', data);
//               addLog(` 현재 위치 : (${latitude}, ${longitude})`);
//             } else {
//               console.error('위치 전송 실패:', xhr.statusText);
//               addLog(' 위치 전송 실패: ' + xhr.statusText);
//             }
//           }
//         };

//         xhr.onerror = function() {
//           console.error('위치 전송 실패:', xhr.statusText);
//           addLog(' 위치 전송 실패: ' + xhr.statusText);
//         };

//         xhr.send(JSON.stringify({ latitude, longitude }));
//       },
//       error => {
//         alert('위치 정보를 가져올 수 없습니다.');
//         console.error(error);
//       }
//     );
// }
// window.sendCurrentLocation = sendCurrentLocation;







