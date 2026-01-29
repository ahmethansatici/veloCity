# Bruno Simon Tarzı İnteraktif Web Tabanlı Araç Simülasyonu - Görev Listesi

> İnteraktif web deneyimleri, geleneksel statik arayüzlerin ötesine geçerek kullanıcıyı yaşayan bir ekosistemin parçası haline getiren bir evrim geçirmektedir. Bu projede bir otomobilin bir 3D dünyada sürülmesi esasına dayanan bir sistem oluşturulacaktır.

---

## 📋 Genel Bakış

| Teknoloji Bileşeni | İşlevi | Önerilen Kütüphane/Araç |
|-------------------|--------|------------------------|
| Render Motoru | 3D grafiklerin çizilmesi ve sahne yönetimi | Three.js |
| Fizik Motoru | Çarpışma algılama ve araç dinamikleri | Rapier.js veya Cannon-es |
| Geliştirme Ortamı | Hızlı modül paketleme ve yerel sunucu | Vite |
| 3D Modelleme | Varlıkların oluşturulması ve doku pişirme | Blender |
| Dil | Tip güvenliği ve yapılandırılmış kod | TypeScript |

---

## Aşama 1: Ortam Kurulumu ve Çekirdek Yapı

### 1.1 Geliştirme Ortamının Yapılandırılması
- [x] Vite ile proje yapısının oluşturulması
- [x] TypeScript entegrasyonunun sağlanması
- [x] `package.json` dosyasında temel bağımlılıkların tanımlanması:
  - [x] `three`: Grafik işleme için ana kütüphane
  - [x] `@dimforge/rapier3d`: Modern ve yüksek performanslı fizik hesaplamaları için
  - [x] `vite`: Modern derleme ve sunum aracı

### 1.2 Teknik Altyapı ve WebGL Ekosistemi
- [x] Three.js tabanlı render motorunun kurulması
- [x] Experience sınıfının oluşturulması (sahne, kamera ve render motorunu yöneten ana orkestratör)
- [x] Render döngüsünün (requestAnimationFrame) optimize edilmesi
- [x] Ekran yenileme hızlarıyla senkronize çalışmasının sağlanması

### 1.3 Fizik Dünyası Entegrasyonu
- [x] Rapier.js fizik dünyasının entegre edilmesi
- [x] Render döngüsü içerisinde fizik dünyasının adımlanması (world.step)
- [x] Ekranda zemin ve küp fiziksel etkileşim testinin yapılması

---

## Aşama 2: Blender ve Görsel Optimizasyon

### 2.1 3D Varlıkların Hazırlanması
- [x] Arabanın şasisinin modellenmesi (Hazır model kullanıldı)
- [x] Tekerleklerin ayrı nesneler olarak modellenmesi (Tek parça model - görsel süspansiyon devre dışı)
- [x] Düşük Poligonlu Modelleme (Optimize edilmiş model)
- [x] Gereksiz yüzeylerin silinmesi ve geometri temizliği

### 2.2 Doku Pişirme (Baking) Stratejileri

| Pişirme Türü | İşlevi | Avantajı |
|--------------|--------|----------|
| Diffuse/Base Color | Temel renk ve ışık bilgisi | Işık kaynağı hesaplamasını ortadan kaldırır |
| Ambient Occlusion | Köşelerdeki ve boşluklardaki gölgeler | Nesnelere hacim ve derinlik katar |
| Shadow Map | Keskin ve yumuşak gölgeler | Gerçek zamanlı gölge yükünü sıfırlar |
| Emission | Parlayan yüzeylerin ışık etkisi | Neon ve ekran efektlerini simüle eder |

- [ ] UV Unwrapping yapılması (her nesnenin 2D haritasının çıkarılması)
- [ ] Işık haritaları için ikinci UV kanalının (UV2) hazırlanması
- [x] Blender Cycles render motoruyla ışıklandırma kurulumu (Environment.ts Setup)
- [x] "Area Lights" ve "Environment Maps" kullanımı (Hemisphere/Directional Setup)
- [ ] Diffuse/Base Color pişirmesi
- [ ] Ambient Occlusion pişirmesi
- [ ] Shadow Map pişirmesi
- [ ] Emission pişirmesi (gerekirse)
- [ ] Doku sıkıştırma (Squoosh veya benzeri araçlarla)
- [ ] WebP formatında dışa aktarım
- [x] Doku dosyalarının public klasörüne yerleştirilmesi (In Progress)

### 2.3 Çoklu UV Kanalı ve Işık Haritası Yönetimi
- [ ] İlk UV kanalının (UV0) tekrarlayan dokular için kullanılması
- [ ] İkinci UV kanalının (UV1/UV2) ışık haritaları için yapılandırılması
- [ ] Modellerin ışık haritasına göre yerleştirilmesi

---

## Aşama 3: Fizik Motoru ve Araç Mekaniği Mühendisliği

### 3.1 Raycast Vehicle Mekaniği
- [x] Raycast Vehicle kontrolcüsünün kurulması
- [x] PhysicalVehicle ve VisualVehicle katmanlarının ayrılması
- [x] Tekerleklerin ışın simülasyonu olarak yapılandırılması

### 3.2 Süspansiyon Matematiği
Süspansiyon kuvveti formülü: Rapier Entegre Çözüm

| Parametre | Sürüşe Etkisi | Mevcut Değer |
|-----------|---------------|------------------------|
| Stiffness | Arabanın zıplama miktarını belirler | 70.0 |
| Damping | Yayın enerjisini sönümleme hızı | 4.4 |
| Friction | Lastik ve zemin arasındaki tutuş | 1.5 (Drift) |
| Engine Force | Aracın maksimum ivmelenmesi | 8000.0 |

- [x] Süspansiyon parametrelerinin tanımlanması
- [x] Tekerlek sürtünme parametrelerinin ayarlanması
- [x] Motor kuvveti parametresinin yapılandırılması

### 3.3 Sürüş Dinamikleri (Drift & Arcade Hissiyatı)
- [x] Ağırlık merkezi ayarı (Anti-Roll)
- [x] Sürtünme ve kayma ayarları (Drift modu)
- [ ] Stabilizasyon çubukları (gerekirse)

### 3.3 Çarpışma Filtreleri ve Zemin Etkileşimi
- [ ] Collision Groups yapısının kurulması
- [ ] Collision Masks yapılandırması
- [ ] Araba grubunun belirlenmesi
- [ ] Engel gruplarının tanımlanması
- [ ] Gereksiz çarpışma hesaplamalarının optimize edilmesi

---

## Aşama 4: Giriş Sistemleri ve Kontrol Algoritmaları

### 4.1 Klavye Kontrollerinin Kodlanması
- [ ] Input sınıfının yazılması
- [ ] WASD / Ok Tuşları: Temel hareket (ileri, geri, sağ, sol)
- [ ] Shift: Hız artırma (Boost) - tork değerini geçici artırma
- [ ] Space / Ctrl: Fren veya Zıplama (Jump) - dikey kuvvet uygulama
- [ ] Num Pad: Hidrolik kontrolleri (süspansiyon dinamik değişimi)

### 4.2 Gamepad Entegrasyonu
- [ ] Tarayıcı Gamepad API entegrasyonu
- [ ] L2/R2 analog gaz-fren desteği
- [ ] Joystick analog giriş desteği (0-1 arası değerler)

### 4.3 Özel Aksiyon Mantığı
- [ ] Respawn mekanizmasının implementasyonu
- [ ] "I'm stuck!" (Sıkıştım!) butonu
- [ ] Otomatik respawn algılama sistemi
- [ ] setTranslation ve setRotation ile ışınlanma
- [ ] Hız ve açısal hız sıfırlama

---

## Aşama 5: Kamera Sistemleri ve Sinematik Takip

### 5.1 Lineer İnterpolasyon (Lerp) ve Yumuşatma
- [ ] Lerp tabanlı kamera takip algoritmasının implementasyonu
- [ ] `camera.position.lerp(targetPosition, alpha)` yapısının kurulması
- [ ] Alpha değerinin ayarlanması (kamera esnekliği)

### 5.2 Kamera Davranış Kuralları
- [ ] Look-At Hedefi: Kameranın arabanın önüne bakması (look-ahead)
- [ ] Damping Factor: Fare/joystick hareket ataleti (inertia)
- [ ] Engel Algılama: Kamera clipping prevention
- [ ] Spring Arm / Smooth Follow sisteminin kurulması

---

## Aşama 6: Sahne Detayları ve Etkileşim

### 6.1 Etkileşimli Nesneler
- [ ] Devrilebilir kutular eklenmesi
- [ ] Zıplama rampaları eklenmesi
- [ ] Fizik motorunun test edilmesi

### 6.2 Görsel ve İşitsel Detaylar
- [ ] Çarpışma seslerinin eklenmesi
- [ ] Tekerlek izlerinin (tire marks) implementasyonu

---

## Aşama 7: Gelişmiş Performans ve Optimizasyon

### 7.1 Bellek Yönetimi ve Çizim Çağrısı Optimizasyonu
- [ ] Instanced Mesh kullanımı (çimenler, ağaçlar, taşlar için)
- [ ] Geometri Paylaşımı (aynı modele sahip nesneler için)
- [ ] Tek BufferGeometry ve Material kullanımı

### 7.2 Dinamik Çözünürlük (DPR)
- [ ] `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` implementasyonu
- [ ] Yüksek çözünürlüklü ekranlarda GPU optimizasyonu

### 7.3 Post-Processing ve Görsel Cila
- [ ] Bloom efekti eklenmesi
- [ ] Quality Toggles (Kalite Ayarları) sistemi
- [ ] Düşük kalite moduna geçiş imkanı

### 7.4 Genel Optimizasyon
- [ ] Gereksiz poligonların temizlenmesi
- [ ] Doku boyutlarının optimize edilmesi
- [ ] Çizim çağrısı sayısının minimuma indirilmesi
- [ ] Farklı tarayıcı ve cihazlarda performans testleri

---

## Aşama 8: Yayınlama

- [ ] Projenin farklı tarayıcılarda test edilmesi
- [ ] Mobil cihaz testlerinin yapılması
- [ ] Vercel veya benzeri bir platforma deploy edilmesi
- [ ] Tüm dünyaya erişime açılması

---

## 📝 Notlar

### Fizik Motoru Seçimi
> Bruno Simon'un orijinal çalışmasında Cannon.js kullanılmış olsa da, endüstrinin Rapier.js'e yönelmesinin temel nedeni, Rapier'in Rust dilinde yazılmış olması ve WebAssembly (WASM) üzerinden çalışarak tarayıcıda çok daha düşük CPU maliyetiyle yüksek hassasiyetli hesaplamalar yapabilmesidir.

### Doku Pişirme Önemi
> Doku pişirme, bir 3D yazılımda hesaplanan karmaşık ışık, gölge ve yansıma verilerinin doğrudan bir görsel dosyasına kaydedilmesi işlemidir. WebGL ortamında gerçek zamanlı gölge hesaplamak GPU üzerinde büyük bir yük oluştururken, pişirilmiş dokular sadece basit bir resim dosyası olarak yüklendiği için performans kaybı yaşatmadan yüksek görsel kalite sunar.

### WebGPU Desteği
> Modern yaklaşımlarda, performansın daha da artırılması amacıyla WebGPU desteği de ekosisteme dahil edilmiştir; bu durum özellikle 2025 versiyonu gibi daha güncel projelerde TSL (Three.js Shading Language) kullanımıyla mümkün hale gelmektedir.

---

## ✅ İlerleme Takibi

| Aşama | Durum | Tamamlanma |
|-------|-------|------------|
| Aşama 1: Ortam Kurulumu | ✅ Tamamlandı | 100% |
| Aşama 2: Blender ve Görsel | ⬜ Bekliyor | 0% |
| Aşama 3: Fizik Motoru | ⬜ Bekliyor | 0% |
| Aşama 4: Giriş Sistemleri | ⬜ Bekliyor | 0% |
| Aşama 5: Kamera Sistemleri | ⬜ Bekliyor | 0% |
| Aşama 6: Sahne Detayları | ⬜ Bekliyor | 0% |
| Aşama 7: Optimizasyon | ⬜ Bekliyor | 0% |
| Aşama 8: Yayınlama | ⬜ Bekliyor | 0% |
