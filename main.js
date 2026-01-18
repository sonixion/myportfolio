// Functional interactions for performance-focused portfolio

document.addEventListener('DOMContentLoaded', () => {
    console.log('Performance Logic: Active');

    // "Stop the Scroll" Effect
    const stopElement = document.querySelector('.anim-stop');
    const actionElement = document.querySelector('.anim-action');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Subtle Parallax / Resistance on "Stop"
        if (stopElement) {
            stopElement.style.transform = `translateY(${scrollY * 0.15}px)`;
        }

        // "Drive Action" - moves forward/right slightly on scroll
        if (actionElement) {
            actionElement.style.transform = `translateX(${scrollY * 0.1}px)`;
        }
    });

    // "Motion" keyword interaction
    const motionKeyword = document.querySelector('.keyword-motion');
    if (motionKeyword) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            motionKeyword.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // SCROLL CUE INTERACTION
    const scrollCue = document.querySelector('.scroll-cue');
    const processSection = document.getElementById('process');

    if (scrollCue && processSection) {
        scrollCue.addEventListener('click', () => {
            processSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- STICKY TIMELINE LOGIC ---
    const timelineObserverOptions = {
        threshold: 0.5, // Trigger when 50% visible (middle of screen)
        rootMargin: "-10% 0px -10% 0px"
    };

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('active'); // Toggle active state
            }
        });
    }, timelineObserverOptions);

    document.querySelectorAll('.timeline-step, .reveal-on-scroll').forEach(el => {
        timelineObserver.observe(el);
    });

    // --- WORK FILTERING LOGIC ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll('.grid-item');
    const itemTimeouts = new Map();

    if (filterBtns.length > 0 && gridItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update Active State
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Filter Items
                let firstVisibleFound = false;

                gridItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    item.classList.remove('nudge-anim'); // Reset animation

                    // Clear existing timeout for this item
                    if (itemTimeouts.has(item)) {
                        clearTimeout(itemTimeouts.get(item));
                        itemTimeouts.delete(item);
                    }

                    if (filter === 'all' || category === filter) {
                        item.style.display = 'flex';
                        void item.offsetWidth; // Force Reflow
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';

                        // Apply nudge to first visible item
                        if (!firstVisibleFound) {
                            item.classList.add('nudge-anim');
                            firstVisibleFound = true;
                        }
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(10px)';

                        const timeoutId = setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                        itemTimeouts.set(item, timeoutId);
                    }
                });
            });
        });

        // Init nudge on first item
        if (gridItems.length > 0) gridItems[0].classList.add('nudge-anim');
    }

    // --- SOUND LOGIC ---
    const soundToggles = document.querySelectorAll('.sound-toggle');
    const allVideos = document.querySelectorAll('video');

    soundToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering any parent clicks

            const btn = e.currentTarget;
            const container = btn.closest('.card-visual');
            const video = container.querySelector('video');

            if (!video) return;

            if (video.muted) {
                // Unmuting: First, mute everyone else
                allVideos.forEach(v => {
                    if (v !== video) {
                        v.muted = true;
                        // update other icons
                        const otherBtn = v.closest('.card-visual').querySelector('.sound-toggle');
                        if (otherBtn) otherBtn.classList.add('muted');
                    }
                });

                // Unmute this one
                video.muted = false;
                btn.classList.remove('muted');
            } else {
                // Muting this one
                video.muted = true;
                btn.classList.add('muted');
            }
        });
    });

    // --- SMART VIDEO PLAYBACK ---
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                if (video.paused) {
                    video.play().catch(e => console.log('Auto-play prevented:', e));
                }
            } else {
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.25 });

    const videos = document.querySelectorAll('video.media-content');
    videos.forEach(v => {
        v.pause(); // Start paused
        videoObserver.observe(v);
    });

});
