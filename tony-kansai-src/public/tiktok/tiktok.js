(function(){
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function cargar(src){return new Promise(function(ok,ko){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
var g='https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/';
Promise.all([cargar(g+'gsap.min.js')]).then(function(){return Promise.all([cargar(g+'ScrollTrigger.min.js'),cargar(g+'SplitText.min.js'),cargar('https://unpkg.com/lenis@1.3.27/dist/lenis.min.js')])}).then(function(){
  gsap.registerPlugin(ScrollTrigger,SplitText);
  var lenis=new Lenis({lerp:.14});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('[data-split]').forEach(function(el){var s=new SplitText(el,{type:'lines,words',mask:'lines'});gsap.from(s.words,{yPercent:110,duration:1,ease:'expo.out',stagger:.04})});
  gsap.utils.toArray('[data-r]').forEach(function(el){gsap.from(el,{y:40,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%'}})});
  gsap.to('.heroe-f',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.heroe',start:'top top',end:'bottom top',scrub:true}});
}).catch(function(){});
})();