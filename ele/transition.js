// transition.js
// Handles cloning the hero and animating it from center to top-right, then navigating.
(function(){
  const links = Array.from(document.querySelectorAll('[role="tab"][href]'));
  if(!links.length) return;

  function animateToCorner(elem, opts){
    const rect = elem.getBoundingClientRect();
    const clone = elem.cloneNode(true);
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const targetSize = opts.targetSize || 80; // px
    const targetRight = opts.right || 24; // px from right
    const targetTop = opts.top || 24; // px from top

    // Style clone to match current on-screen position
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.margin = 0;
    clone.style.zIndex = 9999;
    clone.style.transition = 'all 520ms cubic-bezier(.2,.9,.2,1)';
    clone.style.pointerEvents = 'none';

    document.body.appendChild(clone);

    // Force layout
    clone.getBoundingClientRect();

    // compute target left
    const targetLeft = vw - targetRight - targetSize;

    requestAnimationFrame(() => {
      clone.style.left = targetLeft + 'px';
      clone.style.top = targetTop + 'px';
      clone.style.width = targetSize + 'px';
      clone.style.height = targetSize + 'px';
      clone.style.borderRadius = '50%';
      clone.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      clone.style.transform = 'translateZ(0)';
    });

    return new Promise(resolve => {
      clone.addEventListener('transitionend', function onEnd(e){
        // ensure we only handle once
        clone.removeEventListener('transitionend', onEnd);
        resolve(clone);
      });
      // safety fallback
      setTimeout(() => resolve(clone), 700);
    });
  }

  links.forEach(link => {
    link.addEventListener('click', function(e){
      // If meta/cmd click or middle click, let it through
      if(e.metaKey || e.ctrlKey || e.button === 1) return;
      e.preventDefault();
      const href = this.getAttribute('href');
      const hero = document.getElementById('hero');
      if(!hero){ window.location = href; return; }

      animateToCorner(hero, {targetSize:80, right:20, top:20}).then(clone => {
        // optionally keep clone visible for a moment, then navigate
        setTimeout(() => {
          // clean up clone and navigate
          try{ clone.remove(); }catch(_){}
          window.location = href;
        }, 80);
      });
    });

    // keyboard: Enter/Space should activate same behavior
    link.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        this.click();
      }
    });
  });
})();
