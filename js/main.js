/* ============================================================
   د/ جهاد محمد — منطق الصفحة (خفيف، بدون أي مكتبات)
   ============================================================ */
(() => {
    'use strict';

    /* ===== إعدادات قابلة للتعديل ===== */
    const WA_NUMBER = '201277126429'; // رقم واتساب بالصيغة الدولية بدون +
    const WA_DEFAULT_MSG = 'أهلًا د/ جهاد، حابب أعرف تفاصيل حجز جلسة.';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ===== روابط واتساب: يبني الرابط بالرسالة الجاهزة ===== */
    document.querySelectorAll('a[data-wa]').forEach((a) => {
        const msg = a.getAttribute('data-wa') || WA_DEFAULT_MSG;
        a.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
        a.target = '_blank';
        a.rel = 'noopener';
    });

    /* ===== الهيدر + شريط التقدم + زر الموبايل الثابت ===== */
    const head = document.getElementById('siteHead');
    const bar = document.getElementById('progressBar');
    const stickyCta = document.getElementById('stickyCta');

    const onScroll = () => {
        const y = window.scrollY;
        head.classList.toggle('scrolled', y > 24);

        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${total > 0 ? y / total : 0})`;

        if (stickyCta) stickyCta.classList.toggle('show', y > window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ===== قائمة الموبايل ===== */
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');

    const setMenu = (open) => {
        menu.classList.toggle('open', open);
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    if (toggle && menu) {
        toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
        menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    }

    /* ===== الظهور عند التمرير ===== */
    const revealEls = document.querySelectorAll('[data-reveal], .lines, .flow-wrap');

    if (reducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    en.target.classList.add('in-view');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ===== تمييز رابط القسم النشط ===== */
    const navLinks = document.querySelectorAll('.nav-list a');
    if (navLinks.length && 'IntersectionObserver' in window) {
        const secIO = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const id = '#' + en.target.id;
                navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('section[id]').forEach((s) => secIO.observe(s));
    }

    /* ===== تمرين التنفس ===== */
    const breath = document.getElementById('breath');
    if (breath) {
        const orb = breath.querySelector('.breath-orb');
        const label = breath.querySelector('.breath-label');
        const btn = breath.querySelector('.breath-btn');
        let timer = null;
        let inhale = true;

        const tick = () => {
            inhale = !inhale;
            if (!reducedMotion) orb.classList.toggle('is-in', inhale);
            label.textContent = inhale ? 'شهيق…' : 'زفير…';
        };

        btn.addEventListener('click', () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
                orb.classList.remove('is-in');
                label.textContent = 'ابدأ';
                btn.textContent = 'ابدأ تمرين التنفس';
                return;
            }
            inhale = true;
            if (!reducedMotion) orb.classList.add('is-in');
            label.textContent = 'شهيق…';
            btn.textContent = 'إيقاف';
            timer = setInterval(tick, 4000);
        });
    }

    /* ===== سنة الفوتر ===== */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();