const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxMw1G-fREEe4VNRMYA7G0WjJ0GI4T4biY8EOv3envjoC6Ql7FcuRGQJzYs3Kp2BuOcFw/exec';

export interface FeedbackSubmissionPayload {
  name: string;
  contact: string;
  topic: string;
  message: string;
}

export async function submitFeedbackRequest(payload: FeedbackSubmissionPayload): Promise<void> {
  const payloadBody = JSON.stringify(payload);

  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: payloadBody,
  });
}
