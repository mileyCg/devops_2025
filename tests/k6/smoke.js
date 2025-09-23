import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  duration: '15s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  const res = http.get(`${BASE_URL}/api/goals/health`);
  check(res, {
    'API is accessible': (r) => r.status === 200,
    'API returns expected content': (r) => r.body && r.body.includes('running'),
    'API responds within 1 second': (r) => r.timings.duration < 1000,
    'API responds within 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}


