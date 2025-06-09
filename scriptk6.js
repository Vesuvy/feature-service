import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 2,
  duration: '5s',
};

export default function () {
  const res = http.get('http://localhost:8080/api/v1/features/1', {
    headers: {
      'Authorization': 'Bearer admin_token',
      'Content-Type': 'application/json',
    },
  });
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'no errors': (r) => r.status !== 500,
  });
}