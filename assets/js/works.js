'use strict';

$(function () {
    // --- 1. 変数の定義 ---
    const $nav = $('.nav');
    const modal = document.getElementById('worksModal');
    const $cursor = $('#modalCursor');
    const $cursorText = $('.cursor-text');
    const arrowImgPath = "assets/images/works/arrow_cursor.svg"; 
    const worksGrid = document.getElementById('worksGrid');
    
    let currentFilteredWorks = [];
    let currentIndex = 0;

    // --- 2. 演出系関数 ---
    function dogJump() {
        const $dog = $('.menuDog');
        $dog.removeClass('is-jumping');
        setTimeout(() => { $dog.addClass('is-jumping'); }, 10);
    }

    const handleHeaderHideAtFooter = () => {
        const header = document.querySelector('.header');
        const footer = document.querySelector('.footer');
        if (!header || !footer) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                header.classList.toggle('is-hide', entry.isIntersecting);
            });
        }, { threshold: 0 });
        observer.observe(footer);
    };
    handleHeaderHideAtFooter();

    // --- 3. Worksデータと表示 ---
    const worksData = [];
    function getFullFileName(name) {
        if (!name) return "";
        if (name.includes('.')) return name;
        return `${name}.webp`;
    }

    // データ登録
    worksData.push({ category: ['digital'], tag: 'CLIENT WORK', title: '私立図書館 祝日様', subTitle: 'RISING SUN ROCK FESTIVAL in EZO 2025', img: 'digital_client_01', subImages: ['digital_client_sub02'] });
    const dOrderTitles = ['Commission レト口映画ポスター風', 'Commission', 'Commission'];
    dOrderTitles.forEach((t, i) => worksData.push({ category: ['digital', 'order'], tag: 'ORDER', title: t, subTitle: '', img: `digital_order_0${i+1}`, subImages: [] }));
    const dOriTitles = ['Just Bought Socks', 'Birthday', 'Chicken', 'GO VOTE', 'Left behind on the moon', 'グランド・ブダペスト・ホテル', 'Home Alone. Merry Christmas! ', 'もう一年経っちゃった', '犬だってお洒落したい', 'Chickens', 'プレゼントが消えた', 'TOY BOX', 'The 25th Birthday Cake', 'キャトルミューティレーション', "Nobody's Purrfect, Emma", '"Inspired by Wes Anderson posters"', '遅刻、遅刻！', 'Napoleon Dynamite', '視線の先に', 'BONSAI', "What's your story?", 'Call Me by Your Name', 'どこ行こう、、', 'Find', '針を落として', 'Have you seen Emma?', 'Girl with a Pearl Earring'];
    for (let i = 1; i <= 27; i++) { worksData.push({ category: ['digital', 'original'], tag: 'ORIGINAL', title: dOriTitles[i-1] || `ORIGINAL WORK ${i}`, subTitle: '', img: `digital_original_${i.toString().padStart(2, '0')}`, subImages: [] }); }
    const cOriTitles = ['視線の先に', 'FACE SERIES'];
    cOriTitles.forEach((t, i) => worksData.push({ category: ['canvas', 'original'], tag: 'ORIGINAL', title: t, subTitle: '', img: `canvas_original_0${i+1}`, subImages: [] }));
    const cOrderTitles = ['Farming dream on another planet.', 'Two years in harmony ', 'Somewhere with you', 'Time Just for the Two of Us', 'Our Little Movie World.', 'Taken by love', 'ALL the love in one small scene', 'Too scared for this surprise. ', 'Teine is good...', 'Koume', 'POTE cat shape'];
    for (let i = 1; i <= 11; i++) { worksData.push({ category: ['canvas', 'order'], tag: 'ORDER', title: cOrderTitles[i-1] || `ORDER WORK ${i}`, subTitle: '', img: `canvas_order_${i.toString().padStart(2, '0')}`, subImages: [] }); }

    function displayWorks(filterType = 'all') {
        if (!worksGrid) return;
        worksGrid.innerHTML = '';
        currentFilteredWorks = (filterType === 'all') ? worksData : worksData.filter(w => w.category.includes(filterType));
        
        currentFilteredWorks.forEach((work, index) => {
            const fileName = getFullFileName(work.img);
            const fontClass = /^[ -~]*$/.test(work.title) ? 'is-en' : 'is-jp';
            let subHtml = work.subTitle ? `<p class="works__subTitle ${/^[ -~]*$/.test(work.subTitle)?'is-en':'is-jp'}">${work.subTitle}</p>` : '';
            
            const html = `
                <article class="works__item" data-index="${index}">
                    <div class="works__imgWrap">
                        <img src="assets/images/works/${fileName}" alt="${work.title}" loading="lazy">
                    </div>
                    <div class="works__info">
                        <p class="works__title ${fontClass}">${work.title}</p>
                        ${subHtml}
                        <p class="works__tag">${work.tag}</p>
                    </div>
                </article>`;
            worksGrid.insertAdjacentHTML('beforeend', html);
        });
        
        // アニメーション用クラス付与
        setTimeout(() => { 
            $('.article__footer, .footer').addClass('is-ready');
            document.querySelectorAll('.works__item').forEach((item, i) => { 
                setTimeout(() => item.classList.add('is-visible'), i * 50); 
            }); 
        }, 50);
    }

    function updateModal() {
        const work = currentFilteredWorks[currentIndex];
        const fullTitleEl = document.getElementById('modalFullTitle');
        fullTitleEl.innerHTML = `<div class="${/^[ -~]*$/.test(work.title) ? 'is-en' : 'is-jp'}">${work.title}</div>` + (work.subTitle ? `<div class="modal__subTitle ${/^[ -~]*$/.test(work.subTitle) ? 'is-en' : 'is-jp'}">${work.subTitle}</div>` : '');
        document.getElementById('modalTag').textContent = work.tag;
        const imgContainer = document.getElementById('modalImageContainer');
        if (imgContainer) {
            let imagesHtml = `<img src="assets/images/works/${getFullFileName(work.img)}" class="modal__img">`;
            if (work.subImages) {
                work.subImages.forEach(sub => {
                    imagesHtml += `<img src="assets/images/works/${getFullFileName(sub)}" class="modal__img">`;
                });
            }
            imgContainer.innerHTML = imagesHtml;
        }
    }

    // --- メニューの犬ジャンプ演出 ---
    function dogJump() {
        const $dog = $('.menuDog');
        $dog.removeClass('is-jumping');
        setTimeout(() => {
            $dog.addClass('is-jumping');
        }, 10);
    }

    $('.header__topic .header__menu').on('click', function () {
        $nav.addClass('is-active');
        $('body').css('overflow', 'hidden');
        dogJump();
    });

    $('.nav .header__menu').on('click', function () {
        $nav.removeClass('is-active');
        $('body').removeClass('is-fixed');
        dogJump();
    });

    $('.nav__item a').on('click', function (e) {
        const $link = $(this);
        const href = $link.attr('href');

        if (href && !href.startsWith('#') && !$link.parent().hasClass('nav__item--contact')) {
            e.preventDefault();
            const targetUrl = $link.prop('href');

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 600);
        }
    });

    $(document).on('click', '.works__item', function() {
        currentIndex = $(this).data('index');
        updateModal();
        $(modal).addClass('is-active');
        $('body').css('overflow', 'hidden');
    });

    const closeModal = () => { $(modal).removeClass('is-active'); $('body').css('overflow', ''); $cursor.css('opacity', 0); $(modal).removeClass('is-cursor-active'); };
    $('.modal__close, #modalBack, .modal__bg').on('click', closeModal);
    $('.filter__btn').on('click', function() { $('.filter__btn').removeClass('is-active'); $(this).addClass('is-active'); displayWorks($(this).data('filter')); });

    $(modal).on('click', function(e) {
        if ($(e.target).closest('.modal__close, .modal__back').length) return;
        const $clickedArrow = $(e.target).closest('.modal__arrowBtn');
        if ($clickedArrow.length) {
            if ($clickedArrow.text().includes('PREV')) {
                currentIndex = (currentIndex - 1 + currentFilteredWorks.length) % currentFilteredWorks.length;
            } else {
                currentIndex = (currentIndex + 1) % currentFilteredWorks.length;
            }
        } else if (window.innerWidth > 768) {
            if ($(e.target).closest('#modalImageContainer img').length) return;
            if (e.clientX < window.innerWidth / 2) {
                currentIndex = (currentIndex - 1 + currentFilteredWorks.length) % currentFilteredWorks.length;
            } else {
                currentIndex = (currentIndex + 1) % currentFilteredWorks.length;
            }
        } else { return; }
        updateModal();
        $('.modal__content').animate({ scrollTop: 0 }, 300);
    });

    // --- 5. マウスストーカー (PCのみ) ---
    $(document).on('mousemove', function(e) {
        if (!$(modal).hasClass('is-active') || window.innerWidth <= 768) return;
        const x = e.clientX, y = e.clientY, width = window.innerWidth;
        const $imgContainer = $('#modalImageContainer');
        const containerRect = $imgContainer[0].getBoundingClientRect();
        const isInVerticalRange = y >= containerRect.top && y <= containerRect.bottom;
        const isOnBtn = $(e.target).closest('.modal__close, .modal__back, .modal__headerText').length > 0;
        const isOnImg = $(e.target).closest('#modalImageContainer img').length > 0;
        $cursor.css({ 'transform': `translate(${x}px, ${y}px)` });
        if (isInVerticalRange && !isOnBtn && !isOnImg) {
            $cursor.css({ 'opacity': 1, 'visibility': 'visible' });
            $(modal).addClass('is-cursor-active');
            if (x < width / 2) {
                $cursorText.html(`<img src="${arrowImgPath}" style="transform: scaleX(-1); width: 6px; height: auto;"> <span>PREV</span>`);
            } else {
                $cursorText.html(`<span>NEXT</span> <img src="${arrowImgPath}" style="width: 6px; height: auto;">`);
            }
        } else {
            $cursor.css({ 'opacity': 0, 'visibility': 'hidden' });
            $(modal).removeClass('is-cursor-active');
        }
    });

    // --- 6. 初期化と演出 ---
    displayWorks();
    
    // 文字のうねうねアニメーション
    document.querySelectorAll('.js-wave-title').forEach(title => {
        const nodes = Array.from(title.childNodes);
        title.innerHTML = '';
        let charIndex = 0;
        nodes.forEach(node => {
            const text = node.nodeType === Node.TEXT_NODE ? node.textContent.trim() : node.textContent;
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.transitionDelay = `${charIndex * 0.05}s`;
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const parentSpan = node.cloneNode(false);
                    parentSpan.appendChild(span);
                    title.appendChild(parentSpan);
                } else {
                    title.appendChild(span);
                }
                charIndex++;
            });
        });
        setTimeout(() => {
            title.classList.add('is-animated');
            const fadeUp = document.querySelector('.js-fade-up');
            if (fadeUp) setTimeout(() => fadeUp.classList.add('is-visible'), 800);
        }, 300);
    });

    const jsTitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { $(entry.target).addClass('is-view'); jsTitleObserver.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -35% 0px' });
    $('.js-title').each(function() { jsTitleObserver.observe(this); });

    const footerLogo = document.querySelector('.footer__logoName');
    if (footerLogo) {
        const text = footerLogo.textContent;
        footerLogo.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${i * 0.05}s`;
            footerLogo.appendChild(span);
        });
        const logoObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { footerLogo.classList.add('is-animated'); logoObserver.unobserve(footerLogo); }
        }, { rootMargin: '0px 0px -5% 0px' });
        logoObserver.observe(footerLogo);
    }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    $(window).on('beforeunload', () => window.scrollTo(0, 0));

    // --- フッターのサブタイトル (Index.htmlと同じ設定) ---
    $('.js-slow-wave').each(function() {
        const $text = $(this);
        const html = $text.html().trim();
        const wrapped = html.replace(/(<span[^>]*>.*?<\/span>)|(<br\s*\/?>)|([^<]+)/gi, (match, g1, g2, g3) => {
            if (g1) return g1; 
            if (g2) return g2; 
            return g3.split('').map(char => {
                if (char === ' ' || char === '　') return '<span>&nbsp;</span>';
                return `<span>${char}</span>`;
            }).join('');
        });
        $text.html(wrapped);
        $text.find('span').each(function(index) {
            $(this).css({
                'display': 'inline-block',
                'transition-delay': (index * 0.04) + 's' 
            });
        });
    });
    const footerSubObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-animated');
                footerSubObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px 0px 0px' }); 

    $('.js-slow-wave').each(function() {
        footerSubObserver.observe(this);
    });
    
    // --- FooterのTopへ戻る (修正版・最終形) ---
    let isFlying = false;

    $('.footer__gotoTop a').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (isFlying) return false;
        isFlying = true;

        const $parent = $('.footer__gotoTop');
        const $img = $parent.find('img').first();

        $parent.css('pointer-events', 'none');

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if (!$img.length) {
            isFlying = false;
            $parent.css('pointer-events', 'auto');
            return;
        }

        const rect = $img[0].getBoundingClientRect();
        const $clone = $img.clone().appendTo('body');

        $clone.css({
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: $img.width() + 'px',
            margin: 0,
            zIndex: 10000,
            pointerEvents: 'none',
            opacity: 1,
            animation: 'none' 
        });
        $clone[0].offsetHeight;
        requestAnimationFrame(() => {
            $clone.addClass('is-flying-animation');

            setTimeout(() => {
                $img.css('visibility', 'hidden');
            }, 50);
        });

        const scrollTarget = $('html, body');

        if (isSafari) {
            setTimeout(() => {
                scrollTarget.stop().animate({ scrollTop: 0 }, 1000, 'swing');
            }, 600);
        } else {
            const delay = isFirefox ? 1000 : 0;
            setTimeout(() => {
                scrollTarget.stop().animate({ scrollTop: 0 }, 800, 'swing');
            }, delay);
        }

        const cleanupTime = isFirefox ? 2500 : (isSafari ? 2200 : 3000);

        setTimeout(() => {
            $clone.remove();
            $img.css('visibility', 'visible');
            $parent.css('pointer-events', 'auto');
            isFlying = false;
        }, cleanupTime);
    });
});