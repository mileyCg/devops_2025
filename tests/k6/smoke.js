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
    'status is 200': (r) => r.status === 200,
    'body contains running': (r) => r.body && r.body.includes('running'),
  });
  sleep(1);
}

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
    'status is 200': (r) => r.status === 200,
    'body contains running': (r) => r.body && r.body.includes('running'),
  });
  sleep(1);
}


