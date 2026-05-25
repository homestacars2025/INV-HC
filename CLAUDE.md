# CLAUDE.md — HC-INVESTORS Project

## 1. هوية المشروع
- **الاسم:** HC-INVESTORS (بوابة مستثمري Homesta Cars)
- **الجمهور:** مستثمرون عرب فقط (لغة واحدة: العربية)
- **النبرة:** احترافية، مالية، موثوقة. الفخامة في التفاصيل لا في الزخرفة.
- **المراجع البصرية:** Linear.app + Stripe Dashboard + Apple.com

## 2. القواعد الذهبية (مخالفتها = توقف فوري)

### 2.1 لا تخمّن أبداً
- لا تخترع اسم عمود أو جدول أو API.
- إذا لم تكن متأكداً من بنية البيانات → اقرأ من Supabase أو اسأل المستخدم.
- إذا لم تكن متأكداً من سلوك مكتبة → اقرأ docs الرسمية، لا تعتمد على ذاكرتك.

### 2.2 جذر المشكلة قبل أي إصلاح
- ممنوع كتابة "fix" قبل ما تفهم لماذا المشكلة موجودة.
- لا تضيف try/catch لإخفاء خطأ. اكتشف سببه أولاً.
- لا تضع `any` لإسكات TypeScript. اكتب الـ type الصحيح.
- لا تستخدم `?.` لإخفاء بيانات مفقودة — افهم لماذا مفقودة.

### 2.3 الأداء ليس اختيارياً
- كل صفحة Server Component افتراضياً.
- `'use client'` يُكتب فقط عند الحاجة الفعلية (state, event handlers).
- ممنوع `SELECT *` في Supabase queries.
- كل query يجب أن يكون مفهرساً (indexed).

### 2.4 الأمان فوق كل شيء (RLS أولاً)
- المستثمر لا يرى بيانات مستثمر آخر — أبداً.
- كل جدول يحتوي بيانات مستثمر يجب أن يكون عليه RLS policy صارم.
- لا تستخدم service_role key في كود يخدم المستخدم النهائي.

### 2.5 العربية والـ RTL مواطن من الدرجة الأولى
- المشروع عربي بالكامل. لا fallback إلى الإنجليزية.
- `<html dir="rtl" lang="ar">` ثابت.
- استخدم logical properties في CSS: `ms-`, `me-`, `ps-`, `pe-` (لا `ml-`/`mr-`).
- الأرقام: غربية (0123) لأن المالية تتطلب وضوحاً دولياً.

## 3. Stack التقني الإلزامي

```
Framework:      Next.js 15 (App Router) + React 19
Language:       TypeScript (strict mode)
Styling:        Tailwind CSS v4
Components:     shadcn/ui (محلية، ليس npm)
Animation:      Motion (framer-motion v11+)
Charts:         Recharts
Database:       Supabase (PostgreSQL + Auth + Storage + RLS)
Forms:          react-hook-form + zod
Deployment:     Vercel
Package Mgr:    pnpm (إلزامي)
```

**ممنوع:** Material UI, Chakra, Redux, MobX, moment.js, axios, lodash كامل.

## 4. الهوية البصرية (Design Tokens)

### الألوان
```
--brand:        #4ba6ea   (الأزرق المميز)
--brand-hover:  #3a95d9
--brand-soft:   #e8f3fc

--ink:          #0a0a0a   (النص الأساسي)
--ink-2:        #404040   (النص الثانوي)
--ink-3:        #737373   (النص الباهت)

--paper:        #ffffff   (الخلفية)
--paper-2:      #fafafa   (البطاقات)
--paper-3:      #f5f5f5   (hover)

--line:         #e5e5e5   (الحدود)

--success:      #16a34a
--warning:      #ea580c
--danger:       #dc2626
```

### الخطوط
- **Cairo** (Google Fonts) — لكل النصوص العربية
- **Inter Tight** (Google Fonts) — للأرقام فقط (currency, percentages, dates)
- كل رقم في الواجهة يلف بـ `<Num>` component يستخدم `font-numeric tabular-nums`

### المسافات والشكل
- Border radius للبطاقات: `rounded-2xl` (16px) — هذا توقيع المشروع
- Border radius للأزرار: `rounded-lg` (8px)
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 فقط (ممنوع 5, 7, 14...)

## 5. هيكل المجلدات الإلزامي

```
HC-INVESTORS/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── reports/page.tsx
│   │   ├── cars/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx              # Root: RTL, fonts
│   └── globals.css
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── charts/                 # Recharts wrappers
│   ├── layout/                 # Sidebar, Header
│   └── investor/               # مكونات خاصة
├── lib/
│   ├── supabase/{server,client,middleware}.ts
│   ├── queries/                # كل query في ملف منفصل
│   ├── format/                 # formatCurrency, formatDate, formatNumber
│   └── utils.ts
├── types/database.ts           # supabase gen types
└── CLAUDE.md
```

**قاعدة:** لا ملف `page.tsx` يتجاوز 150 سطر. قسّم لمكونات.

## 6. قواعد الكود

- **TypeScript strict mode** — `any` ممنوع إلا بمبرر مكتوب
- **Naming:** PascalCase للمكونات، camelCase للدوال، SCREAMING_SNAKE للثوابت
- **Server vs Client:** الافتراضي Server. `'use client'` فقط في الأوراق (leaves)
- **Data fetching:** داخل Server Components مباشرة. لا useEffect لجلب بيانات
- **Errors:** لا try/catch صامت. كل catch يسجل أو يعرض رسالة

## 7. ممنوعات صارمة
- ❌ console.log في production (استخدم logger)
- ❌ TODO بدون issue مرتبط
- ❌ @ts-ignore بدون تعليق سبب
- ❌ تثبيت مكتبة بدون مبرر
- ❌ تعديل node_modules أو .next

## 8. Definition of Done

ميزة لا تُعتبر جاهزة إلا إذا:
- [ ] Server Component (إن أمكن)
- [ ] Loading state + error state + empty state
- [ ] متجاوبة على mobile/tablet/desktop
- [ ] RTL مثالي
- [ ] TypeScript يمر بدون أخطاء
- [ ] ESLint يمر بدون أخطاء
- [ ] RLS مختبر (مستثمر A لا يرى بيانات B)
- [ ] لا queries زائدة (Network tab نظيف)
- [ ] الأرقام منسقة بـ Intl.NumberFormat
- [ ] التواريخ منسقة بالعربية

## 9. سير العمل

عند كل مهمة جديدة:
1. اقرأ هذا الملف
2. اقرأ skills المناسبة في `.claude/skills/`
3. خطّط قبل الكود
4. افحص: هل البيانات موجودة في Supabase؟ هل الـ types مولّدة؟
5. نفّذ الحد الأدنى من الكود
6. شغّل `pnpm typecheck` و `pnpm lint`

## 10. قاعدة العزل المطلق — بيانات العملاء محرّمة

هذا المشروع مختص بالمستثمرين والمشرفين (admin) فقط.

- ❌ ممنوع منعاً باتاً الوصول إلى جدول `customers` أو أي بيانات تخص العملاء.
- ❌ المستثمر لا يرى أي معلومة عن من استأجر سيارته — لا اسم، لا هاتف، لا أي شيء.
- ❌ ممنوع أي `JOIN` أو query يجلب بيانات من جدول `customers`.
- ✅ الحجوزات تُعرض بالأرقام والتواريخ والحالة فقط، بلا هوية عميل.
- ✅ عند الحاجة لإحصائيات الحجوزات: الأعداد والتواريخ فقط.

هذه القاعدة لا تُخرق حتى لو طلبها أي أحد.

## 11. ملاحظات أخيرة

- اقتصد في الكود. أقل سطر يحقق الهدف هو الأفضل.
- اقتصد في الـ dependencies. كل مكتبة = مسؤولية أمنية وأداء.
- إذا شككت → اسأل. الصمت والتنفيذ الخاطئ أسوأ من سؤال واضح.
- النبرة في الـ commits: واضحة، مختصرة، بالإنجليزية.

## 12. Mobile-First إلزامي (أعلى أولوية)

المستثمرون يستخدمون التطبيق أساساً على هواتفهم. الموبايل هو السياق الأول، الديسكتوب ثانوي.

### 12.1 ترتيب التصميم
- ابدأ من 375px ثم اصعد: `sm:` `md:` `lg:` `xl:` — لا عكس.
- لا تصمم للديسكتوب ثم تحاول التكيف مع الموبايل.

### 12.2 Touch Targets
- كل عنصر تفاعلي (زر، رابط، trigger، picker): **حد أدنى 44×44px**.
- استخدم `min-h-[44px]` أو `h-11` للعناصر الصغيرة.

### 12.3 التنقل على الموبايل
- **أقل من `lg:`:** شريط تبويب سفلي ثابت (Bottom Tab Bar) بالأيقونات والتسميات، بدلاً من السايدبار.
- **`lg:` وما فوق:** السايدبار الجانبي المعتاد.
- السايدبار يُخفى تماماً على الموبايل: `hidden lg:flex`.
- شريط التبويب السفلي: `lg:hidden fixed bottom-0 inset-x-0 z-50`.
- احترام `env(safe-area-inset-bottom)` للشريط السفلي (notch / home bar في iOS).

### 12.4 التخطيط والمحتوى
- Padding المحتوى: `p-4` موبايل → `lg:p-8` ديسكتوب.
- المحتوى الرئيسي يحتاج `pb-20 lg:pb-0` لتفادي الشريط السفلي.
- الكاونترات: `grid-cols-2` موبايل كحد أقصى — لا ضغط 6 عناصر.
- البطاقات: `grid-cols-1` موبايل → تدريجي مع breakpoints.
- أرقام KPI كبيرة: `text-3xl` موبايل → `text-4xl` sm+.

### 12.5 الطباعة
- أحجام نص مقروءة على الموبايل. لا overflow أفقي للأرقام الكبيرة.
- استخدم أحجاماً متجاوبة: `text-xl md:text-2xl` للعناوين الكبيرة.

### 12.6 الجداول المالية
- **ممنوع عرض جداول على الموبايل.** على `< md:` اعرض بيانات الجدول كبطاقات مكدسة (label:value).
- على `md:` وما فوق: جدول حقيقي.

### 12.7 لا تمرير أفقي
- لا شيء يسبب `overflow-x` على 360px أو 390px.
- اختبر كل صفحة على: 375px، 390px، 768px، 1280px+.

### 12.8 Safe Areas
- الأشرطة الثابتة (bottom nav) تستخدم `env(safe-area-inset-bottom)` padding.
- الأشرطة العلوية الثابتة تستخدم `env(safe-area-inset-top)` إذا كانت fullscreen.
