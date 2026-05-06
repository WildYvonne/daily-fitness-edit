// Main JavaScript file for Daily Fitness Edit

/** In-site category listing (pages/category-*.html); same-dir links from /pages/*. */
function categoryNavHref(pageType, slug) {
    const file = `category-${slug}.html`;
    return pageType === 'blog' ? file : `pages/${file}`;
}

// Converge Pixel - Insert tracking script once globally
function insertConvergePixel() {
    if (document.querySelector('script[src*="runconverge.com"]')) return;

    const pixelScript = document.createElement('script');
    pixelScript.src = 'https://static.runconverge.com/pixels/n1sb5O.js';
    pixelScript.async = true;
    document.head.appendChild(pixelScript);

    window.cvg || (cvg = function () {
        cvg.process ? cvg.process.apply(cvg, arguments) : cvg.queue.push(arguments);
    }, cvg.queue = []);
    cvg({ method: 'track', eventName: '$page_load' });
    cvg({ method: 'link_domain', domain: 'pacagen.com' });
}

// Head Component - Insert favicon and stylesheets
function insertHeadElements(pageType = 'root') {
    // Check if head elements already exist to prevent duplicates
    if (document.querySelector('link[rel="icon"]')) {
        return; // Already inserted
    }
    
    // Determine the correct path based on page type
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    // Create the head elements
    const headElements = `
        <!-- Favicon -->
        <link rel="icon" type="image/png" href="${assetPath}/images/DFE-logo.png">
        <link rel="apple-touch-icon" sizes="180x180" href="${assetPath}/images/DFE-logo.png">
        <link rel="manifest" href="${assetPath}/images/site.webmanifest">

        <!-- Additional Meta Tags -->
        <meta name="theme-color" content="#202020">
        <meta name="msapplication-TileColor" content="#202020">
    `;
    
    // Insert the elements into the head
    document.head.insertAdjacentHTML('beforeend', headElements);

    // Load Converge pixel
    insertConvergePixel();

    // Load stylesheets with proper loading detection
    loadStylesheets(assetPath);
}

// Load stylesheets and show content when ready
function loadStylesheets(assetPath) {
    let stylesheetsLoaded = 0;
    const totalStylesheets = 2;
    let contentShown = false;
    
    function showContent() {
        if (!contentShown) {
            contentShown = true;
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        }
    }
    
    function onStylesheetLoad() {
        stylesheetsLoaded++;
        if (stylesheetsLoaded === totalStylesheets) {
            // All stylesheets loaded, show the content
            showContent();
        }
    }
    
    // Fallback: Show content after 2 seconds even if CSS doesn't load
    setTimeout(showContent, 2000);
    
    // Load main stylesheet
    const mainCSS = document.createElement('link');
    mainCSS.rel = 'stylesheet';
    mainCSS.href = `${assetPath}/css/style.css`;
    mainCSS.onload = onStylesheetLoad;
    mainCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(mainCSS);
    
    // Load Bootstrap CSS
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css';

    // Load Google Fonts (Oswald + Roboto)
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
    document.head.appendChild(googleFonts);
    bootstrapCSS.integrity = 'sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr';
    bootstrapCSS.crossOrigin = 'anonymous';
    bootstrapCSS.onload = onStylesheetLoad;
    bootstrapCSS.onerror = onStylesheetLoad; // Show content even if CSS fails
    document.head.appendChild(bootstrapCSS);
}

// Navigation Component - Insert navigation HTML
function insertNavigation(pageType = 'root', currentPage = '') {
    // Determine the correct paths based on page type
    const homePath = pageType === 'blog' ? '../index.html' : 'index.html';
    const logoPath = pageType === 'blog' ? '../assets/images/DFE-logoH.png' : 'assets/images/DFE-logoH.png';
    const base = pageType === 'blog' ? '../' : '';

    const navLinks = [
        { label: 'Fitness', href: categoryNavHref(pageType, 'fitness') },
        { label: 'Health', href: categoryNavHref(pageType, 'health') },
        { label: 'Nutrition', href: categoryNavHref(pageType, 'nutrition') },
        { label: "Editor's Pick", href: categoryNavHref(pageType, 'editors-pick') },
    ];

    const linkItems = (items) =>
        items
            .map(
                (item) =>
                    `<li><a class="mobile-nav-link" href="${item.href}">${item.label}</a></li>`
            )
            .join('');

    const desktopNavLinks = navLinks
        .map(
            (item) =>
                `<a class="site-header-nav-link" href="${item.href}">${item.label}</a>`
        )
        .join('');

    // Create navigation HTML
    const navigationHTML = `
        <header class="site-header">
            <div class="logo">
                <a href="${homePath}">
                    <img src="${logoPath}" alt="Daily Fitness Edit Logo">
                </a>
            </div>
            <nav class="site-header-nav" aria-label="Main">${desktopNavLinks}</nav>
            <button type="button" class="hamburger-menu" id="hamburger-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav-drawer" onclick="toggleMobileMenu()">
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
                <span class="hamburger-bar"></span>
            </button>
        </header>
        <div class="mobile-nav" id="mobile-nav-root" hidden>
            <div class="mobile-nav-backdrop" data-close-mobile-nav tabindex="-1" aria-hidden="true"></div>
            <nav class="mobile-nav-drawer" id="mobile-nav-drawer" aria-label="Site">
                <ul class="mobile-nav-col">${linkItems(navLinks)}</ul>
            </nav>
        </div>
    `;

    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navigationHTML);

    const root = document.getElementById('mobile-nav-root');
    const backdrop = root.querySelector('.mobile-nav-backdrop');

    backdrop.addEventListener('click', () => toggleMobileMenu(false));
    root.querySelectorAll('.mobile-nav-link').forEach((a) => {
        a.addEventListener('click', () => toggleMobileMenu(false));
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && root.classList.contains('is-open')) {
            toggleMobileMenu(false);
        }
    });
    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 992px)').matches && root.classList.contains('is-open')) {
            toggleMobileMenu(false);
        }
    });
}


// Footer Component - Insert footer HTML
function insertFooter(pageType = 'root') {
    const privacyPath = pageType === 'blog' ? '../privacy-policy.html' : 'privacy-policy.html';
    const termsPath = pageType === 'blog' ? '../terms-of-service.html' : 'terms-of-service.html';
    const base = pageType === 'blog' ? '../' : '';

    const navLinks = [
        { label: 'Fitness', href: categoryNavHref(pageType, 'fitness') },
        { label: 'Health', href: categoryNavHref(pageType, 'health') },
        { label: 'Nutrition', href: categoryNavHref(pageType, 'nutrition') },
        { label: "Editor's Pick", href: categoryNavHref(pageType, 'editors-pick') },
    ];

    const footerNavCols = (items) =>
        items.map((item) => `<a class="site-footer-nav-link" href="${item.href}">${item.label}</a>`).join('');

    const footerHTML = `
        <footer class="site-footer">
            <div class="site-footer-shell">
                <div class="site-footer-inner">
                    <div class="site-footer-brand-block">
                        <p class="site-footer-title">Daily Fitness Edit</p>
                        <p class="site-footer-tagline">Honest reads on training, recovery, and everyday strength.</p>
                        <p class="site-footer-newsletter-label">Get occasional notes in your inbox</p>
                        <form class="site-footer-newsletter" action="#" method="get" onsubmit="return false" aria-label="Newsletter signup">
                            <div class="site-footer-input-group">
                                <span class="site-footer-input-icon" aria-hidden="true">
                                    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2h16v10H1V2zm0 0l8 6 8-6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </span>
                                <input type="email" name="email" class="site-footer-email" placeholder="you@example.com" autocomplete="email" />
                                <button type="submit" class="site-footer-subscribe">Subscribe</button>
                            </div>
                        </form>
                        <a class="site-footer-social" href="https://www.instagram.com/dailyfitnessedit/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </div>
                    <nav class="site-footer-nav" aria-label="Site links">
                        <div class="site-footer-nav-cols">
                            <div class="site-footer-nav-col">
                                <p class="site-footer-nav-col-title">Categories</p>
                                ${footerNavCols(navLinks)}
                            </div>
                        </div>
                    </nav>
                </div>
                <div class="site-footer-bar">
                    <p class="site-footer-copy">&copy; 2026 Daily Fitness Edit. All rights reserved.</p>
                    <p class="site-footer-legal">
                        <a href="${privacyPath}">Privacy Policy</a>
                        <span class="site-footer-dot" aria-hidden="true">·</span>
                        <a href="${termsPath}">Terms of Service</a>
                    </p>
                </div>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

/** Story pages under /pages/ (not category listings): “Related articles” grid before footer */
const RELATED_ARTICLE_STORIES = [
    {
        file: '5-solutions-brain-fog-think-clearly.html',
        image: 'brain-fog-hero.png',
        meta: '<span style="color:#fff;background:#e65100;padding:0.1rem 0.32rem;border-radius:2px;">Editor\'s Pick</span> &nbsp;|&nbsp; APR 15, 2026',
        title: 'My Brain Felt Slow and Foggy All the Time — I Tested 5 Solutions for 12 Months That Helped Me Think Clearly Again',
        by: 'By Ashley Reyes',
    },
    {
        file: '7-exercises-that-actually-work.html',
        image: '7-easiest.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 3, 2026',
        title: '7 Easiest and Most Effective Exercises That Actually Work — According to Trainers',
        by: 'By Claire Montgomery',
    },
    {
        file: 'how-gym-changes-your-body-and-mind.html',
        image: 'gym-change-your-mind.png',
        meta: '<span style="color:#fff;background:#388e3c;padding:0.1rem 0.32rem;border-radius:2px;">Health</span> &nbsp;|&nbsp; APR 1, 2026',
        title: 'How Going to the Gym Actually Changes Your Body and Mind',
        by: 'By Elena Marlowe',
    },
    {
        file: 'what-i-eat-3-food-recommendations.html',
        image: 'food-hero.png',
        meta: '<span style="color:#fff;background:#1976d2;padding:0.1rem 0.32rem;border-radius:2px;">Nutrition</span> &nbsp;|&nbsp; APR 6, 2026',
        title: 'What I Eat: 3 Food Recommendations That Changed My Energy and Health',
        by: 'By Elena Marlowe',
    },
    {
        file: '4-products-changed-everything.html',
        image: '4-products-hero.png',
        meta: '<span style="color:#fff;background:#e65100;padding:0.1rem 0.32rem;border-radius:2px;">Editor\'s Pick</span> &nbsp;|&nbsp; MAR 28, 2026',
        title: 'I\'m A Busy Woman Who Wants To Stay Healthy — These 4 Products Changed My Fitness Game',
        by: 'By Sienna Hartley',
    },
    {
        file: 'my-3-month-gym-journey.html',
        image: '3month-hero.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 4, 2026',
        title: 'My 3-Month Gym Journey: How Showing Up Every Day Changed Everything',
        by: 'By Sienna Hartley',
    },
    {
        file: '5-things-help-me-get-my-strength-back.html',
        image: 'TPB-33-1.png',
        meta: '<span style="color:#fff;background:#e65100;padding:0.1rem 0.32rem;border-radius:2px;">Editor\'s Pick</span> &nbsp;|&nbsp; APR 8, 2026',
        title: 'My Shoulder Press Dropped From 33s to 22s — These 5 Things Helped Me Get My Strength Back',
        by: 'By Ashley Reyes',
    },
    {
        file: 'walking-20-minutes-daily-changed-my-energy.html',
        image: '1.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 20, 2026',
        title: 'I Started Walking 20 Minutes a Day — Here\'s What Changed in 30 Days',
        by: 'By Jordan Lee',
    },
    {
        file: 'meal-prep-sunday-five-boxes.html',
        image: '3.png',
        meta: '<span style="color:#fff;background:#1976d2;padding:0.1rem 0.32rem;border-radius:2px;">Nutrition</span> &nbsp;|&nbsp; APR 18, 2026',
        title: 'Meal Prep Sunday: Five Boxes That Saved My Weeknights',
        by: 'By Morgan Ellis',
    },
    {
        file: 'sleep-first-strength-later.html',
        image: '5.png',
        meta: '<span style="color:#fff;background:#388e3c;padding:0.1rem 0.32rem;border-radius:2px;">Health</span> &nbsp;|&nbsp; APR 16, 2026',
        title: 'Sleep First, Strength Later: The One Change That Unstuck My Training',
        by: 'By Riley Park',
    },
    {
        file: 'home-workouts-no-equipment.html',
        image: '7-hero.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 12, 2026',
        title: 'Home Workouts With Zero Equipment — A Template I Still Use',
        by: 'By Taylor Kim',
    },
    {
        file: 'desk-mobility-five-minute-habit.html',
        image: 'desk-mobility.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 22, 2026',
        title: 'Five-Minute Desk Mobility I Do Between Zoom Calls',
        by: 'By Casey Nguyen',
    },
    {
        file: 'resting-heart-rate-recovery-days.html',
        image: 'one-metric.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 21, 2026',
        title: 'The One Metric I Watch on Recovery Days (Besides Sleep)',
        by: 'By Devon Walsh',
    },
    {
        file: 'full-body-two-days-messy-weeks.html',
        image: 'full-body-lifts-hero.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 19, 2026',
        title: 'Full-Body Lifts on Messy Weeks: The Twice-a-Week Template I Actually Repeat',
        by: 'By Naomi Briggs',
    },
    {
        file: 'protein-at-breakfast-mid-morning-energy.html',
        image: 'protein-breakfast-hero.png',
        meta: '<span style="color:#fff;background:#1976d2;padding:0.1rem 0.32rem;border-radius:2px;">Nutrition</span> &nbsp;|&nbsp; APR 14, 2026',
        title: 'Protein at Breakfast Finally Stopped My 10 a.m. Crash',
        by: 'By Luis Ortega',
    },
    {
        file: 'stairs-for-thirty-days-small-change.html',
        image: 'stairs.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 11, 2026',
        title: 'I Took the Stairs on Purpose for 30 Days — Small Win, Real Difference',
        by: 'By Amina Okoro',
    },
    {
        file: 'five-energy-drinks-before-lifting.html',
        image: 'energy-drink.png',
        meta: '<span style="color:#fff;background:#1976d2;padding:0.1rem 0.32rem;border-radius:2px;">Nutrition</span> &nbsp;|&nbsp; APR 10, 2026',
        title: 'I Compared 5 Energy Drinks Before Workouts — Here\'s What Actually Held Up',
        by: 'By Jamie Cole',
    },
    {
        file: 'hotel-room-strength-twenty-minutes.html',
        image: '7-hero.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 9, 2026',
        title: 'A 20-Minute Hotel-Room Strength Session I Pack Every Trip',
        by: 'By Marco Ruiz',
    },
    {
        file: 'gym-after-flu-no-heroics-return.html',
        image: '3month-hero.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 7, 2026',
        title: 'Coming Back to the Gym After the Flu — The No-Heroics Pact That Worked',
        by: 'By Sienna Hartley',
    },
    {
        file: 'small-deload-weeks-finally-stuck.html',
        image: 'TPB-33-1.png',
        meta: '<span style="color:#1a1a1a;background:#ffef91;padding:0.1rem 0.32rem;border-radius:2px;">Fitness</span> &nbsp;|&nbsp; APR 5, 2026',
        title: 'Why Small Deload Weeks Finally Stuck (And Saved My Progress)',
        by: 'By Riley Chen',
    },
];

/** Story pages with sidebar rail but omitted from RELATED_ARTICLE_STORIES (used only for ad alternation order). */
const ARTICLE_SIDEBAR_AD_EXTRA_FILES = ['home-decor-less-than-50.html'];

const ARTICLE_SIDEBAR_AD_ASSETS = [
    { image: 'oura-ring.png', alt: 'Oura Ring' },
    { image: 'apple-watch.png', alt: 'Apple Watch' },
];

/** 0 = first asset (Oura), 1 = second (Apple Watch); stable per filename. */
function getArticleSidebarAdSlot(file) {
    const ordered = [
        ...new Set([...RELATED_ARTICLE_STORIES.map((s) => s.file), ...ARTICLE_SIDEBAR_AD_EXTRA_FILES]),
    ].sort();
    const i = ordered.indexOf(file);
    if (i >= 0) return i % ARTICLE_SIDEBAR_AD_ASSETS.length;
    let h = 0;
    for (let c = 0; c < file.length; c += 1) {
        h = (h * 31 + file.charCodeAt(c)) >>> 0;
    }
    return h % ARTICLE_SIDEBAR_AD_ASSETS.length;
}

/** Preset thread under Comments — three items per story page (topic-matched; not stored). */
const ARTICLE_PRESET_COMMENTS_BY_PAGE = {
    '5-solutions-brain-fog-think-clearly.html': [
        { initial: 'D', name: 'Dana P.', time: 'Apr 19, 2026', text: 'The part about stacking small habits over a year is what I needed. Brain fog is so hard to explain to people.' },
        { initial: 'J', name: 'Jordan W.', time: 'Apr 18, 2026', text: 'Curious if you still use the same stack now. This read felt really grounded compared to most supplement posts.' },
        { initial: 'L', name: 'Lee M.', time: 'Apr 17, 2026', text: 'Sent this to my sister. She has been blaming sleep only — your recovery angle clicked.' },
    ],
    '7-exercises-that-actually-work.html': [
        { initial: 'T', name: 'Tara B.', time: 'Apr 12, 2026', text: 'Finally a list that is not 20 burpee variations. I tried two of these after leg day and they felt doable.' },
        { initial: 'K', name: 'Ken O.', time: 'Apr 11, 2026', text: 'Trainer here — agree that consistency beats novelty. Nice breakdown for readers who are new to the gym.' },
        { initial: 'A', name: 'Ari N.', time: 'Apr 10, 2026', text: 'Would love a short follow-up on how often you cycle these in a week. Great article.' },
    ],
    'how-gym-changes-your-body-and-mind.html': [
        { initial: 'E', name: 'Evan R.', time: 'Apr 14, 2026', text: 'The mood shift after month two is real. I did not expect the mental side to hit before the mirror did.' },
        { initial: 'N', name: 'Nina C.', time: 'Apr 13, 2026', text: 'Shared with my partner who thinks the gym is only for aesthetics. This explains the whole picture better than I could.' },
        { initial: 'H', name: 'Hannah T.', time: 'Apr 12, 2026', text: 'Love that you called out sleep and stress, not just sets and reps. That is where people usually quit.' },
    ],
    'what-i-eat-3-food-recommendations.html': [
        { initial: 'P', name: 'Priya S.', time: 'Apr 16, 2026', text: 'Swapped one of my afternoon snacks after reading this. Energy crash is noticeably smaller.' },
        { initial: 'M', name: 'Marco D.', time: 'Apr 15, 2026', text: 'Simple and practical — not another rigid meal plan. Thank you for keeping it human.' },
        { initial: 'C', name: 'Chris L.', time: 'Apr 14, 2026', text: 'Do you batch cook on Sundays or wing it? Either way these three anchors make sense for busy weeks.' },
    ],
    '4-products-changed-everything.html': [
        { initial: 'V', name: 'Vivian H.', time: 'Apr 9, 2026', text: 'As someone who travels for work, I appreciate that none of this reads like a junk drawer of gadgets.' },
        { initial: 'O', name: 'Owen F.', time: 'Apr 8, 2026', text: 'Bought one of these on a whim last month. Your honest take on what actually gets used daily resonated.' },
        { initial: 'I', name: 'Iris K.', time: 'Apr 7, 2026', text: 'The busy-mom angle is not preachy. Short list, clear why — more articles like this please.' },
    ],
    'my-3-month-gym-journey.html': [
        { initial: 'B', name: 'Brett Y.', time: 'Apr 11, 2026', text: 'Three months is a believable timeline. I like that you did not promise a six-pack in two weeks.' },
        { initial: 'W', name: 'Will S.', time: 'Apr 10, 2026', text: 'Showing up every day is the hardest part. Your note about boring weeks was oddly motivating.' },
        { initial: 'G', name: 'Gina P.', time: 'Apr 9, 2026', text: 'Did you track workouts in an app or a notebook? Curious how you kept the streak on rough days.' },
    ],
    '5-things-help-me-get-my-strength-back.html': [
        { initial: 'R', name: 'Rachel M.', time: 'Apr 22, 2026', text: 'I was skeptical at first — I\'d tried a few supplements before and felt nothing. Triple Power Build was different. By week four my shoulder press was back up and I wasn\'t dreading leg day anymore. It\'s the only thing I\'ve stuck with consistently.' },
        { initial: 'D', name: 'Danielle K.', time: 'Apr 21, 2026', text: 'I lost a lot of strength after a stressful few months and couldn\'t figure out why. A friend recommended Triple Power Build and within six weeks I was lifting heavier than before my slump. The recovery difference alone was worth it.' },
        { initial: 'R', name: 'Rae L.', time: 'Apr 20, 2026', text: 'Shoulder numbers dipping is so demoralizing. Glad you spelled out what actually moved the needle for you.' },
        { initial: 'S', name: 'Sam V.', time: 'Apr 19, 2026', text: 'Physical therapy plus patience — good reminder. I have been trying to rush the bar back up too fast.' },
        { initial: 'Q', name: 'Quinn J.', time: 'Apr 18, 2026', text: 'Which of the five did you notice first in the gym? For me it was sleep before anything else clicked.' },
    ],
    'walking-20-minutes-daily-changed-my-energy.html': [
        { initial: 'F', name: 'Felix R.', time: 'Apr 21, 2026', text: 'Twenty minutes is the sweet spot. I have been doing the same after lunch and the crash is way shorter.' },
        { initial: 'N', name: 'Nora T.', time: 'Apr 20, 2026', text: 'Not glamorous but it stuck. Better than the gym membership I was not using.' },
        { initial: 'B', name: 'Ben C.', time: 'Apr 19, 2026', text: 'Same route every day sounds boring until you realize you stop negotiating with yourself.' },
    ],
    'meal-prep-sunday-five-boxes.html': [
        { initial: 'A', name: 'Alma V.', time: 'Apr 19, 2026', text: 'Five boxes is realistic. Most meal-prep posts assume I have three hours and a film crew.' },
        { initial: 'J', name: 'Jules M.', time: 'Apr 18, 2026', text: 'The backup dinner idea saved me twice this week. Simple but it works.' },
        { initial: 'T', name: 'Tess O.', time: 'Apr 17, 2026', text: 'Started with three like you said. Already bumped to four without feeling overwhelmed.' },
    ],
    'sleep-first-strength-later.html': [
        { initial: 'K', name: 'Kai D.', time: 'Apr 17, 2026', text: 'I kept adding volume until I was wrecked. This was the permission slip to back off and recover.' },
        { initial: 'M', name: 'Mira L.', time: 'Apr 16, 2026', text: 'Warm-ups feeling heavy was exactly my sign too. Tracking that was a lightbulb moment.' },
        { initial: 'P', name: 'Paul H.', time: 'Apr 15, 2026', text: 'Boring fix, big payoff. Wish I had read this before I rewrote my whole split twice.' },
    ],
    'home-workouts-no-equipment.html': [
        { initial: 'Z', name: 'Zoe P.', time: 'Apr 13, 2026', text: 'The towel rows on a door are genius for travel. Whole routine fits in a hotel hallway.' },
        { initial: 'D', name: 'Drew K.', time: 'Apr 12, 2026', text: 'Twenty minutes and done — I actually finish these. No equipment excuses left.' },
        { initial: 'E', name: 'Ellie S.', time: 'Apr 11, 2026', text: 'Progressing on rep quality instead of new moves is what I needed to hear.' },
    ],
    'desk-mobility-five-minute-habit.html': [
        { initial: 'C', name: 'Caleb R.', time: 'Apr 23, 2026', text: 'Between meetings is exactly when I stiffen up. Five minutes is doable without feeling silly.' },
        { initial: 'W', name: 'Whit A.', time: 'Apr 22, 2026', text: 'Chair thoracic opens are underrated. I do two rounds before my last call block.' },
        { initial: 'H', name: 'Holly N.', time: 'Apr 21, 2026', text: 'Frequency over duration — yes. This is the first desk thing I did not abandon in a week.' },
    ],
    'resting-heart-rate-recovery-days.html': [
        { initial: 'O', name: 'Omar S.', time: 'Apr 22, 2026', text: 'Autoregulating squat days off one morning number sounds wild until you try it. Fewer junk grinders.' },
        { initial: 'Y', name: 'Yuki T.', time: 'Apr 21, 2026', text: 'Yellow morning = accessories instead of a second heavy compound. That line alone was worth it.' },
        { initial: 'L', name: 'Lane P.', time: 'Apr 20, 2026', text: 'Finally a wearable story that is about programming, not meditation apps. More of this angle please.' },
    ],
    'full-body-two-days-messy-weeks.html': [
        { initial: 'R', name: 'Rina K.', time: 'Apr 20, 2026', text: 'Day A / Day B with a fallback to only Day A is exactly how I survived conference season.' },
        { initial: 'G', name: 'Gabe F.', time: 'Apr 19, 2026', text: 'Progressing one variable at a time clicked. I stopped scrapping the whole block when work blew up.' },
        { initial: 'S', name: 'Sofia M.', time: 'Apr 18, 2026', text: 'Nothing exotic is the point. I finally have a default I do not have to rethink every Sunday night.' },
    ],
    'protein-at-breakfast-mid-morning-energy.html': [
        { initial: 'N', name: 'Noah B.', time: 'Apr 15, 2026', text: 'Additive not subtractive — that line landed. I still eat toast, just not only toast.' },
        { initial: 'E', name: 'Erin J.', time: 'Apr 14, 2026', text: '10 a.m. crash was my whole brand. Eggs first genuinely helped without counting macros.' },
        { initial: 'D', name: 'Dante L.', time: 'Apr 13, 2026', text: 'Leftovers for breakfast is genius when I am lazy. Why did I not think of that sooner.' },
    ],
    'stairs-for-thirty-days-small-change.html': [
        { initial: 'M', name: 'Milo C.', time: 'Apr 12, 2026', text: 'Fourth floor crew. Small win but I feel less winded on hikes now.' },
        { initial: 'A', name: 'Ana V.', time: 'Apr 11, 2026', text: 'Gateway habit idea resonates. I added a short walk after because stairs felt doable.' },
        { initial: 'J', name: 'Jared T.', time: 'Apr 10, 2026', text: 'Not a transformation story — thank you. Consistency without theatrics.' },
    ],
    'five-energy-drinks-before-lifting.html': [
        { initial: 'K', name: 'Kim R.', time: 'Apr 11, 2026', text: 'Finally someone judged these on squats, not vibes. The carbonation point is too real.' },
        { initial: 'V', name: 'Vic L.', time: 'Apr 10, 2026', text: 'I am the person who always bought the strongest can. Rethinking after the shaky top set bit.' },
        { initial: 'T', name: 'Talia S.', time: 'Apr 9, 2026', text: 'Banana and coffee footnote made me laugh — also fair. Good comparison format.' },
    ],
    'hotel-room-strength-twenty-minutes.html': [
        { initial: 'P', name: 'Pete W.', time: 'Apr 10, 2026', text: 'Towel rows saved my back on a two-week trip. Maintenance mindset clicked.' },
        { initial: 'I', name: 'Ines G.', time: 'Apr 9, 2026', text: 'Same reps slower negatives — I stopped treating travel workouts like a PR session.' },
        { initial: 'U', name: 'Uma D.', time: 'Apr 8, 2026', text: 'Split squats with bed balance is stable enough for me. Simple template.' },
    ],
    'gym-after-flu-no-heroics-return.html': [
        { initial: 'F', name: 'Frank O.', time: 'Apr 8, 2026', text: 'No PRs for ten days is the rule I needed. I always come back too hot and pay for it.' },
        { initial: 'C', name: 'Cara M.', time: 'Apr 7, 2026', text: 'Heart rate spike on warm-ups as a stop signal — smart. I have ignored that too long.' },
        { initial: 'B', name: 'Bo H.', time: 'Apr 6, 2026', text: 'Boring rules that work > heroic comeback posts. This read felt adult.' },
    ],
    'small-deload-weeks-finally-stuck.html': [
        { initial: 'X', name: 'Ximena R.', time: 'Apr 6, 2026', text: 'Scheduling deload before I feel broken is new for me. Log line idea stolen.' },
        { initial: 'Q', name: 'Quentin L.', time: 'Apr 5, 2026', text: 'Same lifts fewer hard sets — I finally understand what “downramp” means in practice.' },
        { initial: 'N', name: 'Nia P.', time: 'Apr 4, 2026', text: 'PRs lining up after lighter weeks matches my coach keeps saying. Nice to read it plain.' },
    ],
};

const ARTICLE_PRESET_COMMENTS_FALLBACK = [
    { initial: 'M', name: 'Maya K.', time: 'Apr 18, 2026', text: 'Loved the honesty here — this site has been one of the more grounded fitness reads lately.' },
    { initial: 'R', name: 'Rico V.', time: 'Apr 17, 2026', text: 'Saving this. Simple takeaways and no screaming headline — appreciated.' },
    { initial: 'S', name: 'Sonia L.', time: 'Apr 16, 2026', text: 'Would love a follow-up piece. Great read either way.' },
];

function getPresetCommentsForArticle(file) {
    const list = ARTICLE_PRESET_COMMENTS_BY_PAGE[file];
    return Array.isArray(list) && list.length ? list : ARTICLE_PRESET_COMMENTS_FALLBACK;
}

/** Guest comments under related articles: show in-page only, not sent or persisted */
function setupArticleGuestComments() {
    const section = document.getElementById('related-articles');
    const form = document.getElementById('article-guest-comment-form');
    const list = document.getElementById('article-fake-comment-list');
    const countEl = document.getElementById('article-comments-count');
    if (!section || !form || !list || !countEl) return;

    const presetCount = list.querySelectorAll('.article-fake-comment--preset').length;
    let total = presetCount;

    function setCount() {
        countEl.textContent = `${total} comment${total === 1 ? '' : 's'}`;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="guest-name"]');
        const bodyInput = form.querySelector('[name="guest-body"]');
        const rawName = (nameInput && nameInput.value) || '';
        const rawBody = (bodyInput && bodyInput.value) || '';
        const body = rawBody.trim();
        if (!body) return;

        const displayName = rawName.trim() || 'Guest';
        const initial = (displayName.charAt(0) || '?').toUpperCase();
        const dateStr = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        const li = document.createElement('li');
        li.className = 'article-fake-comment article-fake-comment--guest';

        const avatar = document.createElement('div');
        avatar.className = 'article-fake-comment-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        const avSpan = document.createElement('span');
        avSpan.textContent = initial;
        avatar.appendChild(avSpan);

        const bodyWrap = document.createElement('div');
        const head = document.createElement('p');
        head.className = 'article-fake-comment-head';
        const strong = document.createElement('strong');
        strong.textContent = displayName;
        head.appendChild(strong);
        const timeSpan = document.createElement('span');
        timeSpan.className = 'article-fake-comment-time';
        timeSpan.textContent = ` · ${dateStr}`;
        head.appendChild(timeSpan);

        const textP = document.createElement('p');
        textP.className = 'article-fake-comment-text';
        textP.textContent = body;

        bodyWrap.appendChild(head);
        bodyWrap.appendChild(textP);
        li.appendChild(avatar);
        li.appendChild(bodyWrap);
        list.appendChild(li);

        total += 1;
        setCount();
        form.reset();
        li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    setCount();
}

/** Aesop-style horizontal banner mid-article (Ninja). */
function insertArticleHorizontalAd(blogContents, imgBase) {
    if (!blogContents || blogContents.querySelector('.article-horiz-ad')) return;

    const horiz = document.createElement('aside');
    horiz.className = 'article-horiz-ad';
    horiz.setAttribute('aria-label', 'Advertisement');
    horiz.innerHTML = `
        <p class="article-horiz-ad-kicker">Advertisement</p>
        <div class="article-horiz-ad-split">
          <div class="article-horiz-ad-copy">
            <p class="article-horiz-ad-brand">Ninja</p>
            <p class="article-horiz-ad-headline">Countertop power, cookbook calm—quiet mornings that still get things done.</p>
            <span class="article-horiz-ad-cta">Discover Ninja</span>
          </div>
          <div class="article-horiz-ad-media">
            <img src="${imgBase}ninja.png" alt="Ninja blender on a marble kitchen counter" loading="eager">
          </div>
        </div>
    `;

    const blocks = [...blogContents.children];
    const mid = Math.floor(blocks.length / 2);
    const nextEl = blocks[mid] || null;
    if (nextEl) {
        blogContents.insertBefore(horiz, nextEl);
    } else {
        blogContents.appendChild(horiz);
    }
}

/** Vertical sidebar promo on story pages (desktop: right column; mobile: below article). */
function insertArticleSidebarAd(pageType) {
    if (pageType !== 'blog') return;
    if (!window.location.pathname.includes('/pages/')) return;
    const file = (window.location.pathname.split('/').pop() || '').split('?')[0];
    if (!file.endsWith('.html') || file.startsWith('category-')) return;

    const section = document.querySelector('section.w-60');
    const blogContents = section && section.querySelector(':scope > .blog-contents');
    if (!blogContents || section.querySelector('.article-layout-with-rail')) return;

    const imgBase = '../assets/images/';
    const ad = ARTICLE_SIDEBAR_AD_ASSETS[getArticleSidebarAdSlot(file)];

    const wrapper = document.createElement('div');
    wrapper.className = 'article-layout-with-rail row align-items-start gx-3 gx-lg-4';

    const mainCol = document.createElement('div');
    mainCol.className = 'col-12 col-lg-8 article-layout-main';

    const aside = document.createElement('aside');
    aside.className = 'col-12 col-lg-4 article-sidebar-ad';
    aside.setAttribute('aria-label', 'Advertisement');

    aside.innerHTML = `
      <div class="article-sidebar-ad-inner">
        <p class="article-sidebar-ad-label">Advertisement</p>
        <div class="article-sidebar-ad-frame">
          <img class="article-sidebar-ad-img" src="${imgBase}${ad.image}" alt="${ad.alt}" loading="lazy">
        </div>
        <span class="article-sidebar-ad-btn">Shop now</span>
      </div>
    `;

    const parent = blogContents.parentNode;
    parent.insertBefore(wrapper, blogContents);
    wrapper.appendChild(mainCol);
    mainCol.appendChild(blogContents);
    insertArticleHorizontalAd(blogContents, imgBase);
    wrapper.appendChild(aside);

    setupArticleSidebarAdResponsive();
}

/** Mobile: place vertical ad mid-article; desktop: keep in right rail. */
function relocateArticleSidebarAdForViewport() {
    const wrapper = document.querySelector('.article-layout-with-rail');
    const blog = document.querySelector('.article-layout-main .blog-contents');
    const aside = document.querySelector('.article-sidebar-ad');
    if (!wrapper || !blog || !aside) return;

    const mobile = window.matchMedia('(max-width: 991.98px)').matches;

    if (mobile) {
        const horiz = blog.querySelector('.article-horiz-ad');
        const blocks = [...blog.children].filter(
            (el) => el !== aside && !el.classList.contains('article-horiz-ad')
        );
        const mid = Math.floor(blocks.length / 2);
        let nextEl = blocks[mid] || null;
        aside.classList.add('article-sidebar-ad--in-flow');
        if (nextEl) {
            blog.insertBefore(aside, nextEl);
        } else {
            blog.appendChild(aside);
        }
        /* Avoid stacking both promos back-to-back: push Oura below Ninja + a bit of body copy. */
        if (horiz && horiz.nextElementSibling === aside) {
            let ref = aside.nextElementSibling;
            let contentSteps = 0;
            while (ref && contentSteps < 2) {
                if (ref.nodeType === 1 && !ref.classList.contains('article-horiz-ad')) {
                    contentSteps += 1;
                }
                if (contentSteps < 2) {
                    ref = ref.nextElementSibling;
                }
            }
            if (ref) {
                blog.insertBefore(aside, ref.nextElementSibling);
            } else {
                blog.appendChild(aside);
            }
        }
    } else {
        aside.classList.remove('article-sidebar-ad--in-flow');
        wrapper.appendChild(aside);
    }
}

function setupArticleSidebarAdResponsive() {
    const mq = window.matchMedia('(max-width: 991.98px)');
    const run = () => {
        relocateArticleSidebarAdForViewport();
    };
    run();
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', run);
    } else {
        mq.addListener(run);
    }
}

function insertRelatedArticlesSection(pageType) {
    if (pageType !== 'blog') return;
    if (!window.location.pathname.includes('/pages/')) return;
    const file = (window.location.pathname.split('/').pop() || '').split('?')[0];
    if (!file.endsWith('.html') || file.startsWith('category-')) return;
    if (document.getElementById('related-articles')) return;

    const others = RELATED_ARTICLE_STORIES.filter((s) => s.file !== file);
    const show = others.slice(0, 3);
    if (show.length === 0) return;

    const imgBase = '../assets/images/';
    const cards = show
        .map(
            (it) => `
    <div class="col-12 col-md-4">
      <article class="article-related-card">
        <a href="${it.file}"><img class="article-related-img" src="${imgBase}${it.image}" alt=""></a>
        <div class="article-related-body">
          <p class="article-related-meta">${it.meta}</p>
          <h3 class="article-related-title"><a href="${it.file}">${it.title}</a></h3>
          <p class="article-related-by">${it.by}</p>
        </div>
      </article>
    </div>`
        )
        .join('');

    const commentItems = getPresetCommentsForArticle(file)
        .map(
            (c) => `
        <li class="article-fake-comment article-fake-comment--preset">
          <div class="article-fake-comment-avatar" aria-hidden="true"><span>${c.initial}</span></div>
          <div>
            <p class="article-fake-comment-head"><strong>${c.name}</strong> <span class="article-fake-comment-time">· ${c.time}</span></p>
            <p class="article-fake-comment-text">${c.text}</p>
          </div>
        </li>`
        )
        .join('');

    const html = `
    <section id="related-articles" class="article-related" aria-labelledby="article-related-heading">
      <div class="article-related-cards-sheet">
        <div class="article-related-outer">
          <div class="article-related-wrap py-3 py-md-4">
            <h2 id="article-related-heading" class="article-related-heading">Related articles</h2>
            <div class="row g-2 g-md-3 mx-0">${cards}</div>
          </div>
        </div>
      </div>
      <div class="article-related-comments-sheet">
        <div class="article-related-outer">
          <div class="article-related-wrap py-3 py-md-4">
          <div class="article-fake-comments" id="article-fake-comments" role="region" aria-labelledby="article-fake-comments-title">
            <h3 class="article-fake-comments-title" id="article-fake-comments-title">Comments</h3>
            <p id="article-comments-count" class="article-fake-comments-kicker">3 comments</p>
            <ul id="article-fake-comment-list" class="article-fake-comment-list list-unstyled mb-0">
              ${commentItems}
            </ul>
            <form id="article-guest-comment-form" class="article-guest-comment-form" action="#" method="get" autocomplete="off">
              <label class="article-guest-comment-label" for="article-guest-name">Name <span class="article-guest-optional">(optional)</span></label>
              <input id="article-guest-name" class="article-guest-comment-input" type="text" name="guest-name" maxlength="80" placeholder="Your name">
              <label class="article-guest-comment-label" for="article-guest-body">Comment</label>
              <textarea id="article-guest-body" class="article-guest-comment-textarea" name="guest-body" rows="3" maxlength="2000" required placeholder="Share your thoughts…"></textarea>
              <div class="article-guest-comment-actions">
                <button type="submit" class="article-fake-composer-btn">Post comment</button>
              </div>
            </form>
          </div>
          </div>
        </div>
      </div>
    </section>`;

    const footer = document.querySelector('.site-footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', html);
        setupArticleGuestComments();
    }
}

//Quote Component - Reusbale testimonial block
function createQuoteComponent({ testimonial, author}) {
    return `
        
        <div class="quote-card p-3 my-3 border rounded-4">
            <p class="quote-text fs-5 fst-italic m-2 text-left">“${testimonial}”</p>
            <p class="quote-author fw-semibold mb-1" style="text-align: right; margin-right: 40px;">– ${author}</p>
        </div>
    
    `;
}

// Image Component - Reusable image + caption block
function createImageComponent({ src, alt, caption }) {
    // Adjust image path if needed (for blog pages, etc.)
   
    
    return `
      <div class="d-flex flex-column align-items-center my-4">
        <img 
          src="assets/images/${src}" 
          alt="${alt}" 
          class="rounded-2 mb-2 img-fluid"
          style="width: 100%; height: auto;"
        >
        <p class="text-muted text-center small">${caption}</p>
      </div>
    `;
  }


// Hamburger menu toggle (pass false to force close)
function toggleMobileMenu(forceOpen) {
    const hamburger = document.querySelector('.hamburger-menu');
    const root = document.getElementById('mobile-nav-root');
    if (!hamburger || !root) return;

    const isOpen =
        forceOpen === true
            ? true
            : forceOpen === false
              ? false
              : !root.classList.contains('is-open');

    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    root.classList.toggle('is-open', isOpen);
    root.hidden = !isOpen;
    document.body.classList.toggle('mobile-nav-open', isOpen);
}

// Expose for inline handlers if any page still calls without args
window.toggleMobileMenu = toggleMobileMenu;

// Load components immediately when script loads (before DOM ready)
(function() {
    // Check if we're in a subdirectory (blog or pages)
    const isInSubdir = window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/');
    const pageType = isInSubdir ? 'blog' : 'root';
    
    // Determine current page for active state
    let currentPage = '';
    if (window.location.pathname.includes('/blog/') || window.location.pathname.includes('/pages/')) {
        currentPage = 'blog';
    } else if (window.location.pathname.includes('quiz.html')) {
        currentPage = 'quiz';
    }
    
    // Insert head elements immediately
    insertHeadElements(pageType);
    
    // Insert navigation and footer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!document.querySelector('.site-header')) {
                insertNavigation(pageType, currentPage);
            }
            if (!document.querySelector('.site-footer')) {
                insertFooter(pageType);
            }
            insertArticleSidebarAd(pageType);
            insertRelatedArticlesSection(pageType);
        });
    } else {
        // DOM already loaded
        if (!document.querySelector('.site-header')) {
            insertNavigation(pageType, currentPage);
        }
        if (!document.querySelector('.site-footer')) {
            insertFooter(pageType);
        }
        insertArticleSidebarAd(pageType);
        insertRelatedArticlesSection(pageType);
    }
})();

function createProductShowcase(config) {
    const {
        image,
        alt,
        url,
        description,
        clickable = true,
        pageType = 'root'
    } = config;

    reviews ={
        "https://www.pacagen.com/products/cat-allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"],
        "https://www.pacagen.com/products/dog-allergen-neutralizing-spray": ["4.87 out of 5 stars", ""],
        "https://www.pacagen.com/products/dust-allergen-neutralizing-spray": ["4.86 out of 5 stars", ""],
        "https://www.pacagen.com/products/cat-food-topper-chicken": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/cat-allergen-reducing-supplement": ["4.80 out of 5 stars", "(200+ reviews)"],
        "https://www.pacagen.com/products/allergen-neutralizing-spray": ["4.72 out of 5 stars", "(600+ reviews)"]
    }
    
    // Determine the correct asset path
    const assetPath = pageType === 'blog' ? '../assets' : 'assets';
    
    if (clickable && url) {
        return `
        <a href="javascript:void(0)" class="d-flex w-md-65 justify-content-center align-items-center text-decoration-none" onclick="f('${url}')">
            <div class="card p-2 mt-3 mb-3">
                <div class="row mx-auto">
                    <div class="col-5 col-sm-4 col-md-3 p-0 px-md-2">
                        <img src="${assetPath}/images/${image}" class=" rounded-4" alt="${alt}">
                    </div>
                    <div class="col-7 my-auto col-sm-8 col-md-9">
                        <h3 class="card-title"><b>${alt}</b></h3>
                        <p class="card-reviews mb-1">★★★★★ &nbsp ${reviews[url][0]} ${reviews[url][1]}</p>
                        <p class="card-description mb-0">${description}</p>
                        <div class="ctabutton mt-2">Claim your 15% off now</div>
                    </div>
                </div>
            </div>
        </a>
        `;
    } else {
        return `
            <div class="article-content-image d-flex">
                <img src="${assetPath}/images/${image}" class="article-img" alt="${alt}">
            </div>
        `;
    }
}

// Function to insert product showcase into page
function insertProductShowcase(targetSelector, config) {
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML('afterend', createProductShowcase(config));
    }
}


// Wait for DOM to be fully loaded for additional functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const moreViewport = document.getElementById('home-more-viewport');
    const morePrev = document.querySelector('.home-more-prev');
    const moreNext = document.querySelector('.home-more-next');
    if (moreViewport) {
        function updateHomeMoreArrows() {
            const { scrollLeft, clientWidth, scrollWidth } = moreViewport;
            const atStart = scrollLeft <= 2;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 2;
            if (morePrev) morePrev.disabled = atStart;
            if (moreNext) moreNext.disabled = atEnd;
        }
        const scrollStep = () => Math.max(220, Math.floor(moreViewport.clientWidth * 0.72));
        if (morePrev) {
            morePrev.addEventListener('click', () => {
                moreViewport.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
            });
        }
        if (moreNext) {
            moreNext.addEventListener('click', () => {
                moreViewport.scrollBy({ left: scrollStep(), behavior: 'smooth' });
            });
        }
        moreViewport.addEventListener('scroll', updateHomeMoreArrows, { passive: true });
        window.addEventListener('resize', updateHomeMoreArrows);
        updateHomeMoreArrows();
    }
});