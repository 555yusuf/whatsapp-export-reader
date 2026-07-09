const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Frontend ve yüklenen medyaları sunmak için statik klasörler
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Multer (Dosya Yükleme) Konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Klasör yoksa oluştur
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Dosya ile metin içindeki adın eşleşmesi için orijinal adı koruyoruz
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Dosya Yükleme ve Analiz API Rotası
app.post('/upload', upload.any(), (req, res) => {
    try {
        // Yüklenen dosyalar arasından sadece .txt olanı bul
        let txtFile = req.files.find(f => f.originalname.endsWith('.txt'));

        if (!txtFile) {
            return res.status(400).json({ error: 'Lütfen bir .txt sohbet dosyası yükleyin.' });
        }

        const fileContent = fs.readFileSync(txtFile.path, 'utf8');
        const lines = fileContent.split('\n');

        const messages = [];
        let seq = 1;

        // Farklı WhatsApp formatlarını (iOS, Android, TR, EN) yakalamak için Regex
        const regex = /^\[?(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})[,\s]+(\d{1,2}:\d{2}(?::\d{2})?(?:\s+[^\s\]]+)?)\]?\s*[-]?\s*([^:]+):\s*(.*)$/;
        const systemMessageRegex = /^\[?\d{1,2}[./-]\d{1,2}[./-]\d{2,4}[,\s]+\d{1,2}:\d{2}(?::\d{2})?(?:\s+[^\s\]]+)?\]?\s*[-]?\s*/;

        let currentMsg = null;

        const uploadDir = path.join(__dirname, 'uploads');
        let filesInUploads = [];
        if (fs.existsSync(uploadDir)) {
            filesInUploads = fs.readdirSync(uploadDir);
        }

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

                let fileExists = false;
                let actualFileName = fileName;
                if (type === 'Media' && fileName) {
                    const matchedFile = filesInUploads.find(f => f.trim() === fileName.trim());
                    if (matchedFile) {
                        fileExists = true;
                        actualFileName = matchedFile;
                    }
                }

                currentMsg = {
                    id: seq++,
                    date: date,
                    time: time,
                    sender: sender,
                    type: type,
                    content: type === 'Media' ? actualFileName : content,
                    fileExists: fileExists
                };
            } else {
                // Eğer yeni satır Regex ile eşleşmiyorsa, bir önceki mesajın devamıdır
                // Ancak bu satır WhatsApp'ın sistem mesajıysa (Tarih ile başlıyor ama ':' içermiyorsa), yok say.
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
