const express = require('express');

const app = express();
const port = 3001;

// Frontend'i sunmak için statik klasör
app.use(express.static('public'));

// Sadece JSON (metin içeriği) alacağız, multer yok. Boyutu artırıyoruz çünkü txt dosyaları büyük olabilir.
app.use(express.json({ limit: '100mb' }));

// Dosya Yükleme ve Analiz API Rotası (Sadece JSON alıyor)
app.post('/upload', (req, res) => {
    try {
        const fileContent = req.body.txtContent;

        if (!fileContent) {
            return res.status(400).json({ error: 'Sohbet içeriği bulunamadı. Lütfen bir .txt dosyası seçtiğinizden emin olun.' });
        }

        const lines = fileContent.split('\n');

        const messages = [];
        let seq = 1;

        // Farklı WhatsApp formatlarını (iOS, Android, TR, EN) yakalamak için Regex
        const regex = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[^\s\]]+)?)\]?\s*[-]?\s*([^:]+):\s*(.*)$/;
        const systemMessageRegex = /^\[?\d{1,2}[./-]\d{1,2}[./-]\d{2,4}[,\s]+\d{1,2}:\d{2}(?::\d{2})?(?:\s+[^\s\]]+)?\]?\s*[-]?\s*/;

        let currentMsg = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            const match = line.match(regex);

            if (match) {
                if (currentMsg) {
                    messages.push(currentMsg);
                }
                const date = match[1];
                const time = match[2];
                const sender = match[3].trim();
                let content = match[4].trim();

                let type = 'Text';
                let fileName = null;

                // WhatsApp'ın eklediği gizli Unicode formatlama karakterlerini temizle
                content = content.replace(/[\u200E\u200F]/g, '');

                // Medya kontrolü (farklı WhatsApp dil dışa aktarımları için varyasyonlar)
                if (content.includes('(file attached)') || content.includes('(dosya eklendi)') || content.includes('<iliştirilmiş>')) {
                    type = 'Media';
                    fileName = content
                        .replace('(file attached)', '')
                        .replace('(dosya eklendi)', '')
                        .replace('<iliştirilmiş>', '')
                        .trim();
                }

                currentMsg = {
                    id: seq++,
                    date: date,
                    time: time,
                    sender: sender,
                    type: type,
                    // Artık dosyanın sunucuda olup olmadığını backend kontrol etmiyor
                    content: type === 'Media' ? fileName : content
                };
            } else {
                // Eğer yeni satır Regex ile eşleşmiyorsa, bir önceki mesajın devamıdır
                const isSystemMessage = systemMessageRegex.test(line);
                if (!isSystemMessage && currentMsg && currentMsg.type === 'Text') {
                    currentMsg.content += '\n' + line;
                }
            }
        }

        if (currentMsg) {
            messages.push(currentMsg);
        }

        res.json(messages);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Sunucu hatası oluştu. Dosya okunamadı.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Sunucu başarıyla başlatıldı! Lütfen tarayıcınızdan şu adrese gidin: http://localhost:${port}`);
});
