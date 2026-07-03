(function customerBookingI18nScope() {
  const LANG_KEY = 'pp_customer_lang';
  const ADMIN_LANG_KEY = 'padelPro_language';

  const UI = {
    ar: {
      langToggle: 'English',
      langToggleTitle: 'Switch to English'
    },
    en: {
      langToggle: 'العربية',
      langToggleTitle: 'التبديل إلى العربية'
    }
  };

  const EXACT_AR_TO_EN = {
    'بادل برو': 'Padel Pro',
    'نادي بادل رياضي متكامل': 'A complete padel sports club',
    'نادي رياضي': 'Sports club',
    'جاري التحميل...': 'Loading...',
    'جاري تحميل المواعيد...': 'Loading slots...',
    'رقم الهاتف': 'Phone number',
    'رقم الجوال': 'Mobile number',
    'كلمة المرور': 'Password',
    'دخول': 'Sign in',
    'ليس لديك حساب؟': 'Don\'t have an account?',
    'إنشاء حساب جديد': 'Create a new account',
    'اسم المستخدم': 'Username',
    'الاسم الكامل': 'Full name',
    'مثال: +201011112222 (رقم الجوال مع مفتاح الدولة)': 'Example: +201011112222 (mobile number with country code)',
    'البريد الإلكتروني': 'Email address',
    '8 أحرف على الأقل': 'At least 8 characters',
    'إنشاء حساب': 'Create account',
    'لديك حساب بالفعل؟': 'Already have an account?',
    'تسجيل الدخول': 'Log in',
    'الوضع الليلي': 'Dark mode',
    'تعديل الملف الشخصي': 'Edit profile',
    'الملف الشخصي': 'Profile',
    'تسجيل الخروج': 'Log out',
    'مرحباً! 👋': 'Welcome! 👋',
    'احجز ملعبك المفضل واستمتع باللعب': 'Book your favourite court and enjoy the game',
    'احجز الآن': 'Book now',
    'حجوزاتي': 'My bookings',
    'تابع جميع حجوزاتك من مكان واحد': 'Track all your bookings in one place',
    'الملاعب المتاحة': 'Available courts',
    'المشروبات': 'Drinks',
    'أضف مشروبات أثناء الحجز': 'Add drinks during booking',
    'تواصل معنا': 'Contact us',
    'حسابي': 'My account',
    'الاسم': 'Name',
    'لتعديل بياناتك، يرجى التواصل مع الإدارة': 'To update your details, please contact the club',
    'ساعات العمل': 'Working hours',
    'الموقع': 'Location',
    'للتواصل': 'Contact',
    'السعر لكل ساعة': 'Price per hour',
    'متوفر': 'Available',
    'احجز': 'Book',
    'رقم الهاتف': 'Phone number',
    'انستجرام': 'Instagram',
    'الموقع على الخريطة': 'Map location',
    'افتح في خرائط Google': 'Open in Google Maps',
    'لم تقم بأي حجز بعد': 'You have not made any bookings yet',
    'احجز ملعبك الآن واستمتع باللعب!': 'Book your court now and enjoy the game!',
    'الفاتورة': 'Invoice',
    'إجمالي الحجز': 'Booking total',
    'المدفوع': 'Paid',
    'المتبقي': 'Remaining',
    'طريقة الدفع': 'Payment method',
    'الدفع في النادي': 'Pay at the club',
    'السداد': 'Payment',
    'قيد الانتظار': 'Pending',
    'مؤكد': 'Confirmed',
    'ملغي': 'Cancelled',
    'مكتمل': 'Completed',
    'كاش': 'Cash',
    'انستا باي': 'Instapay',
    'تحويل بنكي': 'Bank transfer',
    'بطاقة': 'Card',
    'غير مدفوع': 'Unpaid',
    'مدفوع جزئياً': 'Partially paid',
    'مدفوع بالكامل': 'Fully paid',
    'المستخدم': 'User',
    'عضو منذ': 'Member since',
    'احجز ملعبك الآن': 'Book your court now',
    'اختر الملعب': 'Choose court',
    'اختر الملعب والموعد المناسب': 'Choose the right court and time',
    '(اختياري)': '(Optional)',
    'الدفع عند الوصول': 'Pay at the club',
    'الدفع عبر InstaPay': 'Pay via InstaPay',
    'امسح الـ QR أو افتح رابط الدفع المباشر': 'Scan the QR code or open the direct payment link',
    'حساب الدفع': 'Payment account',
    'الإجمالي': 'Total',
    'سيصل طلبك إلى الإدارة للمراجعة والتأكيد': 'Your request will be sent to the management for review and confirmation',
    'تم استلام طلب الحجز': 'Booking request received',
    'تم إرسال الطلب بنجاح وسيتم مراجعته من الإدارة': 'Your request was sent successfully and will be reviewed by the management',
    'الملعب': 'Court',
    'التاريخ': 'Date',
    'الوقت': 'Time',
    'المبلغ': 'Amount',
    'الحالة': 'Status',
    'رقم الحجز': 'Booking number',
    'في انتظار التأكيد': 'Awaiting confirmation',
    'موقع النادي': 'Club location',
    'بيانات الحجز': 'Booking details',
    'اسم العميل': 'Customer name',
    'رقم التليفون': 'Phone number',
    'خدمات إضافية': 'Extra services',
    'ملخص الحجز': 'Booking summary',
    'العودة': 'Back',
    'التالي': 'Next',
    'اليوم التالي': 'Next day',
    'ادفع عبر InstaPay': 'Pay with InstaPay',
    'نسخ رابط الدفع': 'Copy payment link',
    'إرسال تفاصيل الدفع': 'Send payment details',
    'حجز جديد': 'New booking',
    'الرجوع للرئيسية': 'Back to home',
    'إرسال طلب الحجز': 'Submit booking request',
    'بعد التحويل اضغط إرسال طلب الحجز، ثم أرسل تفاصيل الدفع عبر واتساب للإدارة.': 'After the transfer, press Submit booking request, then send the payment details to the management on WhatsApp.',
    'تم إرسال طلب الحجز بنجاح ✓': 'Booking request sent successfully ✓',
    'تم نسخ رابط الدفع ✓': 'Payment link copied ✓',
    'فاتورة حجز العميل': 'Customer booking invoice',
    'الهاتف': 'Phone',
    'حالة الحجز': 'Booking status',
    'حالة السداد': 'Payment status',
    'الإضافات': 'Extras',
    'الصنف': 'Item',
    'الكمية': 'Quantity',
    'إجمالي الفاتورة': 'Invoice total',
    'تاريخ إنشاء الحجز': 'Booking created on',
    'مشاركة PDF': 'Share PDF',
    'إغلاق': 'Close',
    'تعذر مشاركة الفاتورة من هذه النافذة': 'Unable to share the invoice from this window',
    'تم فتح مشاركة الفاتورة PDF': 'Invoice PDF share opened',
    'تم تنزيل فاتورة PDF للمشاركة': 'Invoice PDF downloaded for sharing',
    'تعذر مشاركة PDF حالياً': 'Unable to share the PDF right now',
    'تعذر العثور على الحجز': 'Booking not found',
    'تعذر فتح الفاتورة': 'Unable to open the invoice',
    'خدمة إضافية': 'Extra service',
    'لا توجد إضافات': 'No extras',
    'اختر الملعب': 'Choose court',
    'جميع الملاعب': 'All courts',
    'إجمالي المشروبات': 'Drinks total',
    'المشروبات': 'Drinks',
    'سعر الملعب': 'Court price',
    'المدة': 'Duration',
    'مياه': 'Water',
    'مياة': 'Water',
    'مياه معدنية': 'Water',
    'ريد بل': 'Red Bull',
    'ريدبول': 'Red Bull',
    'بيبسي': 'Pepsi',
    'كوكا كولا': 'Coca-Cola',
    'كوكاكولا': 'Coca-Cola',
    'كوكا': 'Coca-Cola',
    'سبرايت': 'Sprite',
    'فانتا': 'Fanta',
    'قهوة': 'Coffee',
    'شاي': 'Tea',
    'نسكافيه': 'Nescafe',
    'عصير': 'Juice',
    'الرقم أو كلمة المرور غير صحيحة': 'The phone number or password is incorrect',
    'رقم غير صحيح': 'Invalid phone number',
    'الاسم ورقم الهاتف والبريد الإلكتروني وكلمة المرور بيانات إلزامية': 'Name, phone number, email, and password are required',
    'أدخل بريدًا إلكترونيًا صحيحًا': 'Enter a valid email address',
    'كلمة المرور يجب أن تكون 8 أحرف على الأقل': 'Password must be at least 8 characters',
    'تم التسجيل بنجاح!': 'Registration completed successfully!',
    'الرقم مسجل مسبقاً': 'This phone number is already registered',
    'خطأ في التسجيل': 'Registration failed',
    'هل أنت متأكد من تسجيل الخروج؟': 'Are you sure you want to log out?',
    'البيانات غير مكتملة': 'Your details are incomplete',
    'حدث خطأ — حاول مرة أخرى': 'Something went wrong — please try again'
  };

  const EXACT_EN_TO_AR = Object.fromEntries(
    Object.entries(EXACT_AR_TO_EN).map(([ar, en]) => [en, ar])
  );

  function getLang() {
    const saved = localStorage.getItem(LANG_KEY) || localStorage.getItem(ADMIN_LANG_KEY);
    return saved === 'en' ? 'en' : 'ar';
  }

  function getDir(lang = getLang()) {
    return lang === 'en' ? 'ltr' : 'rtl';
  }

  function getLocale(lang = getLang()) {
    return lang === 'en' ? 'en-US' : 'ar-EG';
  }

  function replaceExactLiteral(value, map) {
    const raw = String(value || '');
    const trimmed = raw.trim();
    if (!trimmed || !map[trimmed]) return raw;
    return raw.replace(trimmed, map[trimmed]);
  }

  function translateStatic(root = document) {
    const map = getLang() === 'en' ? EXACT_AR_TO_EN : EXACT_EN_TO_AR;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let current = walker.nextNode();
    while (current) {
      const parentTag = current.parentElement?.tagName;
      if (parentTag && !['SCRIPT', 'STYLE'].includes(parentTag)) textNodes.push(current);
      current = walker.nextNode();
    }

    textNodes.forEach(node => {
      const nextValue = replaceExactLiteral(node.nodeValue, map);
      if (nextValue !== node.nodeValue) node.nodeValue = nextValue;
    });

    root.querySelectorAll?.('*').forEach(el => {
      ['placeholder', 'title', 'alt', 'aria-label'].forEach(attr => {
        const currentValue = el.getAttribute?.(attr);
        if (!currentValue) return;
        const nextValue = replaceExactLiteral(currentValue, map);
        if (nextValue !== currentValue) el.setAttribute(attr, nextValue);
      });
    });
  }

  function applyLanguageToDocument() {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = getDir(lang);
    document.body?.setAttribute('data-language', lang);
  }

  function updateToggle(hostSelector) {
    const host = document.querySelector(hostSelector || '#lang-toggle-host');
    if (!host) return;
    let btn = host.querySelector('.cb-lang-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cb-lang-toggle';
      btn.addEventListener('click', () => setLanguage(getLang() === 'en' ? 'ar' : 'en'));
      host.appendChild(btn);
    }
    btn.textContent = UI[getLang()].langToggle;
    btn.title = UI[getLang()].langToggleTitle;
  }

  function applyTitle(pageTitles) {
    if (!pageTitles) return;
    document.title = getLang() === 'en' ? pageTitles.en : pageTitles.ar;
  }

  function tx(arText, enText) {
    return getLang() === 'en' ? enText : arText;
  }

  function translateLiteral(value) {
    const map = getLang() === 'en' ? EXACT_AR_TO_EN : EXACT_EN_TO_AR;
    return replaceExactLiteral(String(value || ''), map);
  }

  function setLanguage(lang, options = {}) {
    const nextLang = lang === 'en' ? 'en' : 'ar';
    localStorage.setItem(LANG_KEY, nextLang);
    localStorage.setItem(ADMIN_LANG_KEY, nextLang);
    applyLanguageToDocument();
    applyTitle(options.pageTitles || window.__cbPageTitles);
    updateToggle(options.toggleHostSelector || window.__cbToggleHostSelector);
    if (typeof window.applyCustomerPageLanguage === 'function') window.applyCustomerPageLanguage();
    translateStatic(document.body || document);
    document.dispatchEvent(new CustomEvent('customerLanguageChanged', { detail: { lang: nextLang } }));
  }

  function init(options = {}) {
    window.__cbPageTitles = options.pageTitles || null;
    window.__cbToggleHostSelector = options.toggleHostSelector || '#lang-toggle-host';
    localStorage.setItem(LANG_KEY, getLang());
    applyLanguageToDocument();
    applyTitle(window.__cbPageTitles);
    updateToggle(window.__cbToggleHostSelector);
    if (typeof window.applyCustomerPageLanguage === 'function') window.applyCustomerPageLanguage();
    translateStatic(document.body || document);
  }

  function formatCurrency(amount) {
    return `${Number(amount || 0).toLocaleString('en-US')} ${getLang() === 'en' ? 'EGP' : 'ج.م'}`;
  }

  function formatDate(value, options = {}) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value || '');
    return new Intl.DateTimeFormat(getLocale(), options).format(date);
  }

  function formatTime(value) {
    if (!value || !String(value).includes(':')) return String(value || '');
    const [hourRaw, minuteRaw] = String(value).split(':');
    const hour24 = Number(hourRaw);
    const minute = String(minuteRaw || '00').padStart(2, '0');
    const hour12 = hour24 % 12 || 12;
    const suffix = getLang() === 'en' ? (hour24 >= 12 ? 'PM' : 'AM') : (hour24 >= 12 ? 'م' : 'ص');
    return `${hour12}:${minute} ${suffix}`;
  }

  function formatCourtName(name) {
    const raw = String(name || '').trim();
    if (!raw || getLang() === 'ar') return raw;
    const match = raw.match(/^(?:ال)?ملعب\s*(.+)?$/);
    if (match) {
      const suffix = String(match[1] || '').trim();
      return suffix ? `Court ${suffix}` : 'Court';
    }
    return translateLiteral(raw);
  }

  window.cbInitLanguage = init;
  window.cbSetLanguage = setLanguage;
  window.cbToggleLanguage = () => setLanguage(getLang() === 'en' ? 'ar' : 'en');
  window.cbTranslateCustomerStatic = translateStatic;
  window.cbLang = getLang;
  window.cbDir = getDir;
  window.cbLocale = getLocale;
  window.cbTx = tx;
  window.cbTranslateLiteral = translateLiteral;
  window.cbCourtName = formatCourtName;
  window.cbFormatCurrency = formatCurrency;
  window.cbFormatDate = formatDate;
  window.cbFormatTime = formatTime;
})();
