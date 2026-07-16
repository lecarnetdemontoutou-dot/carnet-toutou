export async function sendSms({ to, message }: { to: string; message: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY manquant");

  // Normalise le numéro en format international (+33...)
  const normalized = to.replace(/\s/g, "").replace(/^0/, "+33");

  const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: "Toutou",
      recipient: normalized,
      content: message,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo SMS error: ${err}`);
  }
}
