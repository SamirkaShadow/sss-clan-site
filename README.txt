SSS CLAN — сайт с отправкой заявок в Discord

В архиве:
- index.html — сайт и форма
- sss-voxel.jpg — изображение для сайта
- netlify.toml — настройка Netlify
- netlify/functions/submit-application.mjs — серверная функция, отправляющая анкету через Discord webhook

ВАЖНО: ручной Netlify Drop не запускает эту функцию. Для приёма заявок сайт нужно развернуть на Netlify через GitHub (или Netlify CLI).

НАСТРОЙКА:
1. В Discord выберите канал для заявок. В настройках канала откройте Integrations → Webhooks → New Webhook, выберите канал и скопируйте Webhook URL. Если такого пункта нет — попросите администратора сервера.
2. Создайте GitHub-репозиторий и загрузите в него ВСЕ файлы из этой папки, включая netlify.toml и папку netlify/functions.
3. В Netlify выберите Add new site → Import an existing project → GitHub и подключите созданный репозиторий.
4. В настройках сайта Netlify откройте Environment variables и добавьте:
   Key: DISCORD_WEBHOOK_URL
   Value: вставьте скопированный Discord Webhook URL
5. Запустите повторный deploy сайта. После этого тестовая отправка формы должна появиться в выбранном Discord-канале.

БЕЗОПАСНОСТЬ:
Не вставляйте Discord Webhook URL в index.html, GitHub или публичный чат. Храните его только в переменных окружения Netlify. Если URL случайно стал публичным — удалите/пересоздайте webhook в Discord.
