'use strict';

$(function () {
    const $nav = $('.nav');

    // 犬のジャンプ演出
    function dogJump() {
        const $dog = $('.menuDog');
        $dog.removeClass('is-jumping');
        setTimeout(() => {
            $dog.addClass('is-jumping');
        }, 10);
    }

    // ヘッダーメニュー開閉
    $('.header__topic .header__menu').on('click', function () {
        $nav.addClass('is-active');
        $('body').css('overflow', 'hidden');
        dogJump();
    });

    $('.nav .header__menu, .nav__item a').on('click', function () {
        $nav.removeClass('is-active');
        $('body').css('overflow', '');
        dogJump();
    });

    // フッターでヘッダーを隠す
    const handleHeaderHideAtFooter = () => {
        const header = document.querySelector('.header');
        const footer = document.querySelector('.footer');
        if (!header || !footer) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    header.classList.add('is-hide');
                } else {
                    header.classList.remove('is-hide');
                }
            });
        }, { threshold: 0 });
        observer.observe(footer);
    };
    handleHeaderHideAtFooter();

    // --- FooterのTopへ戻る ---
    let isFlying = false;

    $('.footer__gotoTop a').on('click', function (e) {
        e.preventDefault();

        if (isFlying) return; 
        isFlying = true; 

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        const $parent = $('.footer__gotoTop');
        const $img = $parent.find('img');
        const rect = $img[0].getBoundingClientRect();

        const $clone = $img.clone().appendTo('body');
        $clone.css({
            'position': 'fixed', 
            'top': rect.top + 'px', 
            'left': rect.left + 'px',
            'width': $img.width() + 'px', 
            'margin': '0', 
            'z-index': '10000',
            'pointer-events': 'none', 
            'opacity': '1', 
            'animation': 'none'
        });

        $img.css('visibility', 'hidden');

        const startDelay = isFirefox ? 100 : 10;
        setTimeout(() => { 
            $clone.addClass('is-flying-animation'); 
        }, startDelay);

        if (isSafari) {
            setTimeout(() => {
                $('html, body').stop().animate({ scrollTop: 0 }, 1000, 'swing');
            }, 600);
        } else if (isFirefox) {
            setTimeout(() => {
                $('html, body').stop().animate({ scrollTop: 0 }, 800, 'swing');
            }, 1000);
        } else {
            $('html, body').stop().animate({ scrollTop: 0 }, 800, 'swing');
        }

        const cleanupTime = isFirefox ? 2500 : (isSafari ? 2200 : 3000);
        setTimeout(() => { 
            $clone.remove(); 
            $img.css('visibility', 'visible'); 
            isFlying = false; 
        }, cleanupTime);
    });

    // --- 汎用：タイトル一文字ずつ出現演出 ---
    const waveTitles = document.querySelectorAll('.js-wave-title');
    waveTitles.forEach(title => {
        const nodes = Array.from(title.childNodes);
        title.innerHTML = '';
        let charIndex = 0;
        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const chars = node.textContent.trim().split('');
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.style.transitionDelay = `${charIndex * 0.05}s`;
                    title.appendChild(span);
                    charIndex++;
                });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const char = node.textContent.trim();
                node.innerHTML = `<span>${char}</span>`;
                const innerSpan = node.querySelector('span');
                innerSpan.style.transitionDelay = `${charIndex * 0.05}s`;
                title.appendChild(node);
                charIndex++;
            }
        });
        setTimeout(() => {
            title.classList.add('is-animated');
            setTimeout(() => {
                $('.profileContent__img, .profileContent__inner').addClass('is-visible');
            }, 700);
        }, 300);
    });

    // --- feature-itemの演出 ---
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                featureObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });
    document.querySelectorAll('.feature-item__circle-img').forEach(img => {
        featureObserver.observe(img);
    });

    // --- contactタイトル ---
    const jsTitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-view');
                jsTitleObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    $('.js-title').each(function() {
        jsTitleObserver.observe(this);
    });

    // --- TikTokタイトルの演出 ＋ ビデオ強制再生 ---
    const tiktokObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const video = document.querySelector('#js-video');
                if (video && video.paused) {
                    video.play().catch(() => {});
                }
                tiktokObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    
    const tiktokTitle = document.querySelector('.js-tiktok-title');
    if (tiktokTitle) {
        tiktokObserver.observe(tiktokTitle);
    }

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

    // --- フッターロゴ ---
    const footerLogo = document.querySelector('.footer__logoName');
    if (footerLogo) {
        const text = footerLogo.textContent;
        footerLogo.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.transitionDelay = `${index * 0.05}s`;
            footerLogo.appendChild(span);
        });
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footerLogo.classList.add('is-animated');
                    logoObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -5% 0px' });
        logoObserver.observe(footerLogo);
    }

    // スクロール位置のリセット設定
    if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
    $(window).on('beforeunload', function() { window.scrollTo(0, 0); });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
});