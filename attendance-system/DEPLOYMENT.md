# 🚀 دليل نشر المشروع

## خيارات النشر المتاحة

يمكنك نشر هذا المشروع على عدة منصات مجانية:

---

## 1️⃣ Vercel (الأسهل والأسرع) ⭐

### المميزات:
- ✅ نشر مجاني
- ✅ سريع جداً
- ✅ تحديثات تلقائية
- ✅ دومين مجاني

### خطوات النشر:

1. **إنشاء حساب على Vercel:**
   - اذهب إلى: https://vercel.com
   - سجل دخول باستخدام GitHub

2. **رفع المشروع على GitHub:**
   \`\`\`bash
   cd attendance-system
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   \`\`\`

3. **ربط المشروع بـ Vercel:**
   - اذهب إلى Vercel Dashboard
   - اضغط "New Project"
   - اختر المشروع من GitHub
   - اضغط "Deploy"

4. **انتهى!** 🎉
   - سيتم نشر المشروع تلقائياً
   - ستحصل على رابط مثل: `your-project.vercel.app`

---

## 2️⃣ Netlify

### خطوات النشر:

1. **إنشاء حساب على Netlify:**
   - اذهب إلى: https://netlify.com

2. **رفع المشروع:**
   - اضغط "Add new site"
   - اختر "Import from Git"
   - اختر المشروع من GitHub

3. **إعدادات البناء:**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Deploy!**

---

## 3️⃣ GitHub Pages (للملفات الثابتة فقط)

⚠️ **ملاحظة:** GitHub Pages لا يدعم Next.js بشكل كامل، يُفضل استخدام Vercel أو Netlify.

---

## 4️⃣ النشر على خادم خاص (VPS)

### المتطلبات:
- خادم Linux (Ubuntu/Debian)
- Node.js 18+
- Nginx (اختياري)

### خطوات النشر:

1. **رفع الملفات للخادم:**
   \`\`\`bash
   scp -r attendance-system user@your-server:/var/www/
   \`\`\`

2. **تثبيت المكتبات:**
   \`\`\`bash
   cd /var/www/attendance-system
   npm install
   npm run build
   \`\`\`

3. **تشغيل المشروع:**
   \`\`\`bash
   npm start
   \`\`\`

4. **استخدام PM2 للتشغيل المستمر:**
   \`\`\`bash
   npm install -g pm2
   pm2 start npm --name "attendance-system" -- start
   pm2 save
   pm2 startup
   \`\`\`

5. **إعداد Nginx (اختياري):**
   \`\`\`nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

---

## 🔧 إعدادات مهمة قبل النشر

### 1. تحديث متغيرات البيئة (إن وجدت)

أنشئ ملف `.env.local`:
\`\`\`env
NEXT_PUBLIC_APP_NAME="نظام الحضور والانصراف"
NEXT_PUBLIC_ORG_NAME="جمعية إحسان لرعاية الأيتام"
\`\`\`

### 2. تحديث next.config.ts (إن لزم)

\`\`\`typescript
const nextConfig: NextConfig = {
  output: 'standalone', // للنشر على خادم خاص
  // أو
  output: 'export', // للملفات الثابتة فقط
};
\`\`\`

### 3. إضافة قاعدة بيانات حقيقية

حالياً النظام يستخدم `localStorage` للتخزين المحلي. للنشر الإنتاجي، يُفضل استخدام قاعدة بيانات:

**خيارات مجانية:**
- **Supabase** (PostgreSQL)
- **MongoDB Atlas** (MongoDB)
- **PlanetScale** (MySQL)
- **Firebase** (NoSQL)

---

## 🔐 الأمان

### قبل النشر، تأكد من:

1. ✅ إضافة نظام مصادقة (Authentication)
2. ✅ تشفير البيانات الحساسة
3. ✅ استخدام HTTPS
4. ✅ إضافة حماية CSRF
5. ✅ تحديد صلاحيات المستخدمين

### مكتبات مقترحة للمصادقة:
- **NextAuth.js** - الأفضل لـ Next.js
- **Clerk** - سهل وسريع
- **Auth0** - احترافي

---

## 📊 المراقبة والتحليلات

### أدوات مقترحة:

1. **Vercel Analytics** - مدمج مع Vercel
2. **Google Analytics** - مجاني
3. **Plausible** - يحترم الخصوصية
4. **Umami** - مفتوح المصدر

---

## 🔄 التحديثات التلقائية

### مع Vercel/Netlify:
- كل push لـ GitHub يتم نشره تلقائياً
- لا حاجة لأي إعدادات إضافية

### مع خادم خاص:
استخدم GitHub Actions:

\`\`\`.yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh user@server 'cd /var/www/attendance-system && git pull && npm install && npm run build && pm2 restart attendance-system'
\`\`\`

---

## 📱 تحويل لتطبيق جوال (PWA)

يمكنك تحويل النظام لتطبيق Progressive Web App:

1. **أضف ملف manifest.json:**
   \`\`\`json
   {
     "name": "نظام الحضور والانصراف",
     "short_name": "الحضور",
     "description": "نظام حضور وانصراف جمعية إحسان",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#10b981",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   \`\`\`

2. **أضف Service Worker**

3. **استخدم مكتبة next-pwa:**
   \`\`\`bash
   npm install next-pwa
   \`\`\`

---

## 🎯 التوصيات

### للاستخدام الداخلي (داخل الجمعية):
- ✅ استخدم Vercel (مجاني وسريع)
- ✅ أضف نظام مصادقة بسيط
- ✅ استخدم localStorage (كافي للبداية)

### للاستخدام الإنتاجي (عدة فروع):
- ✅ استخدم خادم خاص أو Vercel Pro
- ✅ أضف قاعدة بيانات حقيقية
- ✅ أضف نظام مصادقة قوي
- ✅ أضف نسخ احتياطي تلقائي

---

## 📞 الدعم

إذا واجهت مشاكل في النشر:
1. راجع وثائق المنصة المستخدمة
2. تحقق من سجلات الأخطاء (logs)
3. تواصل مع فريق الدعم الفني

---

**بالتوفيق في نشر المشروع! 🚀**
