export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    console.error('Missing DISCORD_WEBHOOK_URL environment variable');
    return Response.json({ error: 'Application delivery is not configured.' }, { status: 500 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const fields = ['nickname', 'age', 'timezone', 'experience', 'test'];
  if (fields.some((key) => !String(data[key] ?? '').trim())) {
    return Response.json({ error: 'Please complete all required fields.' }, { status: 400 });
  }
  if (!Array.isArray(data.specialties) || data.specialties.length === 0) {
    return Response.json({ error: 'Select at least one specialty.' }, { status: 400 });
  }

  const clean = (value, max = 700) => String(value ?? '').trim().slice(0, max).replace(/@/g, '@\u200b') || '—';
  const message = {
    username: 'SSS · Новая заявка',
    allowed_mentions: { parse: [] },
    embeds: [{
      title: 'Новая заявка в SSS · Minecraft',
      color: 13036757,
      fields: [
        { name: 'Ник в Minecraft и Discord', value: clean(data.nickname, 100), inline: true },
        { name: 'Возраст', value: clean(data.age, 10), inline: true },
        { name: 'Часовой пояс', value: clean(data.timezone, 60), inline: true },
        { name: 'Специализации', value: clean(data.specialties.join(', '), 200) },
        { name: 'Опыт', value: clean(data.experience, 700) },
        { name: 'Моды', value: clean(data.mods || 'Не указаны', 300) },
        { name: 'Готов пройти проверку навыков?', value: clean(data.test, 20), inline: true }
      ],
      footer: { text: 'SSS Clan · Заявки Minecraft' },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    if (!response.ok) {
      console.error('Discord webhook request failed with status', response.status);
      return Response.json({ error: 'Could not deliver the application to Discord.' }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Discord delivery failed:', error.message);
    return Response.json({ error: 'Could not deliver the application to Discord.' }, { status: 502 });
  }
};
