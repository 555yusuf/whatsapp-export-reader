# WhatsApp Export Reader 💬

🚀 **Canlı Demo:** [WhatsApp Export Reader'ı Hemen Dene](https://whatsapp-export-reader.onrender.com/)

Bu proje, WhatsApp'tan dışa aktarılan sohbet geçmişlerini (`.txt`) ve medya dosyalarını (resim, video, ses) yerel veya canlı bir web sunucusunda okumanızı ve görselleştirmenizi sağlayan Node.js tabanlı bir araçtır. 

Express.js ve Multer kullanılarak geliştirilmiştir. Dışa aktardığınız sohbet klasörünü tek tıkla yükleyerek, orijinal WhatsApp arayüzüne benzer, okunması kolay bir web arayüzünde sohbetlerinizi inceleyebilirsiniz. Regex tabanlı ayrıştırma (parsing) algoritması sayesinde karmaşık metin bloklarını düzenli sohbet balonlarına dönüştürür.

---

### 🔒 Gizlilik Odaklı (Privacy First)
**Verileriniz güvende!** Bu uygulama verilerinizi hiçbir veritabanında kalıcı olarak saklamaz. Yüklenen tüm sohbet geçmişi ve medya dosyaları sadece anlık görüntüleme içindir ve Render sunucusunun geçici dosya sistemi (ephemeral storage) yapısı gereği sistemden tamamen ve kalıcı olarak silinir.

---

## 📱 WhatsApp'tan Sohbet Nasıl Dışa Aktarılır?

Sohbetlerinizi bu uygulamada görüntülemek için öncelikle WhatsApp uygulamasından verilerinizi indirmeniz gerekmektedir. Lütfen aşağıdaki adımları izleyin:

### Android Kullanıcıları İçin:
1. Dışa aktarmak istediğiniz WhatsApp sohbetini açın.
2. Sağ üst köşedeki **Üç Nokta (⋮)** simgesine dokunun.
3. **Diğer** > **Sohbeti dışa aktar** seçeneğine tıklayın.
4. Çıkan uyarıda uygulamanın düzgün çalışması için mutlaka **"Medyayı dahil et"** seçeneğini seçin.
5. Oluşturulan `.zip` dosyasını bilgisayarınıza aktarın ve bir klasörün içine çıkartın (dizine çıkarın).

### iOS (iPhone) Kullanıcıları İçin:
1. WhatsApp'ta ilgili sohbeti açın.
2. Üst kısımdaki kişi veya grup adına dokunarak kişi bilgileri ekranına girin.
3. Ekranın en altına kaydırın ve **"Sohbeti Dışa Aktar"** seçeneğine dokunun.
4. Dosyaların eksiksiz görünmesi için **"Medyayı Ekle"** seçeneğini seçin.
5. Oluşturulan `.zip` arşivini bilgisayarınıza kaydedin ve klasöre çıkartın.

---

## 🚀 Yerel Kurulum ve Çalıştırma (Local Setup)

Projeyi kendi bilgisayarınızda geliştirmek veya yerel olarak çalıştırmak isterseniz aşağıdaki adımları takip edin:

1. Proje dizininde terminali açın ve gerekli bağımlılıkları yükleyin:
   ```bash
   npm install express multer
