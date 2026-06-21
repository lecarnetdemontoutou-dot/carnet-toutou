export async function sendEmail({
  to,
  subject,
  html,
  attachment,
}: {
  to: string;
  subject: string;
  html: string;
  attachment?: { name: string; content: string }; // content = base64
}) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY manquant");

  const body: Record<string, unknown> = {
    sender: { name: "La médaille de mon toutou", email: "hello@lecarnetdemontoutou.fr" },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (attachment) {
    body.attachment = [{ name: attachment.name, content: attachment.content }];
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error: ${err}`);
  }
}
