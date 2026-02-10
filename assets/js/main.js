'use strict';

$(function () {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const $body = $('body');
    const $loading = $('#js-loading');
    const $textSpans = $('.loading__text span');
    const $nav = $('.nav');

    window.scrollTo(0, 0);
    $body.addClass('is-loading-now');

    const scrollOptions = {
        rootMargin: '0px 0px -35% 0px',
        threshold: 0
    };

    window.scrollTo(0, 0);
    $body.addClass('is-loading-now');

    // --- ローディングとFV開始の連動 ---
    const startLoading = () => {
        if ($body.hasClass('is-loaded')) return;

        setTimeout(() => {
            $loading.addClass('is-text-active');
            $textSpans.each(function(i) {
                $(this).css('transition-delay', (i * 0.08) + 's');
            });
        }, 200);

        setTimeout(() => {
            $loading.addClass('is-dash');
        }, 2000); 

        setTimeout(() => {
            $loading.addClass('is-loaded'); 

            setTimeout(() => {
                startAnimation(); 
            }, 800);
        }, 3300);
    };

    // --- 【FV出現】 ---
    function startAnimation() {
        if ($body.hasClass('is-loaded')) return;
        $body.removeClass('is-loading-now').addClass('is-loaded');
        console.log("Loading完了：3.3秒後にFVアニメーションを開始しました。");
    }
    const hasLoaded = sessionStorage.getItem('hasLoaded');

    if (!hasLoaded) {
        startLoading();
        sessionStorage.setItem('hasLoaded', 'true');
    } else {
        $body.removeClass('is-loading-now').addClass('is-loaded');
        setTimeout(() => {
            startAnimation();
        }, 100);
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
        $('body').addClass('is-fixed');
        dogJump();
    });

    $('.nav .header__menu, .nav__item a').on('click', function () {
        $nav.removeClass('is-active');
        $('body').removeClass('is-fixed');
        dogJump();
    });

    // --- フッターでヘッダーを隠す処理 ---
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
        }, {
            threshold: 0 
        });

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

    // --- 1. セクションタイトル（一文字ずつ分解してニョキッ） ---
    $('.js-wave-title').each(function() {
        const $title = $(this);
        const html = $title.html();
        const wrappedText = html.replace(/(<span[^>]*>.*?<\/span>)|([^<]+)/g, (match, g1, g2) => {
            if (g1) return g1;
            return g2.split('').map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        });
        
        $title.html(wrappedText);
        $title.find('span').each(function(index) {
            $(this).css({
                'display': 'inline-block',
                'transition-delay': (index * 0.05) + 's'
            });
        });
    });

    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-active');
                titleObserver.unobserve(entry.target);
            }
        });
    }, scrollOptions);

    $('.sectionTitle').each(function() {
        titleObserver.observe(this);
    });

    // --- 2. WORKSの画像リスト ---
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const $item = $(entry.target);
                if ($item.hasClass('is-visible')) return;

                const index = $item.index();
                const isPC = window.innerWidth > 768;
                const columnCount = isPC ? 3 : 1;
                const delayInRow = (index % columnCount) * 150; 
                setTimeout(() => {
                    $item.addClass('is-visible');
                }, 300 + delayInRow);

                itemObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -15% 0px', 
        threshold: 0
    });

    $('.worksList__item').each(function() {
        itemObserver.observe(this);
    });

    // --- 3. NAMEセクションの監視 ---
    const nameSection = document.querySelector('.name');
    if (nameSection) {
        const nameObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(nameSection).addClass('is-active');
                    nameObserver.unobserve(nameSection);
                }
            });
        }, scrollOptions);
        nameObserver.observe(nameSection);
    }

    // --- Worksタイトルの言語判定 ---
    $('.worksLink__title').each(function() {
        const text = $(this).text();
        const isJp = /[^\x00-\x7E]/.test(text);
        if (isJp) {
            $(this).addClass('is-jp'); 
        } else {
            $(this).addClass('is-en'); 
        }
    });

    // --- GOODSコンテンツ ---
    const goodsRows = document.querySelectorAll('.goodsContainer__row');
    if (goodsRows.length > 0) {
        const goodsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        $(entry.target).addClass('is-active');
                    }, 200); 
                    goodsObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -10% 0px', 
            threshold: 0
        });

        goodsRows.forEach(row => {
            goodsObserver.observe(row);
        });
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
        $('body').addClass('is-safari');
    }

    // --- 汎用：タイトルをニョキッとさせる ---
    const jsTitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-view'); 
                jsTitleObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -35% 0px',
        threshold: 0
    });

    $('.js-title').each(function() {
        jsTitleObserver.observe(this);
    });

// --- 一文字ずつ出現 (PROFILEリードはゆっくり) ---
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

        const isProfileLead = $text.hasClass('profileContent__lead');
        
        const isMobile = window.innerWidth <= 768;
        const delaySpeed = isProfileLead ? 0.07 : 0.04; 
        const initialDelay = isProfileLead ? (isMobile ? 0.2 : 0.4) : 0;

        $text.find('span').each(function(index) {
            $(this).css({
                'display': 'inline-block',
                'transition-delay': (initialDelay + (index * delaySpeed)) + 's' 
            });
        });
    });

    // 監視設定
    const slowWaveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-animated');
                slowWaveObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    $('.js-slow-wave').each(function() {
        slowWaveObserver.observe(this);
    });

    // --- フッターロゴのアニメーション ---
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
        }, {
            rootMargin: '0px 0px -5% 0px'
        });
        logoObserver.observe(footerLogo);
    }
});